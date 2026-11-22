import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'yiwai223@gmail.com'
const LOG_BUCKET = 'admin-logs'
const LOG_PATH = 'login_logs.json'
const MAX_LOGS = 500

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return null
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function verifyUser(request: Request) {
  const adminClient = getAdminClient()
  if (!adminClient) {
    return {
      error: NextResponse.json(
        {
          error:
            'サーバーに環境変数 SUPABASE_SERVICE_ROLE_KEY が設定されていません。Vercel の Settings → Environment Variables に追加して再デプロイしてください。',
        },
        { status: 500 }
      ),
    }
  }

  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    return {
      error: NextResponse.json({ error: '認証トークンがありません。再ログインしてください。' }, { status: 401 }),
    }
  }

  const { data, error } = await adminClient.auth.getUser(token)
  if (error || !data?.user) {
    return {
      error: NextResponse.json({ error: '認証の確認に失敗しました。再ログインしてください。' }, { status: 401 }),
    }
  }

  return { adminClient, caller: data.user }
}

async function verifyAdmin(request: Request) {
  const auth = await verifyUser(request)
  if ('error' in auth && auth.error) return auth
  const { adminClient, caller } = auth

  const email = (caller.email || '').trim().toLowerCase()
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    return {
      error: NextResponse.json({ error: '管理者権限が必要です。' }, { status: 403 }),
    }
  }

  return { adminClient, caller }
}

async function ensureLogBucket(adminClient: any) {
  const { data } = await adminClient.storage.getBucket(LOG_BUCKET)
  if (!data) {
    await adminClient.storage.createBucket(LOG_BUCKET, { public: false })
  }
}

async function readLoginLogs(adminClient: any): Promise<any[]> {
  try {
    const { data, error } = await adminClient.storage.from(LOG_BUCKET).download(LOG_PATH)
    if (error || !data) return []
    const text = await data.text()
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLoginLogs(adminClient: any, logs: any[]) {
  await ensureLogBucket(adminClient)
  const payload = JSON.stringify(logs.slice(0, MAX_LOGS))
  await adminClient.storage
    .from(LOG_BUCKET)
    .upload(LOG_PATH, new Blob([payload], { type: 'application/json' }), {
      upsert: true,
      contentType: 'application/json',
    })
}

function summarizeUserAgent(ua: string) {
  const os = /iPhone/i.test(ua)
    ? 'iPhone'
    : /iPad/i.test(ua)
    ? 'iPad'
    : /Android/i.test(ua)
    ? 'Android'
    : /Windows/i.test(ua)
    ? 'Windows'
    : /Macintosh|Mac OS/i.test(ua)
    ? 'Mac'
    : 'その他'
  const browser = /Edg/i.test(ua)
    ? 'Edge'
    : /CriOS|Chrome/i.test(ua)
    ? 'Chrome'
    : /FxiOS|Firefox/i.test(ua)
    ? 'Firefox'
    : /Safari/i.test(ua)
    ? 'Safari'
    : ''
  return browser ? `${os} / ${browser}` : os
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient } = auth

  const [usersRes, loginLogs] = await Promise.all([
    adminClient.auth.admin.listUsers({ page: 1, perPage: 200 }),
    readLoginLogs(adminClient),
  ])

  if (usersRes.error) {
    return NextResponse.json(
      { error: 'ユーザー一覧の取得に失敗しました：' + usersRes.error.message },
      { status: 500 }
    )
  }

  const users = (usersRes.data?.users || [])
    .map((u) => ({
      id: u.id,
      email: u.email || '',
      created_at: u.created_at || '',
      last_sign_in_at: u.last_sign_in_at || '',
      isAdmin: (u.email || '').trim().toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    }))
    .sort((a, b) => {
      if (a.isAdmin !== b.isAdmin) return a.isAdmin ? -1 : 1
      return a.email.localeCompare(b.email)
    })

  return NextResponse.json({ users, loginLogs })
}

// ログイン記録の追加（認証済みユーザー本人のみ記録、閲覧は管理者専用）
export async function PUT(request: Request) {
  const auth = await verifyUser(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient, caller } = auth

  let body: { mode?: string } = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const email = caller.email || ''
  const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
  const mode = body.mode === 'viewer' || !isAdmin ? '利用者' : '管理者'
  const ua = request.headers.get('user-agent') || ''
  const device = summarizeUserAgent(ua)
  const now = new Date()

  try {
    const logs = await readLoginLogs(adminClient)
    const latestSame = logs[0]
    if (
      latestSame &&
      latestSame.userId === caller.id &&
      latestSame.device === device &&
      latestSame.mode === mode &&
      now.getTime() - new Date(latestSame.at).getTime() < 60_000
    ) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const entry = {
      id: `${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: caller.id,
      email,
      mode,
      device,
      at: now.toISOString(),
    }
    await writeLoginLogs(adminClient, [entry, ...logs])
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'ログイン記録の保存に失敗しました：' + (err?.message || '') },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient } = auth

  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '有効なメールアドレスを入力してください。' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'パスワードは6文字以上で入力してください。' }, { status: 400 })
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) {
    return NextResponse.json({ error: 'ユーザー登録に失敗しました：' + error.message }, { status: 400 })
  }

  return NextResponse.json({
    user: {
      id: data.user?.id,
      email: data.user?.email,
      created_at: data.user?.created_at,
    },
  })
}

export async function PATCH(request: Request) {
  const auth = await verifyAdmin(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient, caller } = auth

  let body: { id?: string; email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 })
  }

  const targetId = String(body.id || '').trim()
  const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : ''
  const password = body.password !== undefined ? String(body.password) : ''

  if (!targetId) {
    return NextResponse.json({ error: '対象ユーザーIDが指定されていません。' }, { status: 400 })
  }

  const updates: { email?: string; password?: string; email_confirm?: boolean } = {}
  if (email) {
    if (!email.includes('@')) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください。' }, { status: 400 })
    }
    if (targetId === caller.id && email !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: '管理者自身のメールアドレスは変更できません。' },
        { status: 400 }
      )
    }
    updates.email = email
    updates.email_confirm = true
  }
  if (password) {
    if (password.length < 6) {
      return NextResponse.json({ error: '新しいパスワードは6文字以上で入力してください。' }, { status: 400 })
    }
    updates.password = password
  }

  if (!updates.email && !updates.password) {
    return NextResponse.json(
      { error: '変更するメールアドレスまたは新しいパスワードを入力してください。' },
      { status: 400 }
    )
  }

  const { data, error } = await adminClient.auth.admin.updateUserById(targetId, updates)
  if (error) {
    return NextResponse.json({ error: 'ユーザー情報の更新に失敗しました：' + error.message }, { status: 400 })
  }

  return NextResponse.json({
    user: {
      id: data.user?.id,
      email: data.user?.email,
    },
  })
}

export async function DELETE(request: Request) {
  const auth = await verifyAdmin(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient, caller } = auth

  let body: { id?: string; action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 })
  }

  if (body.action === 'clearLogs') {
    await writeLoginLogs(adminClient, [])
    return NextResponse.json({ ok: true })
  }

  const targetId = String(body.id || '').trim()
  if (!targetId) {
    return NextResponse.json({ error: '対象ユーザーIDが指定されていません。' }, { status: 400 })
  }
  if (targetId === caller.id) {
    return NextResponse.json({ error: '管理者自身のアカウントは削除できません。' }, { status: 400 })
  }

  const { error } = await adminClient.auth.admin.deleteUser(targetId)
  if (error) {
    return NextResponse.json({ error: 'ユーザーの削除に失敗しました：' + error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}