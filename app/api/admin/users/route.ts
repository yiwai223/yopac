import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'yiwai223@gmail.com'

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

async function verifyAdmin(request: Request) {
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

  const email = (data.user.email || '').trim().toLowerCase()
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    return {
      error: NextResponse.json({ error: '管理者権限が必要です。' }, { status: 403 }),
    }
  }

  return { adminClient, caller: data.user }
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request)
  if ('error' in auth && auth.error) return auth.error
  const { adminClient } = auth

  const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 })
  if (error) {
    return NextResponse.json({ error: 'ユーザー一覧の取得に失敗しました：' + error.message }, { status: 500 })
  }

  const users = (data?.users || [])
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

  return NextResponse.json({ users })
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

  let body: { id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 })
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