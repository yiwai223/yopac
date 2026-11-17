import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url')
  if (!targetUrl || !targetUrl.startsWith('https://')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // NDLのドメイン以外は中継しない（セキュリティ対策）
  const allowedHosts = ['ndlsearch.ndl.go.jp', 'id.ndl.go.jp']
  const parsed = new URL(targetUrl)
  if (!allowedHosts.includes(parsed.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'YOPAC-Personal-Library/1.0',
        Accept: 'application/xml, application/rdf+xml, application/json, text/plain, */*',
      },
      cache: 'no-store',
    })

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/xml; charset=utf-8',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'NDLへの接続に失敗しました' },
      { status: 502 }
    )
  }
}
