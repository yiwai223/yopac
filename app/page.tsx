'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const HONGAKU_STYLE = `
:root{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;color:#24392d;background:#f4f7f4;line-height:1.6;font-size:15px;--green:#22bf58;--deep:#176b36;--line:#dbe5dc;--blue:#3e5d85}
.yopac-root, .yopac-root *{box-sizing:border-box}
body{margin:0;color:#24392d;background:#f4f7f4}
.yopac-root button,.yopac-root input,.yopac-root select,.yopac-root textarea{font:inherit}
.yopac-root button,.yopac-root a,.yopac-root input,.yopac-root select,.yopac-root textarea{touch-action:manipulation}
.yopac-root button{cursor:pointer}
.yopac-root a{color:#245d97;text-decoration:none}
.yopac-root a:hover{text-decoration:underline}
.yopac-root button:focus-visible,.yopac-root a:focus-visible{outline:3px solid #3d88cc;outline-offset:2px}
.yopac-root .demo-banner{padding:6px 20px;background:#e5efe7;color:#385641;font-size:12px;text-align:center}
.yopac-root header{background:var(--green);display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px max(24px,calc((100vw - 1250px)/2));color:#092a15}
.yopac-root header a,.yopac-root header button.nav-btn{color:inherit;background:transparent;border:0;padding:0;font:inherit;cursor:pointer}
.yopac-root .brand{font-size:23px;font-weight:700;white-space:nowrap}
.yopac-root .brand small{font-size:13px;font-weight:400;margin-left:12px}
.yopac-root nav{display:flex;gap:20px;font-size:14px;flex-wrap:wrap;align-items:center}
.yopac-root main{max-width:1250px;margin:auto;padding:28px 24px 50px}
.yopac-root h1{font-size:25px;margin:0;font-weight:700;color:#24392d}
.yopac-root h2{font-size:19px;margin:0 0 15px;font-weight:700;color:#24392d}
.yopac-root h3{font-size:16px;margin:20px 0 8px;font-weight:600;color:#24392d}
.yopac-root p{margin:8px 0}
.yopac-root .muted{color:#65796c;font-size:13px}
.yopac-root .page-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.yopac-root .toolbar{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin-bottom:14px}
.yopac-root .toolbar input[type=search], .yopac-root .toolbar input#lookup-isbn{flex:1;min-width:230px}
.yopac-root button,.yopac-root .button{border:1px solid var(--line);border-radius:7px;background:white;color:#284333;padding:9px 14px;display:inline-block;line-height:1.5;font-size:14px}
.yopac-root button:hover,.yopac-root .button:hover{background:#f7faf7;text-decoration:none}
.yopac-root .primary{background:var(--deep)!important;color:white!important;border-color:var(--deep)!important}
.yopac-root .primary:hover{background:#12562b!important}
.yopac-root .secondary{background:#eef3ef}
.yopac-root .danger{color:#a32f2f}
.yopac-root .tiny{padding:5px 9px;font-size:13px}
.yopac-root input:not([type=checkbox]):not([type=file]),.yopac-root select,.yopac-root textarea{border:1px solid #cedbd0;padding:9px 11px;border-radius:6px;background:white;color:#24392d;width:100%;max-width:100%;min-width:0}
.yopac-root .toolbar input:not([type=checkbox]):not([type=file]),.yopac-root .toolbar select{width:auto}
.yopac-root input[type=file]{padding:7px 0;font-size:13px;color:#24392d}
.yopac-root input[type=checkbox]{width:18px;height:18px;accent-color:var(--deep)}
.yopac-root textarea{width:100%;resize:vertical}
.yopac-root input:focus,.yopac-root select:focus,.yopac-root textarea:focus{outline:2px solid #7db28d;outline-offset:1px}
.yopac-root .panel{background:white;border:1px solid var(--line);border-radius:10px;padding:20px;margin-bottom:18px}
.yopac-root .table-wrap{background:white;border:1px solid var(--line);border-radius:9px;overflow:auto}
.yopac-root table{width:100%;border-collapse:collapse;text-align:left}
.yopac-root th{background:#eaf1eb;font-weight:600;font-size:13px;white-space:nowrap;color:#284333}
.yopac-root td,.yopac-root th{padding:13px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.yopac-root tbody tr:last-child td{border-bottom:0}
.yopac-root td .title{font-weight:600}
.yopac-root tbody tr:hover{background:#f7faf7}
.yopac-root .badge{display:inline-block;padding:2px 8px;border-radius:5px;background:#eef4ef;color:#346442;font-size:12px;white-space:nowrap;border:1px solid #d5e3d8}
.yopac-root .count{color:#607466;font-size:13px}
.yopac-root .breadcrumb{margin-bottom:18px;font-size:13px}
.yopac-root .detail-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:20px}
.yopac-root .fields{background:white;border:1px solid var(--line);border-radius:9px;overflow:hidden}
.yopac-root .field{padding:15px 20px;border-bottom:1px solid var(--line);overflow-wrap:anywhere}
.yopac-root .field:last-child{border-bottom:0}
.yopac-root .label{color:var(--blue);font-weight:600;font-size:14px;margin-bottom:4px}
.yopac-root .field input,.yopac-root .field select,.yopac-root .field textarea{width:100%}
.yopac-root .cover{max-width:180px;max-height:240px;object-fit:contain;border:1px solid var(--line);border-radius:4px;background:#fff;display:block}
.yopac-root .cover-placeholder{width:110px;min-height:150px;background:#f0f3ef;color:#6b7e70;display:grid;place-items:center;text-align:center;font-size:12px;padding:10px;border-radius:4px;border:1px dashed #cedbd0}
.yopac-root .relations{list-style:none;padding:0;margin:0}
.yopac-root .relations li{padding:10px 0;border-bottom:1px solid var(--line)}
.yopac-root .relations li:last-child{border:0}
.yopac-root .role{font-size:12px;color:#446b8d;margin-left:6px}
.yopac-root .group{background:#f4f7f4;border:1px solid #d3e0d5;border-left:3px solid #80a88a;border-radius:6px;padding:12px;margin:10px 0}
.yopac-root .group-controls,.yopac-root .rule{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
.yopac-root .rule{padding:8px 0}
.yopac-root .rule input{flex:1;min-width:120px;width:auto}
.yopac-root .rule select{width:auto}
.yopac-root .group-controls select{max-width:180px;width:auto}
.yopac-root .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.yopac-root .form-grid > label, .yopac-root .form-grid > .field-box{display:flex;flex-direction:column;gap:6px;font-weight:600;font-size:14px;color:#284333}
.yopac-root .form-grid > label > input, .yopac-root .form-grid > label > select, .yopac-root .form-grid > label > textarea{font-weight:400;font-size:15px}
.yopac-root .form-grid .wide{grid-column:1/-1}
.yopac-root .publisher-box{background:#f8fbf8;border:1px solid var(--line);border-radius:7px;padding:12px}
.yopac-root .publisher-current{font-weight:600;color:#176b36;margin:4px 0 8px;font-size:15px}
.yopac-root .member{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.yopac-root .member>select{flex:1;min-width:150px}
.yopac-root .role-check{display:inline-flex!important;align-items:center;gap:5px;font-size:13px;font-weight:400!important;flex-direction:row!important;cursor:pointer}
.yopac-root .member input[type=text]{width:200px}
.yopac-root .section-note{background:#f0f5f1;padding:12px 16px;border-radius:6px;color:#536958;font-size:13px;margin-bottom:14px}
.yopac-root .mobile-list{display:none}
.yopac-root .book-card{display:flex;gap:13px;padding:14px;background:white;border-bottom:1px solid var(--line);border-left:4px solid #3b9b4e;color:inherit}
.yopac-root .book-card img{width:60px;height:86px;object-fit:contain;flex-shrink:0}
.yopac-root .book-card .cover-placeholder{width:60px;min-height:86px;flex-shrink:0;font-size:11px}
.yopac-root .book-card .copy{min-width:0;flex:1}
.yopac-root .book-card .title{font-size:17px;font-weight:600}
.yopac-root .book-card .meta{font-size:13px;color:#5a705f}
.yopac-root .favorite{font-size:21px}
#toast{position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#1b432b;color:white;padding:12px 22px;border-radius:8px;display:none;max-width:90vw;z-index:50;box-shadow:0 4px 12px rgba(0,0,0,0.18)}
.yopac-root dialog{border:1px solid var(--line);border-radius:12px;padding:24px;max-width:700px;width:calc(100% - 30px);max-height:90vh;overflow:auto;background:white;color:#24392d}
.yopac-root dialog::backdrop{background:#12291a66}
.yopac-root video{width:100%;max-height:280px;background:#17251b;border-radius:8px;object-fit:cover;margin:8px 0}
.yopac-root .link-button{border:0;padding:0;background:transparent;color:#245d97;text-align:left;font-size:inherit}
.yopac-root .link-button:hover{text-decoration:underline;background:transparent}
.yopac-root .empty{padding:35px;text-align:center;color:#637668}
.yopac-root .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.yopac-root .pagination{display:flex;align-items:center;justify-content:center;gap:15px;margin-top:20px}
.yopac-root .inline-links{display:flex;gap:10px;flex-wrap:wrap}
.yopac-root .shoulder-field{display:grid;gap:10px}
.yopac-root .shoulder-field .toolbar{margin-bottom:0}
.yopac-root .shoulder-input-label{display:flex;flex-direction:column;gap:5px}
.yopac-root .picker-result{display:flex;gap:12px;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.yopac-root .picker-result>div{min-width:0;overflow-wrap:anywhere}
.yopac-root .picker-result button{flex-shrink:0}
.yopac-root .member-person{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-width:180px}
#related-picker-search{width:100%;margin:10px 0}
#related-picker-more{margin-top:12px}
.yopac-root [hidden]{display:none!important}
.yopac-root .detail-actions{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;flex-shrink:0}
.yopac-root .detail-actions>*{margin:0;white-space:nowrap}
.yopac-root .thumb-cell{display:flex;gap:12px;align-items:flex-start}
.yopac-root .list-thumb{width:42px;height:60px;object-fit:contain;border:1px solid var(--line);border-radius:3px;background:#fff;flex-shrink:0}
@media(max-width:700px){
  .yopac-root header{padding:16px;display:block}
  .yopac-root header nav{gap:10px 14px;justify-content:flex-start;margin-top:12px;font-size:13px}
  .yopac-root .brand{font-size:21px}
  .yopac-root main{padding:20px 12px 35px}
  .yopac-root .detail-grid,.yopac-root .form-grid{grid-template-columns:1fr}
  .yopac-root .desktop-list{display:none}
  .yopac-root .mobile-list{display:block;border:1px solid var(--line);border-radius:8px;overflow:hidden}
  .yopac-root .toolbar{gap:7px}
  .yopac-root .toolbar input[type=search]{flex-basis:100%}
  .yopac-root .toolbar select{flex:1 1 150px;min-width:140px;max-width:100%}
  .yopac-root .toolbar button{padding:9px 11px}
  .yopac-root h1{font-size:22px}
  .yopac-root .panel{padding:15px}
  .yopac-root .rule{border-bottom:1px solid var(--line)}
  .yopac-root .rule select{flex:1;min-width:110px}
  .yopac-root .group{padding:9px}
  .yopac-root .page-head{gap:10px}
  .yopac-root .member>select{min-width:100%}
  .yopac-root .member input[type=text]{width:100%}
  .yopac-root .field{padding:14px 16px}
  .yopac-root input,.yopac-root select,.yopac-root textarea{font-size:16px}
  .yopac-root .form-grid .wide{grid-column:auto}
}
@media print{
  .yopac-root header,.yopac-root .demo-banner,.yopac-root .toolbar,.yopac-root .pagination,.yopac-root .no-print,.yopac-root button,.yopac-root .breadcrumb{display:none!important}
  body{background:white}
  .yopac-root main{max-width:none;padding:0}
  .yopac-root .desktop-list{display:block}
  .yopac-root .mobile-list{display:none}
  .yopac-root .table-wrap{overflow:visible;border:0}
  .yopac-root a{color:black}
  .yopac-root td,.yopac-root th{font-size:10pt;padding:6px}
  .yopac-root h1{font-size:18pt}
}
`

const AMBIGUOUS_NAME_DEFAULT_CODE: Record<string, string> = {
  '小説. 物語': '933',
  '叢書. 全集. 選集': '408',
  '論文集. 評論集. 講演集': '404',
  '評論. エッセイ. 随筆': '954',
  '記録. 手記. ルポルタージュ': '916',
  '日記. 書簡. 紀行': '915',
  '箴言. アフォリズム. 寸言': '917',
  '作品集': '918',
  '詩': '931',
  '戯曲': '932',
  '辞典': '803',
  '文法. 語法': '815',
  '文章. 文体. 作文': '816',
  '読本. 解釈. 会話': '837',
  '参考図書［レファレンスブック］': '403',
}

export default function YopacAppPage() {
  const router = useRouter()
  const supabase = createClient()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    let scanCleanup: (() => void) | null = null
    let toastTimer: any = null

    async function boot() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

      async function fetchAll(tableName: string, orderCol = 'id', ascending = true) {
        let all: any[] = []
        let from = 0
        const step = 1000
        while (true) {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order(orderCol, { ascending })
            .range(from, from + step - 1)
          if (error) {
            console.error(`Fetch error on ${tableName}:`, error)
            break
          }
          if (!data || data.length === 0) break
          all = all.concat(data)
          if (data.length < step) break
          from += step
        }
        return all
      }

      function safeJsonParse(str: any, fallback: any) {
        if (!str) return fallback
        if (typeof str === 'object') return str
        try {
          return JSON.parse(str)
        } catch {
          return fallback
        }
      }

      const syncEl = document.getElementById('sync-status')
      if (syncEl) syncEl.textContent = 'データを読み込み中…'

      const [rawItems, rawPeople, rawWorks, rawPublishers, rawCategories, rawSettings] =
        await Promise.all([
          fetchAll('items', 'created_at', false),
          fetchAll('people', 'id', true),
          fetchAll('works', 'id', true),
          fetchAll('publishers', 'id', true),
          fetchAll('categories', 'code', true),
          supabase.from('settings').select('*'),
        ])

      // 1. 分類 (classes)
      const classes = rawCategories
        .filter((r) => !r.deleted_at)
        .map((r) => ({
          id: String(r.record_id || r.id),
          _dbId: r.id,
          code: String(r.code ?? '').trim(),
          name: String(r.name ?? '').trim(),
        }))

      const nameToCodeMap: Record<string, string> = {}
      classes.forEach((c) => {
        if (c.name && !nameToCodeMap[c.name]) nameToCodeMap[c.name] = c.code
      })
      Object.entries(AMBIGUOUS_NAME_DEFAULT_CODE).forEach(([k, v]) => {
        nameToCodeMap[k] = v
      })

      // 2. 出版社 (publishers)
      const publishers = rawPublishers
        .filter((r) => !r.deleted_at)
        .map((r) => ({
          id: String(r.record_id || r.id),
          _dbId: r.id,
          name: String(r.name ?? '').trim(),
          reading: String(r.reading ?? '').trim(),
          labels: safeJsonParse(r.labels_json, []),
        }))
      const pubNameToId = new Map(publishers.map((p) => [p.name, p.id]))

      // 3. 人物・団体 (people)
      const people = rawPeople
        .filter((r) => !r.deleted_at)
        .map((r) => ({
          id: String(r.record_id || r.id),
          _dbId: r.id,
          name: String(r.name ?? '').trim(),
          reading: String(r.reading ?? '').trim(),
          description: String(r.description ?? '').trim(),
          url: String(r.url ?? '').trim(),
          original: String(r.original_name ?? '').trim(),
          aliases: safeJsonParse(r.aliases_json, []),
          ndlId: String(r.ndl_id ?? '').trim(),
        }))
      const personNameToId = new Map(people.map((p) => [p.name, p.id]))

      // 4. 作品 (works)
      const works = rawWorks
        .filter((r) => !r.deleted_at)
        .map((r) => {
          let wPeople = safeJsonParse(r.people_json, [])
          if ((!wPeople || !wPeople.length) && r.author) {
            wPeople = String(r.author)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((entry) => {
                const m = entry.match(/^(.+?)\s*\((.+)\)$/)
                const name = m ? m[1].trim() : entry
                const roles = m ? m[2].split('/').map((x) => x.trim()) : []
                const pid = personNameToId.get(name)
                return pid ? { id: pid, roles, printed: '' } : null
              })
              .filter(Boolean)
          }
          return {
            id: String(r.record_id || r.id),
            _dbId: r.id,
            title: String(r.title ?? '').trim(),
            format: String(r.format ?? '').trim(),
            first: String(r.first_published ?? '').trim(),
            originalTitle: String(r.original_title ?? '').trim(),
            people: Array.isArray(wPeople) ? wPeople : [],
            originals: safeJsonParse(r.original_ids_json, []),
            translations: safeJsonParse(r.translation_ids_json, []),
          }
        })

      // 5. 書籍 (books)
      const books = rawItems
        .filter((r) => !r.deleted_at)
        .map((r) => {
          const rawObj = safeJsonParse(r.raw_json || r.saved_json, null)
          const rawCat = String(r.classification || r.category || rawObj?.classification || '').trim()
          const cleanCat =
            rawCat === 'nan'
              ? ''
              : /^\d/.test(rawCat) || /^Z/i.test(rawCat)
              ? rawCat
              : nameToCodeMap[rawCat] || rawCat

          let bPeople = safeJsonParse(r.people_json, null) ?? rawObj?.people ?? []
          if ((!Array.isArray(bPeople) || bPeople.length === 0) && r.author) {
            bPeople = String(r.author)
              .split(/\s*\/\s*|\n/)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((part) => {
                const tokens = part.split(/\s+/)
                if (tokens.length >= 2) {
                  const maybeRole = tokens[tokens.length - 1]
                  const maybeName = tokens.slice(0, -1).join(' ')
                  if (personNameToId.has(maybeName)) {
                    return {
                      id: personNameToId.get(maybeName),
                      roles: maybeRole.split('・').filter(Boolean),
                      printed: '',
                    }
                  }
                }
                const pid = personNameToId.get(part)
                return pid ? { id: pid, roles: [], printed: '' } : null
              })
              .filter(Boolean)
          }

          let pubId = String(r.publisher_id || rawObj?.publisher || '').trim()
          if (!pubId && r.publisher) {
            pubId = pubNameToId.get(String(r.publisher).trim()) || ''
          }

          return {
            id: String(r.record_id || rawObj?.id || r.id),
            _dbId: r.id,
            title: String(r.title ?? rawObj?.title ?? '').trim(),
            subtitle: String(r.subtitle ?? rawObj?.subtitle ?? '').trim(),
            series: String(r.series ?? rawObj?.series ?? '').trim(),
            volume: String(r.volume ?? rawObj?.volume ?? '').trim(),
            publisher: pubId,
            classification: cleanCat,
            status: String(r.status || rawObj?.status || '所蔵').trim(),
            isbn: String(r.isbn ?? rawObj?.isbn ?? '').replace(/\.0$/, '').trim(),
            price: String(r.price ?? rawObj?.price ?? '').replace(/\.0$/, '').trim(),
            purchasePrice: String(r.purchase_price ?? rawObj?.purchasePrice ?? '')
              .replace(/\.0$/, '')
              .trim(),
            registered: String(r.created_at || rawObj?.registered || new Date().toISOString()),
            modified: String(
              r.modified_at || rawObj?.modified || r.created_at || new Date().toISOString()
            ),
            people: Array.isArray(bPeople) ? bPeople : [],
            works: safeJsonParse(r.works_json, null) ?? rawObj?.works ?? [],
            related: safeJsonParse(r.related_json, null) ?? rawObj?.related ?? [],
            rating: String(r.rating ?? rawObj?.rating ?? '').replace(/\.0$/, '').trim(),
            review: String(r.review ?? rawObj?.review ?? '').trim(),
            memo: String(r.memo ?? rawObj?.memo ?? '').trim(),
            cover: String(r.cover ?? rawObj?.cover ?? '').trim(),
            coverAvailable: Boolean(rawObj?.coverAvailable || r.cover),
            coverAssets: safeJsonParse(r.cover_assets_json, null) ?? rawObj?.coverAssets ?? [],
            favorite: Boolean(rawObj?.favorite),
          }
        })

      // 6. 設定 (options & revision)
      const settingsRows = rawSettings.data || []
      const optionsRow = settingsRows.find((s: any) => s.key === 'options')
      const revisionRow = settingsRows.find((s: any) => s.key === 'revision')
      const parsedOptions = safeJsonParse(optionsRow?.value, {})

      let db: any = {
        books,
        people,
        works,
        publishers,
        classes,
        roles: parsedOptions.roles || ['著者', '訳者', '編者', 'その他'],
        statuses: parsedOptions.statuses || [
          '所蔵',
          '未設定',
          '放出',
          '貸出中',
          '別置',
          '販売',
          '不明',
          '探し中',
        ],
        saved: parsedOptions.saved || [],
        shoulderOptions: parsedOptions.shoulderOptions || [
          '博報堂生活総合研究所所長代理',
          '実践女子大学教授',
        ],
        workFormats: parsedOptions.workFormats || [
          '対談・鼎談・座談会',
          '小説・物語',
          'エッセイ・コラム',
          'インタビュー',
          '漫画',
          '解説',
          '伝記・評伝',
          'その他',
          '記録・手記・ルポルタージュ',
          '評伝',
          '随筆・エッセイ・コラム',
          '戯曲・シナリオ',
          '評論・論文',
          '詩・俳句・和歌・短歌',
          'エッセイ',
          'まえがき',
        ],
      }

      let serverRevision = Number(revisionRow?.value || 1)
      let confirmedState = structuredClone(db)
      let pendingTarget: any = null
      let saveRunning = false
      let saveBlocked = false

      const ADMIN_EMAIL = 'yiwai223@gmail.com'
      const urlParams = new URLSearchParams(window.location.search)
      const currentEmail = (user.email || '').trim().toLowerCase()
      const isAdminUser = currentEmail === ADMIN_EMAIL.trim().toLowerCase()
      const isViewer = !isAdminUser || urlParams.get('view') === 'viewer'
      const role = isViewer ? 'viewer' : 'admin'

      const entities = ['books', 'people', 'works', 'publishers']
      const optionKeys = ['roles', 'statuses', 'saved', 'shoulderOptions', 'workFormats']

      function saveStateLabel(message: string, error = false) {
        const el = document.getElementById('sync-status')
        if (!el) return
        el.textContent = message
        el.style.color = error ? '#aa2222' : ''
      }

      function diffState(before: any, after: any) {
        const patches: any[] = []
        for (const type of entities) {
          const old = new Map(before[type].map((r: any) => [r.id, r]))
          const now = new Map(after[type].map((r: any) => [r.id, r]))
          for (const [id, value] of now) {
            if (JSON.stringify(old.get(id)) !== JSON.stringify(value)) {
              patches.push({ type, id, value })
            }
          }
          for (const id of old.keys()) {
            if (!now.has(id)) patches.push({ type, id, value: null })
          }
        }
        const options: any = {}
        for (const key of optionKeys) {
          if (JSON.stringify(before[key] || []) !== JSON.stringify(after[key] || [])) {
            options[key] = after[key] || []
          }
        }
        return { revision: serverRevision, patches, options }
      }

      async function applyPatchesToSupabase(request: any, targetState: any) {
        const pubMap = new Map(targetState.publishers.map((p: any) => [p.id, p.name]))
        const personMap = new Map(targetState.people.map((p: any) => [p.id, p.name]))

        for (const patch of request.patches) {
          const { type, id: recId, value } = patch
          if (type === 'books') {
            if (value === null) {
              await supabase.from('items').delete().eq('record_id', recId)
              if (/^\d+$/.test(String(recId))) {
                await supabase.from('items').delete().eq('id', Number(recId))
              }
            } else {
              const authorStr = (value.people || [])
                .map((m: any) => {
                  const pName = personMap.get(m.id) || m.printed || ''
                  const rStr = (m.roles || []).join('・')
                  return pName ? (rStr ? `${pName} ${rStr}` : pName) : ''
                })
                .filter(Boolean)
                .join(' / ')

              const payload: any = {
                record_id: value.id,
                title: value.title || '（無題）',
                subtitle: value.subtitle || '',
                series: value.series || '',
                volume: value.volume || '',
                publisher_id: value.publisher || '',
                publisher: pubMap.get(value.publisher) || '',
                author: authorStr,
                category: value.classification || '',
                classification: value.classification || '',
                status: value.status || '所蔵',
                isbn: value.isbn || '',
                price: value.price === '' || value.price == null ? null : Number(value.price),
                purchase_price:
                  value.purchasePrice === '' || value.purchasePrice == null
                    ? null
                    : Number(value.purchasePrice),
                created_at: value.registered || new Date().toISOString(),
                modified_at: value.modified || new Date().toISOString(),
                people_json: JSON.stringify(value.people || []),
                works_json: JSON.stringify(value.works || []),
                related_json: JSON.stringify(value.related || []),
                rating: value.rating === '' || value.rating == null ? null : Number(value.rating),
                review: value.review || '',                memo: value.memo || '',
                cover: value.cover || '',
                cover_assets_json: JSON.stringify(value.coverAssets || []),
                raw_json: JSON.stringify(value),
              }

              const { data: existing } = await supabase
                .from('items')
                .select('id')
                .eq('record_id', value.id)
                .maybeSingle()

              if (existing) {
                const { error } = await supabase
                  .from('items')
                  .update(payload)
                  .eq('id', existing.id)
                if (error) throw error
              } else if (value._dbId) {
                const { error } = await supabase
                  .from('items')
                  .update(payload)
                  .eq('id', value._dbId)
                if (error) throw error
              } else {
                const { error } = await supabase.from('items').insert([payload])
                if (error) throw error
              }
            }
          } else if (type === 'people') {
            if (value === null) {
              await supabase.from('people').delete().eq('record_id', recId)
            } else {
              const payload = {
                record_id: value.id,
                name: value.name || '',
                reading: value.reading || '',
                description: value.description || '',
                url: value.url || '',
                original_name: value.original || '',
                aliases_json: JSON.stringify(value.aliases || []),
                ndl_id: value.ndlId || '',
              }
              const { data: existing } = await supabase
                .from('people')
                .select('id')
                .eq('record_id', value.id)
                .maybeSingle()
              if (existing) {
                const { error } = await supabase
                  .from('people')
                  .update(payload)
                  .eq('id', existing.id)
                if (error) throw error
              } else {
                const { error } = await supabase.from('people').insert([payload])
                if (error) throw error
              }
            }
          } else if (type === 'works') {
            if (value === null) {
              await supabase.from('works').delete().eq('record_id', recId)
            } else {
              const authorStr = (value.people || [])
                .map((m: any) => personMap.get(m.id) || '')
                .filter(Boolean)
                .join(', ')
              const payload = {
                record_id: value.id,
                title: value.title || '',
                format: value.format || '',
                first_published: value.first || '',
                original_title: value.originalTitle || '',
                author: authorStr,
                people_json: JSON.stringify(value.people || []),
                original_ids_json: JSON.stringify(value.originals || []),
                translation_ids_json: JSON.stringify(value.translations || []),
              }
              const { data: existing } = await supabase
                .from('works')
                .select('id')
                .eq('record_id', value.id)
                .maybeSingle()
              if (existing) {
                const { error } = await supabase
                  .from('works')
                  .update(payload)
                  .eq('id', existing.id)
                if (error) throw error
              } else {
                const { error } = await supabase.from('works').insert([payload])
                if (error) throw error
              }
            }
          } else if (type === 'publishers') {
            if (value === null) {
              await supabase.from('publishers').delete().eq('record_id', recId)
            } else {
              const payload = {
                record_id: value.id,
                name: value.name || '',
                reading: value.reading || '',
                labels_json: JSON.stringify(value.labels || []),
              }
              const { data: existing } = await supabase
                .from('publishers')
                .select('id')
                .eq('record_id', value.id)
                .maybeSingle()
              if (existing) {
                const { error } = await supabase
                  .from('publishers')
                  .update(payload)
                  .eq('id', existing.id)
                if (error) throw error
              } else {
                const { error } = await supabase.from('publishers').insert([payload])
                if (error) throw error
              }
            }
          }
        }

        if (Object.keys(request.options).length > 0) {
          const optsToSave: any = {}
          for (const k of optionKeys) optsToSave[k] = targetState[k]
          const jsonStr = JSON.stringify(optsToSave)
          const { data: existing } = await supabase
            .from('settings')
            .select('id')
            .eq('key', 'options')
            .maybeSingle()
          if (existing) {
            await supabase.from('settings').update({ value: jsonStr }).eq('id', existing.id)
          } else {
            await supabase.from('settings').insert([{ key: 'options', value: jsonStr }])
          }
        }

        serverRevision += 1
      }

      function queueSave() {
        if (role !== 'admin') {
          notify('利用者は登録・変更できません')
          return
        }
        if (saveBlocked) {
          notify('保存が停止しています。未保存データをバックアップして再読み込みしてください。')
          return
        }
        pendingTarget = structuredClone(db)
        saveStateLabel('保存中…')
        if (!saveRunning) Promise.resolve().then(flushSaves)
      }

      async function flushSaves() {
        if (saveRunning || saveBlocked) return
        saveRunning = true
        try {
          while (pendingTarget) {
            const target = pendingTarget
            pendingTarget = null
            const request = diffState(confirmedState, target)
            if (request.patches.length || Object.keys(request.options).length) {
              await applyPatchesToSupabase(request, target)
            }
            confirmedState = structuredClone(target)
          }
          saveStateLabel('保存済み')
          notify('Supabaseデータベースに保存しました')
        } catch (error: any) {
          saveBlocked = true
          const failed = structuredClone(pendingTarget || db)
          pendingTarget = null
          db = structuredClone(confirmedState)
          saveStateLabel('保存失敗・未保存の編集あり', true)
          route()
          openModal(
            `<h2>変更を保存できませんでした</h2><p>${esc(
              error?.message || String(error)
            )}</p><p>データベースに確認できた状態へ戻しました。未保存の編集は下のボタンで保管できます。</p><div class="toolbar"><button type="button" id="export-failed">未保存の編集をJSONで保存</button><button type="button" id="reload-server">最新データを読み直す</button></div>`
          )
          const expBtn = $('#export-failed')
          if (expBtn)
            expBtn.onclick = () =>
              download('YOPAC-未保存編集.json', JSON.stringify(failed, null, 2))
          const relBtn = $('#reload-server')
          if (relBtn) relBtn.onclick = () => location.reload()
        } finally {
          saveRunning = false
        }
      }

      // 3. 書影解決ロジック（Supabase Storage `covers` バケット ＋ ISBN書影API自動フォールバック）
      const placeholderCover =
        'data:image/svg+xml,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="240"><rect width="180" height="240" fill="#edf3ee"/><text x="90" y="125" text-anchor="middle" fill="#66786b" font-size="13">書影なし</text></svg>'
        )

      function toIsbn13(rawIsbn?: string) {
        const clean = String(rawIsbn || '').replace(/[\s-]/g, '').toUpperCase()
        if (/^97[89]\d{10}$/.test(clean)) return clean
        if (/^\d{9}[\dX]$/.test(clean)) {
          const core = '978' + clean.slice(0, 9)
          const sum = [...core].reduce((acc, c, idx) => acc + Number(c) * (idx % 2 === 0 ? 1 : 3), 0)
          const check = (10 - (sum % 10)) % 10
          return core + String(check)
        }
        return ''
      }

      function coverSource(value: string, isbn?: string) {
        const isbn13 = toIsbn13(isbn)
        if (value) {
          if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
            return value
          }
          if (value.startsWith('asset:') && supabaseUrl) {
            const fileName = value.slice(6).trim()
            return `${supabaseUrl}/storage/v1/object/public/covers/${encodeURIComponent(fileName)}`
          }
        }
        if (isbn13) {
          return `https://ndlsearch.ndl.go.jp/thumbnail/${isbn13}.jpg`
        }
        return placeholderCover
      }

      function renderCoverImg(book: any, className = 'cover') {
        const src = coverSource(book.cover, book.isbn)
        const isbn13 = toIsbn13(book.isbn)
        const fallbackIsbnUrl = isbn13 ? `https://ndlsearch.ndl.go.jp/thumbnail/${isbn13}.jpg` : ''
        if (src === placeholderCover && !fallbackIsbnUrl) {
          return `<div class="cover-placeholder">${book.coverAvailable ? '書影未取込' : '書影なし'}</div>`
        }
        return `<img class="${className}" src="${esc(src)}" data-isbn-fallback="${esc(
          fallbackIsbnUrl
        )}" data-placeholder="${esc(
          placeholderCover
        )}" alt="書影" loading="lazy" onerror="if(this.dataset.isbnFallback && this.src!==this.dataset.isbnFallback){this.src=this.dataset.isbnFallback;}else{this.src=this.dataset.placeholder;}">`
      }

      const app = document.getElementById('app')!
      const modal = document.getElementById('modal') as HTMLDialogElement
      const modalBody = document.getElementById('modal-body')!

      const $ = (q: string, p: ParentNode = document) => p.querySelector(q) as any
      const $$ = (q: string, p: ParentNode = document) => [...p.querySelectorAll(q)] as any[]
      const esc = (v: any) =>
        String(v ?? '').replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
        )
      const id = () =>
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? 'rec-' + crypto.randomUUID().replace(/-/g, '')
          : 'rec-' + Date.now() + '-' + Math.random().toString(16).slice(2)
      const opts = (items: any[], value?: any) =>
        items
          .map((x) => {
            const v = typeof x === 'string' ? x : x.id
            const n = typeof x === 'string' ? x : x.name
            return `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(n)}</option>`
          })
          .join('')

      function persist() {
        queueSave()
      }

      function notify(s: string) {
        if (
          (saveRunning || pendingTarget) &&
          /保存しました|削除しました|更新しました|変更しました|登録しました/.test(s)
        ) {
          s = 'データベースへ保存中…'
        }
        const t = $('#toast')
        if (!t) return
        t.textContent = s
        t.style.display = 'block'
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => {
          t.style.display = 'none'
        }, 3500)
      }

      function openModal(html: string) {
        modalBody.innerHTML = html
        if (!modal.open) modal.showModal()
      }

      function closeModal() {
        if (scanCleanup) {
          scanCleanup()
          scanCleanup = null
        }
        if (modal.open) modal.close()
      }

      $('#close-modal').onclick = closeModal
      modal.addEventListener('cancel', () => {
        scanCleanup?.()
        scanCleanup = null
      })
      modal.addEventListener('close', () => {
        scanCleanup?.()
        scanCleanup = null
      })

      const person = (i: string) => db.people.find((x: any) => x.id === i)
      const work = (i: string) => db.works.find((x: any) => x.id === i)
      const publisher = (i: string) => db.publishers.find((x: any) => x.id === i)?.name || ''
      const fmt = (d: string) => (d ? new Date(d).toLocaleString('ja-JP') : '—')
      const money = (v: any) =>
        v === '' || v == null || isNaN(Number(v)) ? '—' : Number(v).toLocaleString('ja-JP') + '円'
      const normal = (v: any) => String(v ?? '').normalize('NFKC').toLowerCase().replace(/[\s ]+/g, '').trim()
      const isbnClean = (s: any) =>
        String(s ?? '')
          .normalize('NFKC')
          .replace(/[\s-]/g, '')
          .toUpperCase()

      function validISBN(s: string) {
        s = isbnClean(s)
        if (/^\d{9}[\dX]$/.test(s))
          return (
            [...s].reduce((t, c, i) => t + (c === 'X' ? 10 : Number(c)) * (10 - i), 0) % 11 === 0
          )
        if (/^97[89]\d{10}$/.test(s))
          return [...s].reduce((t, c, i) => t + Number(c) * (i % 2 ? 3 : 1), 0) % 10 === 0
        return false
      }

      function className(code: string) {
        const c = String(code || '')
        return (
          db.classes.find((x: any) => x.code === c)?.name ||
          db.classes.find((x: any) => x.code === c.slice(0, 3))?.name ||
          ''
        )
      }

      function classLabel(code: string, level: number) {
        const prefix = String(code || '').slice(0, level)
        const target = prefix.padEnd(3, '0')
        return db.classes.find((x: any) => x.code === target)?.name || className(code)
      }

      function personText(p: any) {
        return p ? [p.name, p.reading, p.original, ...(p.aliases || [])].join(' ') : ''
      }

      function memberships(m: any[]) {
        return (m || [])
          .map(
            (v) =>
              personText(person(v.id)) + ' ' + (v.roles || []).join(' ') + ' ' + (v.printed || '')
          )
          .join(' ')
      }

      const fieldDefs: Record<string, string> = {
        title: '書名',
        subtitle: '副題',
        person: '人物・団体（別表記含む）',
        role: '人物の役割',
        work: '収録作品',
        publisher: '出版社・レーベル',
        series: 'シリーズ名',
        classification: '分類番号',
        status: '状態',
        isbn: 'ISBN',
        registered: '登録日',
        modified: '変更日',
        price: '価格',
        purchasePrice: '購入価格',
        memo: 'メモ',
      }

      function valueFor(b: any, f: string) {
        switch (f) {
          case 'person':
            return memberships(b.people)
          case 'role':
            return (b.people || []).flatMap((p: any) => p.roles || []).join(' ')
          case 'work':
            return (b.works || []).map((i: string) => work(i)?.title || '').join(' ')
          case 'publisher':
            return publisher(b.publisher)
          case 'registered':
          case 'modified':
            return b[f]?.slice(0, 10) || ''
          default:
            return b[f] ?? ''
        }
      }

      function testRule(b: any, r: any) {
        const raw = valueFor(b, r.field)
        const v = normal(raw)
        const q = normal(r.value)
        switch (r.op) {
          case 'empty':
            return raw === '' || raw == null
          case 'filled':
            return raw !== '' && raw != null
          case 'prefix':
            return v.startsWith(q)
          case 'equals':
            return r.field === 'isbn' ? isbnClean(raw) === isbnClean(r.value) : v === q
          case 'not':
            return !v.includes(q)
          case 'gte':
          case 'lte':
            if (raw === '' || raw == null) return false
            return ['price', 'purchasePrice'].includes(r.field)
              ? r.op === 'gte'
                ? Number(raw) >= Number(r.value)
                : Number(raw) <= Number(r.value)
              : r.op === 'gte'
              ? v >= q
              : v <= q
          default:
            return v.includes(q)
        }
      }

      function evaluate(b: any, g: any): boolean {
        if (g.field) return testRule(b, g)
        if (!g.children || !g.children.length) return true
        const v =
          g.mode === 'OR'
            ? g.children.some((c: any) => evaluate(b, c))
            : g.children.every((c: any) => evaluate(b, c))
        return g.negate ? !v : v
      }

      let filters: any = {
        q: '',
        publisher: '',
        status: '',
        series: '',
        cls: '',
        sort: 'registered',
        asc: false,
        favorite: false,
        tree: { mode: 'AND', negate: false, children: [] },
      }
      let page = 1
      let advanced = false
      let lastResults: any[] = []

      function selectedBooks() {
        const a = db.books.filter(
          (b: any) =>
            (!filters.q ||
              normal(
                [
                  b.title,
                  b.subtitle,
                  memberships(b.people),
                  (b.works || []).map((i: string) => work(i)?.title || '').join(' '),
                  publisher(b.publisher),
                  b.isbn,
                ].join(' ')
              ).includes(normal(filters.q))) &&
            (!filters.publisher || b.publisher === filters.publisher) &&
            (!filters.status || b.status === filters.status) &&
            (!filters.series || b.series === filters.series) &&
            (!filters.cls || String(b.classification || '').startsWith(filters.cls)) &&
            (!filters.favorite || b.favorite) &&
            evaluate(b, filters.tree)
        )
        a.sort((xObj: any, yObj: any) => {
          let x = valueFor(xObj, filters.sort)
          let y = valueFor(yObj, filters.sort)
          if (filters.sort === 'volume') {
            x = xObj.volume
            y = yObj.volume
          }
          return normal(x).localeCompare(normal(y), 'ja', { numeric: true }) * (filters.asc ? 1 : -1)
        })
        return a
      }

      function ruleHTML(g: any, path = ''): string {
        if (g.field)
          return `<div class="rule" data-path="${path}"><select data-field aria-label="検索項目">${Object.entries(
            fieldDefs
          )
            .map(([v, n]) => `<option value="${v}" ${g.field === v ? 'selected' : ''}>${n}</option>`)
            .join('')}</select><select data-op aria-label="比較方法">${Object.entries({
            contains: '含む',
            equals: '一致',
            prefix: 'で始まる',
            not: '含まない',
            gte: '以上／以降',
            lte: '以下／以前',
            empty: '空欄',
            filled: '入力済み',
          })
            .map(([v, n]) => `<option value="${v}" ${g.op === v ? 'selected' : ''}>${n}</option>`)
            .join('')}</select><input data-value aria-label="検索値" value="${esc(
            g.value
          )}" placeholder="検索値" ${
            ['empty', 'filled'].includes(g.op) ? 'disabled' : ''
          }><button type="button" class="tiny danger" data-remove="${path}">削除</button></div>`
        return `<div class="group" data-path="${path}"><div class="group-controls"><select data-mode aria-label="条件の組み合わせ"><option value="AND" ${
          g.mode === 'AND' ? 'selected' : ''
        }>すべて一致（AND）</option><option value="OR" ${
          g.mode === 'OR' ? 'selected' : ''
        }>いずれか一致（OR）</option></select><label class="role-check"><input type="checkbox" data-negate ${
          g.negate ? 'checked' : ''
        }>結果を除外（NOT）</label><button type="button" class="tiny" data-add-rule="${path}">＋ 条件</button><button type="button" class="tiny" data-add-group="${path}">＋ グループ</button>${
          path ? `<button type="button" class="tiny danger" data-remove="${path}">削除</button>` : ''
        }</div>${(g.children || [])
          .map((v: any, i: number) => ruleHTML(v, path ? path + '.' + i : String(i)))
          .join('')}</div>`
      }

      function treeAt(path: string) {
        return path
          ? path.split('.').reduce((v: any, k: string) => v.children[Number(k)], filters.tree)
          : filters.tree
      }

      function readTreeUI() {
        function walk(node: any) {
          const g = treeAt(node.dataset.path)
          if (!g) return
          if (g.field) {
            g.field = $('[data-field]', node).value
            g.op = $('[data-op]', node).value
            g.value = $('[data-value]', node).value
          } else {
            g.mode = node.children[0].querySelector('[data-mode]').value
            g.negate = node.children[0].querySelector('[data-negate]').checked
          }
        }
        $$('#conditions [data-path]').forEach(walk)
      }

      function listBooks(preserveInput = false) {
        lastResults = selectedBooks()
        const pages = Math.max(1, Math.ceil(lastResults.length / 25))
        page = Math.min(page, pages)
        const visible = lastResults.slice((page - 1) * 25, page * 25)
        const markup = `<div class="page-head"><div><h1>所蔵リスト</h1><div class="count">${
          db.books.length
        }冊から ${lastResults.length}冊${filters.series ? ' · ' + esc(filters.series) : ''}${
          filters.cls
            ? ' · ' + esc(filters.cls) + ' ' + esc(classLabel(filters.cls, filters.cls.length))
            : ''
        }</div></div>${
          role === 'admin' ? '<a class="button primary" href="#book/new">＋ 蔵書追加</a>' : ''
        }</div><form class="toolbar" id="quick-search" role="search"><input type="search" id="search" aria-label="蔵書検索" enterkeyhint="search" autocomplete="off" placeholder="書名・人物名・作品名・出版社・ISBNで検索" value="${esc(
          filters.q
        )}"><button type="submit" class="primary" id="run-search">検索</button><button type="button" id="scan">ISBN読取</button><button type="button" id="advanced" class="${
          advanced ? 'secondary' : ''
        }">詳細検索</button></form><div class="toolbar"><select id="status-filter" aria-label="状態"><option value="">すべての状態</option>${opts(
          db.statuses,
          filters.status
        )}</select><button type="button" id="class-filter">分類から選ぶ${
          filters.cls ? '：' + esc(filters.cls) : ''
        }</button><select id="sort" aria-label="並び順">${opts(
          Object.entries({
            registered: '登録日順',
            modified: '変更日順',
            classification: '分類番号順',
            publisher: '出版社名順',
            title: '書名順',
            volume: '巻号順',
            price: '価格順',
            purchasePrice: '購入価格順',
          }).map(([id, name]) => ({ id, name })),
          filters.sort
        )}</select><button type="button" id="direction">${
          filters.asc ? '↑ 昇順' : '↓ 降順'
        }</button>${
          role === 'admin'
            ? `<button type="button" id="favorites">${filters.favorite ? '★' : '☆'} お気に入り</button>`
            : ''
        }<button type="button" id="clear">条件解除</button></div><section id="advanced-panel" class="panel" ${
          advanced ? '' : 'hidden'
        }><h2>詳細検索</h2><div class="muted">日付は YYYY-MM-DD、価格は円。人物の役割は書籍に付けたラベルを検索します。</div><div id="conditions">${ruleHTML(
          filters.tree
        )}</div><div class="toolbar"><button type="button" class="primary" id="apply">この条件で検索</button>${
          role === 'admin'
            ? `<input id="search-name" placeholder="条件の保存名" aria-label="検索条件名"><button type="button" id="save-search">条件を保存</button><select id="load-search" aria-label="保存検索"><option value="">保存した条件</option>${opts(
                db.saved.map((x: any) => ({ id: x.id, name: x.name }))
              )}</select>`
            : ''
        }</div></section><div class="toolbar no-print"><button type="button" id="csv">CSV出力</button><button type="button" id="print">印刷・PDF保存</button><span class="muted" id="output-count">現在の条件・並び順で全${
          lastResults.length
        }冊を出力</span></div><div class="desktop-list table-wrap"><table><thead><tr><th>題名</th><th>著者等</th><th>出版社</th><th>分類・主題分野</th><th>状態</th></tr></thead><tbody>${visible
          .map(
            (b: any) =>
              `<tr><td><div class="thumb-cell">${
                b.cover || b.isbn
                  ? `<a href="${role === 'admin' ? `#book/${b.id}` : '#books'}">${renderCoverImg(
                      b,
                      'list-thumb'
                    )}</a>`
                  : ''
              }<div>${
                role === 'admin'
                  ? `<a class="title" href="#book/${b.id}">${esc(b.title) || '（書名未入力）'}</a>`
                  : `<span class="title">${esc(b.title) || '（書名未入力）'}</span>`
              }${
                b.subtitle && !b.series ? `<div class="muted">${esc(b.subtitle)}</div>` : ''
              }${
                b.series
                  ? `<div><button type="button" class="link-button tiny" data-series="${esc(
                      b.series
                    )}">${esc(b.series)}</button> ${esc(b.volume)}</div>`
                  : b.volume
                  ? `<div class="muted">${esc(b.volume)}</div>`
                  : ''
              }</div></div></td><td>${(b.people || [])
                .map((p: any) =>
                  role === 'admin'
                    ? `<a href="#person/${p.id}">${esc(
                        person(p.id)?.name || p.printed || '未設定'
                      )}</a><span class="role">${esc(
                        (p.roles || []).join('・') || '役割未設定'
                      )}</span>`
                    : `<span>${esc(
                        person(p.id)?.name || p.printed || '未設定'
                      )}</span><span class="role">${esc(
                        (p.roles || []).join('・') || '役割未設定'
                      )}</span>`
                )
                .join('<br>')}</td><td><button type="button" class="link-button" data-publisher="${
                b.publisher
              }">${esc(
                publisher(b.publisher)
              )}</button></td><td><button type="button" class="link-button" data-class="${esc(
                String(b.classification || '').slice(0, 3)
              )}">${esc(b.classification)}</button><div class="muted">${esc(
                className(b.classification)
              )}</div></td><td><span class="badge">${esc(b.status)}</span></td></tr>`
          )
          .join('')}</tbody></table></div><div class="mobile-list">${visible
          .map(
            (b: any) =>
              `<a class="book-card" href="${
                role === 'admin' ? `#book/${b.id}` : '#books'
              }">${renderCoverImg(b, '')}<div class="copy"><div class="title">${esc(
                b.title
              )}</div>${b.subtitle ? `<div>${esc(b.subtitle)}</div>` : ''}<div>${esc(
                (b.people || [])
                  .map((p: any) => person(p.id)?.name || p.printed)
                  .filter(Boolean)
                  .join(' / ')
              )}</div><div>${esc(publisher(b.publisher))}</div><div class="meta">${esc(
                b.classification
              )} ${esc(
                className(b.classification)
              )}</div><div class="meta"><span class="badge">${esc(
                b.status
              )}</span></div></div><span>›</span></a>`
          )
          .join('')}</div><div id="empty-results" class="empty" ${
          visible.length ? 'hidden' : ''
        }>該当する本がありません。条件を変えてください。</div><div class="pagination"><button type="button" id="prev" ${
          page === 1 ? 'disabled' : ''
        }>前へ</button><span>${page} / ${pages}</span><button type="button" id="next" ${
          page === pages ? 'disabled' : ''
        }>次へ</button></div>`

        if (preserveInput && $('#search')) {
          const next = document.createElement('div')
          next.innerHTML = markup
          for (const selector of [
            '.page-head .count',
            '#output-count',
            '.desktop-list',
            '.mobile-list',
            '#empty-results',
            '.pagination',
          ]) {
            const current = $(selector, app)
            const replacement = $(selector, next)
            if (current && replacement) current.replaceWith(replacement)
          }
        } else {
          app.innerHTML = markup
        }

        const search = $('#search')
        const updateResults = () => {
          filters.q = search.value
          page = 1
          listBooks(true)
        }
        search.oninput = updateResults
        search.oncompositionend = updateResults
        search.onchange = updateResults
        search.onsearch = updateResults
        $('#quick-search').onsubmit = (e: Event) => {
          e.preventDefault()
          updateResults()
          search.blur()
        }
        $('#status-filter').onchange = (e: any) => {
          filters.status = e.target.value
          page = 1
          listBooks()
        }
        $('#sort').onchange = (e: any) => {
          filters.sort = e.target.value
          listBooks()
        }
        $('#direction').onclick = () => {
          filters.asc = !filters.asc
          listBooks()
        }
        if ($('#favorites')) {
          $('#favorites').onclick = () => {
            filters.favorite = !filters.favorite
            listBooks()
          }
        }
        $('#clear').onclick = () => {
          filters = {
            q: '',
            publisher: '',
            status: '',
            series: '',
            cls: '',
            sort: 'registered',
            asc: false,
            favorite: false,
            tree: { mode: 'AND', negate: false, children: [] },
          }
          page = 1
          listBooks()
        }
        $('#advanced').onclick = () => {
          advanced = !advanced
          listBooks()
        }
        $('#scan').onclick = () =>
          scanISBN((s: string) => {
            filters.q = s
            page = 1
            listBooks()
          })
        $('#class-filter').onclick = classPicker
        $('#prev').onclick = () => {
          page--
          listBooks()
        }
        $('#next').onclick = () => {
          page++
          listBooks()
        }
        $('#csv').onclick = exportCSV
        $('#print').onclick = printList
        bindFilterLinks()
        bindConditions()
      }

      function bindConditions() {
        $$('[data-add-rule]').forEach(
          (e) =>
            (e.onclick = () => {
              readTreeUI()
              treeAt(e.dataset.addRule).children.push({
                field: 'title',
                op: 'contains',
                value: '',
              })
              listBooks()
            })
        )
        $$('[data-add-group]').forEach(
          (e) =>
            (e.onclick = () => {
              readTreeUI()
              treeAt(e.dataset.addGroup).children.push({
                mode: 'OR',
                negate: false,
                children: [{ field: 'publisher', op: 'contains', value: '' }],
              })
              listBooks()
            })
        )
        $$('[data-remove]').forEach(
          (e) =>
            (e.onclick = () => {
              readTreeUI()
              const parts = e.dataset.remove.split('.')
              const i = Number(parts.pop())
              treeAt(parts.join('.')).children.splice(i, 1)
              listBooks()
            })
        )
        $$('[data-op]').forEach(
          (e) =>
            (e.onchange = () => {
              const n = e.closest('.rule')
              $('[data-value]', n).disabled = ['empty', 'filled'].includes(e.value)
            })
        )
        if ($('#apply')) {
          $('#apply').onclick = () => {
            readTreeUI()
            page = 1
            listBooks()
          }
        }
        if ($('#save-search')) {
          $('#save-search').onclick = () => {
            readTreeUI()
            const name = $('#search-name').value.trim()
            if (!name) return notify('保存名を入力してください')
            db.saved.push({ id: id(), name, filters: structuredClone(filters) })
            persist()
            listBooks()
            notify('検索条件を保存しました')
          }
        }
        if ($('#load-search')) {
          $('#load-search').onchange = (e: any) => {
            const x = db.saved.find((s: any) => s.id === e.target.value)
            if (x) {
              filters = structuredClone(x.filters)
              page = 1
              listBooks()
            }
          }
        }
      }

      function bindFilterLinks() {
        $$('[data-series]').forEach(
          (e) =>
            (e.onclick = () => {
              filters.series = e.dataset.series
              filters.sort = 'volume'
              filters.asc = true
              goBooks()
            })
        )
        $$('[data-publisher]').forEach(
          (e) =>
            (e.onclick = () => {
              filters.publisher = e.dataset.publisher
              goBooks()
            })
        )
        $$('[data-class]').forEach(
          (e) =>
            (e.onclick = () => {
              filters.cls = e.dataset.class
              goBooks()
            })
        )
      }

      function goBooks() {
        page = 1
        if (location.hash === '#books' || location.hash === '') listBooks()
        else location.hash = '#books'
      }

function classPicker() {
        let prefix = ''
        let nonDecimalMode = false
        function draw() {
          if (nonDecimalMode) {
            const others = db.classes
              .filter((c: any) => c.code && !/^\d{3}/.test(c.code))
              .sort((a: any, b: any) =>
                normal(a.code).localeCompare(normal(b.code), 'ja', { numeric: true })
              )
            openModal(
              `<h2>分類で所蔵リストを表示</h2><p>十進分類法（数字3桁）以外の分類</p><div class="toolbar"><button type="button" id="class-back-decimal">十進分類法に戻る</button></div><div class="inline-links">${
                others
                  .map(
                    (c: any) =>
                      `<button type="button" data-exact-class="${esc(c.code)}">${esc(
                        c.code
                      )} ${esc(c.name)} <span class="count">${
                        db.books.filter(
                          (b: any) => String(b.classification || '').trim() === c.code
                        ).length
                      }冊</span></button>`
                  )
                  .join('') || '<p class="muted">十進分類法以外の分類が登録されていません。</p>'
              }</div>`
            )
            $('#class-back-decimal').onclick = () => {
              nonDecimalMode = false
              prefix = ''
              draw()
            }
            $$('[data-exact-class]', modalBody).forEach((e) => {
              e.onclick = () => {
                filters.cls = e.dataset.exactClass
                closeModal()
                goBooks()
              }
            })
            return
          }

          const level = prefix.length + 1
          const codes =
            level <= 3
              ? [
                  ...new Set(
                    db.classes
                      .filter((c: any) => /^\d{3}/.test(c.code) && c.code.startsWith(prefix))
                      .map((c: any) => c.code.slice(0, level))
                  ),
                ].sort()
              : []
          const hasNonDecimal = db.classes.some((c: any) => c.code && !/^\d{3}/.test(c.code))

          openModal(
            `<h2>分類で所蔵リストを表示</h2><p>${
              prefix ? `${esc(prefix)} ${esc(classLabel(prefix, prefix.length))}` : '第1次区分を選択'
            }</p><div class="toolbar"><button type="button" id="choose-class" class="primary">${
              prefix ? 'この分類全体を表示' : 'すべて表示'
            }</button>${
              prefix ? '<button type="button" id="class-up">上の階層へ</button>' : ''
            }${
              !prefix && hasNonDecimal
                ? '<button type="button" id="choose-non-decimal" class="secondary">その他の分類（NDC以外）</button>'
                : ''
            }</div><div class="inline-links">${codes
              .map(
                (c: any) =>
                  `<button type="button" data-prefix="${c}">${c} ${esc(
                    classLabel(c, c.length)
                  )} <span class="count">${
                    db.books.filter((b: any) => String(b.classification || '').startsWith(c)).length
                  }冊</span></button>`
              )
              .join('')}</div>`
          )
          $$('[data-prefix]', modalBody).forEach((e) => {
            e.onclick = () => {
              if (e.dataset.prefix.length >= 3) {
                filters.cls = e.dataset.prefix
                closeModal()
                goBooks()
              } else {
                prefix = e.dataset.prefix
                draw()
              }
            }
          })
          $('#choose-class').onclick = () => {
            filters.cls = prefix
            closeModal()
            goBooks()
          }
          if ($('#class-up')) {
            $('#class-up').onclick = () => {
              prefix = prefix.slice(0, -1)
              draw()
            }
          }
          if ($('#choose-non-decimal')) {
            $('#choose-non-decimal').onclick = () => {
              nonDecimalMode = true
              draw()
            }
          }
        }
        draw()
      }
      
      function download(name: string, text: string, type = 'application/json') {
        const url = URL.createObjectURL(new Blob([text], { type }))
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }

      function exportCSV() {
        const safe = (v: any) => {
          let s = String(v ?? '')
          if (/^[=+@\-\t\r]/.test(s)) s = "'" + s
          return '"' + s.replaceAll('"', '""') + '"'
        }
        const rows = [
          [
            '登録日',
            '変更日',
            '分類番号',
            '主題分野',
            '書名',
            'シリーズ名',
            '巻号',
            '著者等',
            '出版社',
            '状態',
            'ISBN',
            '価格',
            '購入価格',
          ],
          ...lastResults.map((b: any) => [
            fmt(b.registered),
            fmt(b.modified),
            b.classification,
            className(b.classification),
            b.title,
            b.series,
            b.volume,
            (b.people || [])
              .map(
                (p: any) =>
                  ((p.roles || []).join('・') || '役割未設定') +
                  ': ' +
                  (person(p.id)?.name || p.printed || '')
              )
              .join(' / '),
            publisher(b.publisher),
            b.status,
            b.isbn,
            b.price,
            b.purchasePrice,
          ]),
        ]
        download(
          '所蔵リスト.csv',
          '\uFEFF' + rows.map((r) => r.map(safe).join(',')).join('\r\n'),
          'text/csv;charset=utf-8'
        )
      }

      function printList() {
        const area = document.createElement('section')
        area.className = 'print-all'
        area.innerHTML = `<h1>所蔵リスト（${
          lastResults.length
        }冊）</h1><table><thead><tr><th>書名</th><th>著者等</th><th>出版社</th><th>分類・主題分野</th><th>状態</th></tr></thead><tbody>${lastResults
          .map(
            (b: any) =>
              `<tr><td>${esc(b.title)}</td><td>${esc(
                (b.people || []).map((p: any) => person(p.id)?.name || p.printed).join(' / ')
              )}</td><td>${esc(publisher(b.publisher))}</td><td>${esc(b.classification)} ${esc(
                className(b.classification)
              )}</td><td>${esc(b.status)}</td></tr>`
          )
          .join('')}</tbody></table>`
        const style = document.createElement('style')
        style.textContent =
          '.print-all{display:none}@media print{.yopac-root main{display:none}.print-all{display:block!important;padding:12px}}'
        document.head.append(style)
        document.body.append(area)
        window.print()
        area.remove()
        style.remove()
      }

      function detailField(label: string, value: any) {
        return `<div class="field"><div class="label">${label}</div><div>${
          value || '—'
        }</div></div>`
      }

      function memberLinks(m: any[]) {
        return (
          (m || [])
            .map(
              (v) =>
                `<li><a href="#person/${v.id}">${esc(
                  person(v.id)?.name || v.printed || '不明'
                )}</a><span class="role">${esc(
                  (v.roles || []).join('・') || '役割未設定'
                )}</span>${
                  v.printed ? `<div class="muted">掲載名：${esc(v.printed)}</div>` : ''
                }</li>`
            )
            .join('') || '<li class="muted">未登録</li>'
        )
      }

      function workLinks(ids: string[]) {
        return (
          (ids || [])
            .map((i) => (work(i) ? `<li><a href="#work/${i}">${esc(work(i).title)}</a></li>` : ''))
            .join('') || '<li class="muted">未登録</li>'
        )
      }

      function bindBookDeletion() {
        $$('[data-delete-book]').forEach(
          (button) => (button.onclick = () => confirmBookDeletion(button.dataset.deleteBook))
        )
      }

      function confirmBookDeletion(bookId: string) {
        const book = db.books.find((b: any) => b.id === bookId)
        if (!book) return
        openModal(
          `<h2>所蔵リストから削除</h2><p><strong>${esc(book.title) || '（書名未入力）'}</strong>${
            book.volume ? ' ' + esc(book.volume) : ''
          }</p><p>${esc(
            publisher(book.publisher)
          )}</p><p>この書籍の登録情報・書影・メモを削除します。人物・作品・出版社の登録情報は残ります。この操作は取り消せません。</p><div class="toolbar"><button type="button" id="cancel-delete-book">キャンセル</button><button type="button" id="confirm-delete-book" class="danger">この書籍を削除</button></div>`
        )
        $('#cancel-delete-book').onclick = closeModal
        $('#confirm-delete-book').onclick = () => {
          const next = structuredClone(db)
          next.books = next.books.filter((b: any) => b.id !== bookId)
          for (const b of next.books)
            b.related = (b.related || []).filter((id: string) => id !== bookId)
          db = next
          persist()
          closeModal()
          page = 1
          if (location.hash === '#books') listBooks()
          else location.hash = '#books'
          notify('「' + (book.title || '書名未入力') + '」を削除しました')
        }
      }

 function duplicateBook(source: any) {
        const copy = structuredClone(source)
        delete copy._dbId
        copy.id = id()
        copy.favorite = false
        copy.cover = ''
        copy.coverAvailable = false
        copy.coverAssets = []
        copy.registered = new Date().toISOString()
        copy.modified = new Date().toISOString()
        editBook(copy)
        notify('データを複製しました。巻号やISBNなどを修正して「保存」を押してください')
      }

      function bookDetail(b: any) {
        app.innerHTML = `<div class="breadcrumb"><a href="#books">所蔵リスト</a> › 書籍詳細</div><div class="page-head"><h1>${
          esc(b.title) || '（書名未入力）'
        }</h1><div class="detail-actions"><button type="button" id="star" class="favorite" aria-label="お気に入り">${
          b.favorite ? '★' : '☆'
        }</button> <a class="button primary" href="#edit-book/${
          b.id
        }">編集</a> <button type="button" id="duplicate-book">複製</button> <button type="button" class="danger" data-delete-book="${esc(
          b.id
        )}">削除</button></div></div><div class="detail-grid"><section class="fields">${detailField(
          '書影',
          renderCoverImg(b, 'cover')
        )}${detailField('書名', esc(b.title))}${detailField('副題', esc(b.subtitle))}${detailField(
          'シリーズ名',
          b.series
            ? `<button type="button" class="link-button" data-series="${esc(b.series)}">${esc(
                b.series
              )}</button>`
            : ''
        )}${detailField('巻号・エピソードタイトル', esc(b.volume))}${detailField(
          '出版者名（レーベル名）',
          b.publisher
            ? `<button type="button" class="link-button" data-publisher="${b.publisher}">${esc(
                publisher(b.publisher)
              )}</button>`
            : ''
        )}${detailField(
          '著者 / 訳者 / 編者',
          `<ul class="relations">${memberLinks(b.people)}</ul>`
        )}${detailField(
          '収録作品',
          `<ul class="relations">${workLinks(b.works)}</ul>`
        )}</section><section><div class="panel"><h2>分類</h2><div class="inline-links">${[1, 2, 3]
          .filter((l) => String(b.classification || '').length >= l && /^\d/.test(b.classification))
          .map(
            (l) =>
              `<button type="button" class="link-button" data-class="${esc(
                b.classification.slice(0, l)
              )}">${esc(b.classification.slice(0, l))} ${esc(
                classLabel(b.classification, l)
              )}</button>`
          )
          .join(' › ')}</div><p>${esc(b.classification)} ${esc(
          className(b.classification)
        )}</p></div><div class="fields">${detailField('価格', money(b.price))}${detailField(
          '購入価格',
          money(b.purchasePrice)
        )}${detailField('読後評価', esc(b.rating))}${detailField(
          '読後メモ',
          esc(b.review)
        )}${detailField('ISBN', esc(b.isbn))}${detailField(
          'メモ',
          esc(b.memo).replaceAll('\n', '<br>')
        )}${detailField('登録日', fmt(b.registered))}${detailField(
          '変更日',
          fmt(b.modified)
        )}${detailField(
          '状態',
          `<select id="quick-status" aria-label="状態">${opts(db.statuses, b.status)}</select>`
        )}${detailField(
          '関連書籍',
          `<ul class="relations">${
            (b.related || [])
              .map((i: string) => db.books.find((x: any) => x.id === i))
              .filter(Boolean)
              .map((x: any) => `<li><a href="#book/${x.id}">${esc(x.title)}</a></li>`)
              .join('') || '<li class="muted">関連書籍なし</li>'
          }</ul>`
        )}</div></section></div>`
        $('#star').onclick = () => {
          b.favorite = !b.favorite
          persist()
          bookDetail(b)
        }
        $('#duplicate-book').onclick = () => duplicateBook(b)
        $('#quick-status').onchange = (e: any) => {
          b.status = e.target.value
          b.modified = new Date().toISOString()
          persist()
          notify('状態を変更しました')
          bookDetail(b)
        }
        bindFilterLinks()
        bindBookDeletion()
      }

      const bookFields: Record<string, string> = {
        title: '書名',
        subtitle: '副題',
        series: 'シリーズ名',
        volume: '巻号・エピソードタイトル',
        classification: '分類番号',
        isbn: 'ISBN',
        price: '価格（円）',
        purchasePrice: '購入価格（円）',
        rating: '読後評価（0〜5）',
        review: '読後メモ',
        status: '状態',
        memo: 'メモ',
      }

      function shoulderOptions() {
        const defaults = [
          '作家',
          '小説家',
          '翻訳家',
          '評論家',
          '詩人',
          '歌人',
          '漫画家',
          '編集者',
          '研究者',
          '大学教員',
          '出版社',
          '編集部',
        ]
        return [...new Set([...defaults, ...(db.shoulderOptions || [])])].filter(Boolean)
      }

      function shoulderValues(value: string) {
        return [
          ...new Set(
            String(value || '')
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean)
          ),
        ]
      }

      function rememberShoulder(value: string) {
        for (const text of shoulderValues(value))
          if (!shoulderOptions().includes(text))
            db.shoulderOptions = [...(db.shoulderOptions || []), text]
      }

      function shoulderField(value = '') {
        return `<div class="wide shoulder-field"><div class="label">肩書など（複数可）</div><div data-selected-shoulders class="inline-links" aria-live="polite"></div><label>候補から追加<select data-shoulder-preset aria-label="肩書などの候補"><option value="">肩書を選択して追加</option>${opts(
          shoulderOptions()
        )}</select></label><label class="shoulder-input-label">新しい肩書を入力<textarea data-shoulder-input rows="2" placeholder="1行に1つ。例：小説家、翻訳家は別々の行へ"></textarea></label><textarea name="description" data-shoulder-value hidden>${esc(
          value
        )}</textarea><div class="toolbar"><button type="button" data-add-shoulder>肩書を追加</button><span class="muted">候補は選ぶたびに追加されます。入力中の肩書も人物の保存時に登録されます。</span></div></div>`
      }

      function bindShoulderField(scope: ParentNode = document) {
        const preset = $('[data-shoulder-preset]', scope)
        const input = $('[data-shoulder-input]', scope)
        const add = $('[data-add-shoulder]', scope)
        const value = $('[data-shoulder-value]', scope)
        const chips = $('[data-selected-shoulders]', scope)
        if (!preset || !input || !add || !value || !chips) return
        let selected = shoulderValues(value.value)
        const sync = () => {
          value.value = [...new Set([...selected, ...shoulderValues(input.value)])].join('\n')
        }
        function draw() {
          chips.innerHTML =
            selected
              .map(
                (text, i) =>
                  `<span class="badge">${esc(
                    text
                  )} <button type="button" class="tiny" data-remove-shoulder="${i}" aria-label="肩書「${esc(
                    text
                  )}」を外す">×</button></span>`
              )
              .join('') || '<span class="muted">未設定</span>'
          $$('[data-remove-shoulder]', chips).forEach(
            (e) =>
              (e.onclick = () => {
                selected.splice(Number(e.dataset.removeShoulder), 1)
                draw()
                sync()
              })
          )
        }
        preset.onchange = () => {
          if (preset.value && !selected.includes(preset.value)) selected.push(preset.value)
          preset.value = ''
          draw()
          sync()
        }
        input.oninput = sync
        add.onclick = () => {
          const values = shoulderValues(input.value)
          if (!values.length) return notify('新しい肩書を入力してください')
          selected = [...new Set([...selected, ...values])]
          rememberShoulder(values.join('\n'))
          persist()
          input.value = ''
          preset.innerHTML = '<option value="">肩書を選択して追加</option>' + opts(shoulderOptions())
          draw()
          sync()
          notify('肩書を追加しました')
        }
        draw()
        sync()
      }

      function ensureWorkFormats() {
        if (!Array.isArray(db.workFormats))
          db.workFormats = [
            ...new Set([
              ...db.works.map((w: any) => String(w.format || '').trim()).filter(Boolean),
              '小説',
              '漫画',
              '評論',
              '詩',
              '随筆',
            ]),
          ]
        return db.workFormats
      }

      function workFormatField(value = '') {
        const values = ensureWorkFormats()
        return `<label>形式<select name="format" aria-label="作品の形式"><option value="">未設定</option>${opts(
          value && !values.includes(value) ? [...values, value] : values,
          value
        )}</select><span class="muted">候補の追加・修正・削除は「管理 → 作品の形式」から行えます。</span></label>`
      }

      function renderWorkFormats() {
        const values = ensureWorkFormats()
        $('#format-management').innerHTML = values
          .map(
            (name: string, i: number) =>
              `<div class="member"><input data-format-input="${i}" aria-label="作品形式の名称" value="${esc(
                name
              )}"><button type="button" class="tiny" data-format-rename="${i}">修正</button><button type="button" class="tiny danger" data-format-delete="${i}">削除</button></div>`
          )
          .join('')
        $$('[data-format-rename]').forEach(
          (e) =>
            (e.onclick = () => {
              const i = Number(e.dataset.formatRename)
              const old = values[i]
              const name = $(`[data-format-input="${i}"]`).value.trim()
              if (!name || values.some((v: string, j: number) => j !== i && v === name))
                return notify('空欄または同じ名称があります')
              values[i] = name
              db.works.forEach((w: any) => {
                if (w.format === old) w.format = name
              })
              persist()
              settings()
              notify('作品の形式を修正しました')
            })
        )
        $$('[data-format-delete]').forEach(
          (e) =>
            (e.onclick = () => {
              const i = Number(e.dataset.formatDelete)
              const name = values[i]
              const affected = db.works.filter((w: any) => w.format === name)
              openModal(
                `<h2>形式「${esc(name)}」を削除</h2><p>使用中：${
                  affected.length
                }作品。変更先を選んでください。作品自体は削除しません。</p><select id="format-replacement" aria-label="形式の変更先"><option value="">未設定</option>${opts(
                  values.filter((v: string) => v !== name)
                )}</select><p><button type="button" class="danger" id="confirm-format-delete">変更して形式を削除</button></p>`
              )
              $('#confirm-format-delete').onclick = () => {
                const replacement = $('#format-replacement').value
                affected.forEach((w: any) => (w.format = replacement))
                values.splice(i, 1)
                persist()
                closeModal()
                settings()
                notify('作品の形式を削除しました')
              }
            })
        )
        $('#add-format').onclick = () => {
          const value = $('#new-format').value.trim()
          if (!value) return
          if (values.includes(value)) return notify('同じ形式が登録されています')
          values.push(value)
          persist()
          settings()
          notify('作品の形式を追加しました')
        }
      }

      function createRelated(type: 'person' | 'publisher' | 'work', onSelect: any) {
        const config = {
          person: {
            heading: '人物・団体を新規登録',
            collection: 'people',
            nameKey: 'name',
            fields: {
              name: '名前',
              reading: 'よみ',
              original: '原綴り',
              aliases: '別名・別表記（1行に1つ）',
              description: '肩書など',
              url: '関連HP',
            },
          },
          publisher: {
            heading: '出版者・レーベルを新規登録',
            collection: 'publishers',
            nameKey: 'name',
            fields: { name: '名称', reading: 'よみ' },
          },
          work: {
            heading: '収録作品を新規登録',
            collection: 'works',
            nameKey: 'title',
            fields: {
              title: '作品名',
              format: '形式',
              first: '初出誌',
              originalTitle: '原作タイトル',
            },
          },
        }[type]

        openModal(
          `<h2>${config.heading}</h2><p class="muted">登録して現在の${
            type === 'person' ? '人物の関連付け' : type === 'publisher' ? '出版者欄' : '収録作品'
          }に追加します。元の編集内容は保持されます。</p><form id="related-create-form"><div class="form-grid">${Object.entries(
            config.fields
          )
            .map(([key, label]) =>
              key === 'description'
                ? shoulderField('')
                : key === 'format'
                ? workFormatField('')
                : `<label class="${
                    ['aliases', 'description'].includes(key) ? 'wide' : ''
                  }">${label}${
                    ['aliases', 'description'].includes(key)
                      ? `<textarea name="${key}" rows="3"></textarea>`
                      : `<input name="${key}" ${
                          key === config.nameKey ? 'required' : ''
                        } autocomplete="off">`
                  }</label>`
            )
            .join('')}</div>${
            type === 'person'
              ? `<h3>この書籍・作品での役割</h3><div class="inline-links">${db.roles
                  .map(
                    (r: string) =>
                      `<label class="role-check"><input type="checkbox" data-create-role="${esc(
                        r
                      )}">${esc(r)}</label>`
                  )
                  .join('')}</div>`
              : ''
          }<div id="related-duplicates" aria-live="polite"></div><p><label class="role-check"><input type="checkbox" id="allow-related-duplicate">同名でも別の${
            type === 'person' ? '人物・団体' : type === 'publisher' ? '出版者・レーベル' : '作品'
          }として登録する</label></p><p id="related-create-error" role="alert" class="danger"></p><div class="toolbar"><button type="submit" class="primary">登録して選択</button><button type="button" id="cancel-related-create">キャンセル</button></div></form>`
        )

        const form = $('#related-create-form')
        bindShoulderField(form)
        const nameInput = form.elements.namedItem(config.nameKey)
        const chosenRoles = () =>
          $$('[data-create-role]:checked', form).map((e) => e.dataset.createRole)
        let candidates: any[] = []
        function choose(record: any) {
          const roles = chosenRoles()
          closeModal()
          onSelect(record, roles)
          notify('選択して編集中のデータに関連付けました')
        }
        function showDuplicates() {
          const name = normal(nameInput.value)
          candidates = name
            ? db[config.collection].filter((record: any) => normal(record[config.nameKey]) === name)
            : []
          $('#related-duplicates').innerHTML = candidates.length
            ? `<h3>同じ名前の登録があります</h3>${candidates
                .map(
                  (record, i) =>
                    `<div class="member"><span>${esc(record[config.nameKey])}${
                      type === 'person' && record.reading ? `（${esc(record.reading)}）` : ''
                    }</span><button type="button" data-use-related="${i}">既存を使う</button></div>`
                )
                .join('')}`
            : ''
          $$('[data-use-related]', form).forEach(
            (e) => (e.onclick = () => choose(candidates[Number(e.dataset.useRelated)]))
          )
        }
        nameInput.oninput = showDuplicates
        $('#cancel-related-create').onclick = closeModal
        form.onsubmit = (e: Event) => {
          e.preventDefault()
          if (!form.reportValidity()) return
          const values: any = Object.fromEntries(new FormData(form))
          values[config.nameKey] = String(values[config.nameKey] || '').trim()
          if (!values[config.nameKey]) {
            $('#related-create-error').textContent = '名前を入力してください'
            return
          }
          showDuplicates()
          if (candidates.length && !$('#allow-related-duplicate').checked) {
            $('#related-create-error').textContent =
              '同名候補を確認し、既存を使うか、別のデータとして登録するかを選んでください。'
            return
          }
          let record: any
          if (type === 'person')
            record = {
              id: id(),
              name: values.name,
              reading: values.reading || '',
              original: values.original || '',
              aliases: [
                ...new Set(
                  String(values.aliases || '')
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                ),
              ],
              description: values.description || '',
              url: values.url || '',
              ndlId: '',
            }
          else if (type === 'publisher')
            record = { id: id(), name: values.name, reading: values.reading || '' }
          else
            record = {
              id: id(),
              title: values.title,
              format: values.format || '',
              first: values.first || '',
              originalTitle: values.originalTitle || '',
              originals: [],
              translations: [],
              people: [],
            }
          if (type === 'person') rememberShoulder(record.description)
          db[config.collection].push(record)
          persist()
          choose(record)
        }
      }

      function relatedSearchText(value: any) {
        return normal(value).replace(/[ァ-ヶ]/g, (c) =>
          String.fromCharCode(c.charCodeAt(0) - 0x60)
        )
      }

      function pickRelated(
        kind: 'person' | 'work' | 'publisher',
        onSelect: any,
        { exclude = [] }: { exclude?: string[] } = {}
      ) {
        const configs = {
          person: {
            label: '人物・団体',
            source: db.people,
            name: (x: any) => x.name,
            sort: (x: any) => x.reading || x.name,
            search: personText,
            details: (x: any) => [x.reading, x.original, (x.aliases || []).join(' / ')],
            hint: '名前・よみ・原綴り・別名',
            note: 'よみ順（よみがなければ名前順）。選択済みの人物は候補から除きます。',
          },
          work: {
            label: '作品',
            source: db.works,
            name: (x: any) => x.title,
            sort: (x: any) => x.title,
            search: (x: any) => [x.title, memberships(x.people), x.format].join(' '),
            details: (x: any) => [
              x.format,
              (x.people || [])
                .map((m: any) => person(m.id)?.name)
                .filter(Boolean)
                .join(' / '),
            ],
            hint: '作品名・著作者名・形式',
            note: '作品名順。選択済みの作品は候補から除きます。',
          },
          publisher: {
            label: '出版者・レーベル',
            source: db.publishers,
            name: (x: any) => x.name,
            sort: (x: any) => x.reading || x.name,
            search: (x: any) => [x.name, x.reading].join(' '),
            details: (x: any) => [x.reading],
            hint: '名称・よみ',
            note: 'よみ順（よみがなければ名称順）。',
          },
        }
        const { label, source, name, sort, search, details, hint, note } = configs[kind]
        const records = source
          .filter((x: any) => !exclude.includes(x.id))
          .sort((a: any, b: any) =>
            normal(sort(a)).localeCompare(normal(sort(b)), 'ja', { numeric: true })
          )
        const pageSize = 30
        let limit = pageSize
        openModal(
          `<h2>${label}を検索して選択</h2><p class="muted">${hint}で部分一致検索できます。${note}</p><input type="search" id="related-picker-search" aria-label="${label}の候補検索" placeholder="${hint}" autocomplete="off" enterkeyhint="search"><div id="related-picker-count" class="muted" aria-live="polite"></div><div id="related-picker-results"></div><button type="button" id="related-picker-more">さらに表示</button>`
        )
        const input = $('#related-picker-search')
        const more = $('#related-picker-more')
        const results = $('#related-picker-results')
        function draw() {
          const q = relatedSearchText(input.value)
          const hits = records.filter((x: any) => relatedSearchText(search(x)).includes(q))
          $('#related-picker-count').textContent = `${hits.length}件中 ${Math.min(
            limit,
            hits.length
          )}件を表示`
          results.innerHTML =
            hits
              .slice(0, limit)
              .map(
                (x: any) =>
                  `<div class="picker-result"><div><strong>${esc(
                    name(x)
                  )}</strong><div class="muted">${esc(
                    details(x).filter(Boolean).join(' · ')
                  )}</div></div><button type="button" data-pick-record="${esc(
                    x.id
                  )}">選択</button></div>`
              )
              .join('') ||
            '<p class="empty">候補がありません。別の語で検索するか、新規登録してください。</p>'
          more.hidden = hits.length <= limit
          $$('[data-pick-record]', results).forEach(
            (button) =>
              (button.onclick = () => {
                const record = records.find((x: any) => x.id === button.dataset.pickRecord)
                closeModal()
                onSelect(record)
              })
          )
        }
        function searchAgain() {
          limit = pageSize
          draw()
        }
        input.oninput = input.oncompositionend = input.onsearch = searchAgain
        input.onkeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault()
            searchAgain()
          }
        }
        more.onclick = () => {
          limit += pageSize
          draw()
        }
        draw()
      }

function membersEditor(m: any[]) {
        const list = m || []
        return `<div id="members">${list
          .map(
            (p, i) =>
              `<div class="member" data-member="${i}"><input type="hidden" data-person value="${esc(
                p.id
              )}">${
                list.length > 1
                  ? `<span class="inline-links" style="gap:4px"><button type="button" class="tiny" data-move-member-up="${i}" aria-label="上へ移動" ${
                      i === 0 ? 'disabled' : ''
                    }>↑</button><button type="button" class="tiny" data-move-member-down="${i}" aria-label="下へ移動" ${
                      i === list.length - 1 ? 'disabled' : ''
                    }>↓</button></span>`
                  : ''
              }<span class="member-person"><a href="#person/${esc(p.id)}">${esc(
                person(p.id)?.name || p.printed || '未設定'
              )}</a><button type="button" class="tiny" data-change-person="${i}">人物を検索して変更</button></span>${db.roles
                .map(
                  (r: string) =>
                    `<label class="role-check"><input type="checkbox" data-role="${esc(r)}" ${
                      (p.roles || []).includes(r) ? 'checked' : ''
                    }>${esc(r)}</label>`
                )
                .join(
                  ''
                )}<input type="text" data-printed aria-label="掲載名" placeholder="本に記載された名前（任意）" value="${esc(
                p.printed
              )}"><button type="button" class="tiny danger" data-remove-member="${i}">外す</button></div>`
          )
          .join(
            ''
          )}</div><div class="toolbar" style="margin-top:10px"><button type="button" id="add-member">＋ 登録済みの人物・団体</button><button type="button" id="new-member">＋ 人物・団体を新規登録</button></div>`
      }
      
      function readMembers() {
        return $$('[data-member]').map((row) => ({
          id: $('[data-person]', row).value,
          roles: $$('[data-role]:checked', row).map((e) => e.dataset.role),
          printed: $('[data-printed]', row).value,
        }))
      }

      function bindMembers(draft: any, redraw: any, capture: any) {
        $('#new-member').onclick = () => {
          capture?.()
          createRelated('person', (record: any, roles: string[]) => {
            const existing = draft.people.find((p: any) => p.id === record.id)
            if (existing) existing.roles = [...new Set([...(existing.roles || []), ...roles])]
            else draft.people.push({ id: record.id, roles, printed: '' })
            redraw()
          })
        }
        $('#add-member').onclick = () => {
          capture?.()
          draft.people = readMembers()
          pickRelated(
            'person',
            (record: any) => {
              draft.people.push({ id: record.id, roles: [], printed: '' })
              redraw()
            },
            { exclude: draft.people.map((p: any) => p.id) }
          )
        }
        $$('[data-change-person]').forEach(
          (e) =>
            (e.onclick = () => {
              capture?.()
              draft.people = readMembers()
              const i = Number(e.dataset.changePerson)
              pickRelated(
                'person',
                (record: any) => {
                  draft.people[i].id = record.id
                  redraw()
                },
                { exclude: draft.people.filter((_: any, j: number) => j !== i).map((p: any) => p.id) }
              )
            })
        )
$$('[data-move-member-up]').forEach(
          (e) =>
            (e.onclick = () => {
              draft.people = readMembers()
              const i = Number(e.dataset.moveMemberUp)
              if (i > 0) {
                ;[draft.people[i - 1], draft.people[i]] = [draft.people[i], draft.people[i - 1]]
                redraw()
              }
            })
        )
        $$('[data-move-member-down]').forEach(
          (e) =>
            (e.onclick = () => {
              draft.people = readMembers()
              const i = Number(e.dataset.moveMemberDown)
              if (i < draft.people.length - 1) {
                ;[draft.people[i], draft.people[i + 1]] = [draft.people[i + 1], draft.people[i]]
                redraw()
              }
            })
        )
        $$('[data-remove-member]').forEach(
          (e) =>
            (e.onclick = () => {
              draft.people = readMembers()
              draft.people.splice(Number(e.dataset.removeMember), 1)
              redraw()
            })
        )
      }
      
      let bookDraft: any = null
      function editBook(source: any) {
        bookDraft = structuredClone(
          source || {
            id: id(),
            title: '',
            subtitle: '',
            series: '',
            volume: '',
            classification: '',
            isbn: '',
            price: '',
            purchasePrice: '',
            rating: '',
            review: '',
            status: '所蔵',
            memo: '',
            publisher: '',
            people: [],
            works: [],
            related: [],
            cover: '',
            registered: new Date().toISOString(),
            modified: new Date().toISOString(),
          }
        )
        drawBookForm()
      }

      async function resizeCover(file: File) {
        const url = URL.createObjectURL(file)
        try {
          const image = new Image()
          image.src = url
          await image.decode()
          const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
          const ctx = canvas.getContext('2d')!
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          return canvas.toDataURL('image/jpeg', 0.78)
        } finally {
          URL.revokeObjectURL(url)
        }
      }

      // 2. 蔵書を追加・編集画面（レイアウト整形済み）
      function drawBookForm() {
        const b = bookDraft
        const isEditing = db.books.some((x: any) => x.id === b.id)
        app.innerHTML = `<div class="breadcrumb"><a href="#books">所蔵リスト</a> › ${
          isEditing ? '書籍編集' : '蔵書追加'
        }</div><div class="page-head"><h1>${
          isEditing ? '書籍を編集' : '蔵書を追加'
        }</h1><div class="detail-actions"><a class="button" href="${
          isEditing ? `#book/${b.id}` : '#books'
        }">キャンセル</a><button type="button" id="save-book" class="primary">保存</button></div></div><div class="section-note">保存先はSupabaseデータベースです。ISBNからNDLやOpenBDの書誌情報・書影を自動取得できます。</div><form id="book-form"><section class="panel"><div class="toolbar"><input id="lookup-isbn" type="text" placeholder="ISBNを入力（例：9784101001012）" aria-label="NDL検索用ISBN" value="${esc(
          b.isbn
        )}"><button type="button" id="scan-add" class="secondary">📷 カメラでISBN読取</button><button type="button" id="ndl-book" class="primary">NDLから書誌取得</button></div><div class="form-grid">${Object.entries(
          bookFields
        )
          .map(
            ([k, n]) =>
              `<label class="${k === 'memo' ? 'wide' : ''}"><span>${n}</span>${
                k === 'memo'
                  ? `<textarea name="${k}" rows="4">${esc(b[k])}</textarea>`
                  : k === 'status'
                  ? `<select name="${k}">${opts(db.statuses, b.status)}</select>`
                  : `<input name="${k}" ${
                      ['price', 'purchasePrice', 'rating'].includes(k)
                        ? 'type="number" min="0" ' + (k === 'rating' ? 'max="5" ' : '') + 'step="1"'
                        : 'type="text"'
                    } ${k === 'title' ? 'required' : ''} value="${esc(b[k])}">`
              }</label>`
          )
          .join(
            ''
          )}<div class="field-box"><div class="label">出版者・レーベル</div><div class="publisher-box"><input type="hidden" name="publisher" value="${esc(
          b.publisher
        )}"><div class="publisher-current">${esc(
          db.publishers.find((p: any) => p.id === b.publisher)?.name || '未設定'
        )}</div><div class="toolbar" style="margin-bottom:0"><button type="button" id="pick-publisher" class="tiny">登録済みを検索</button><button type="button" id="new-publisher" class="tiny">＋ 新規登録</button>${
          b.publisher ? '<button type="button" id="clear-publisher" class="tiny danger">外す</button>' : ''
        }</div></div></div><div class="field-box"><div class="label">書影（表紙画像）</div><div class="publisher-box"><input type="file" id="cover-upload" accept="image/*" capture="environment">${
          b.cover || b.isbn
            ? `<div style="margin-top:10px">${renderCoverImg(b, 'cover')}</div>`
            : '<div class="muted" style="margin-top:6px">画像を選択するか、ISBNを入力すると自動で書影が表示されます</div>'
        }${
          b.cover
            ? '<button type="button" id="clear-cover" class="tiny danger" style="margin-top:8px">書影をクリア</button>'
            : ''
        }</div></div></div></section><section class="panel"><h2>著者 / 訳者 / 編者</h2>${membersEditor(
          b.people
        )}</section><section class="panel"><h2>収録作品</h2><div class="inline-links" style="margin-bottom:10px">${
          (b.works || [])
            .map(
              (i: string) =>
                `<span class="badge">${esc(
                  work(i)?.title
                )} <button type="button" class="tiny" data-remove-work="${i}">×</button></span>`
            )
            .join('') || '<span class="muted">未登録</span>'
        }</div><div class="toolbar" style="margin-bottom:0"><button type="button" id="add-work">＋ 登録済みの作品を検索</button><button type="button" id="new-linked-work">＋ 収録作品を新規登録</button></div></section></form>`

        const read = (validate = false) => {
          const form = $('#book-form')
          if (validate && !form.reportValidity()) return false
          for (const [k, v] of new FormData(form)) b[k] = v
          b.people = readMembers()
          return true
        }
        const redraw = () => {
          const members = structuredClone(b.people)
          read()
          b.people = members
          drawBookForm()
        }
        bindMembers(b, redraw, read)
        const setPublisher = (record: any) => {
          b.publisher = record?.id || ''
          drawBookForm()
        }
        $('#pick-publisher').onclick = () => {
          read()
          pickRelated('publisher', setPublisher)
        }
        $('#new-publisher').onclick = () => {
          read()
          createRelated('publisher', setPublisher)
        }
        if ($('#clear-publisher')) {
          $('#clear-publisher').onclick = () => {
            read()
            setPublisher(null)
          }
        }
        if ($('#clear-cover')) {
          $('#clear-cover').onclick = () => {
            read()
            b.cover = ''
            b.coverAvailable = false
            drawBookForm()
          }
        }
        $('#new-linked-work').onclick = () => {
          read()
          createRelated('work', (record: any) => {
            if (!b.works.includes(record.id)) b.works.push(record.id)
            drawBookForm()
          })
        }
        $('#save-book').onclick = () => {
          if (!read(true)) return
          b.modified = new Date().toISOString()
          const i = db.books.findIndex((x: any) => x.id === b.id)
          if (i < 0) db.books.unshift(b)
          else db.books[i] = b
          persist()
          location.hash = '#book/' + b.id
          notify('書籍を保存しました')
        }
        $('#add-work').onclick = () => {
          read()
          pickRelated(
            'work',
            (record: any) => {
              b.works.push(record.id)
              drawBookForm()
            },
            { exclude: b.works }
          )
        }
        $$('[data-remove-work]').forEach(
          (e) =>
            (e.onclick = () => {
              read()
              b.works = b.works.filter((i: string) => i !== e.dataset.removeWork)
              drawBookForm()
            })
        )
        $('#scan-add').onclick = () =>
          scanISBN(
            (isbn: string) => {
              $('#lookup-isbn').value = isbn
              $('[name=isbn]', $('#book-form')).value = isbn
              read()
              lookupBook(isbn, b, drawBookForm)
            },
            { lookup: true }
          )
        $('#ndl-book').onclick = () => {
          read()
          lookupBook($('#lookup-isbn').value || b.isbn, b, drawBookForm)
        }
        const coverInput = $('#cover-upload')
        const saveButton = $('#save-book')
        coverInput.onchange = async () => {
          const file = coverInput.files?.[0]
          if (!file) return
          saveButton.disabled = true
          coverInput.disabled = true
          try {
            const cover = await resizeCover(file)
            read()
            b.cover = cover
            b.coverAvailable = true
            drawBookForm()
            notify('書影を縮小してセットしました')
          } catch {
            notify('画像を読み込めませんでした。別の画像を選んでください。')
          } finally {
            coverInput.disabled = false
            coverInput.value = ''
            saveButton.disabled = false
          }
        }
      }

      function publishersList() {
        app.innerHTML = `<div class="page-head"><div><h1>出版者・レーベル</h1><div class="count">${db.publishers.length}件</div></div><button type="button" id="new-publisher-page" class="primary">＋ 出版者・レーベルを追加</button></div><div class="toolbar"><input id="publishers-search" type="search" aria-label="出版者・レーベル検索" placeholder="名称・よみで検索" autocomplete="off"></div><div id="publishers-results"></div>`
        const input = $('#publishers-search')
        function draw() {
          const query = relatedSearchText(input.value)
          const list = db.publishers
            .filter((p: any) => relatedSearchText(p.name + ' ' + (p.reading || '')).includes(query))
            .slice()
            .sort((a: any, b: any) =>
              normal(a.reading || a.name).localeCompare(normal(b.reading || b.name), 'ja', {
                numeric: true,
              })
            )
          $('#publishers-results').innerHTML = `<p class="muted">${
            list.length
          }件</p><div class="table-wrap"><table><thead><tr><th>出版者・レーベル名</th><th>よみ</th><th>登録冊数</th><th>所蔵リスト</th></tr></thead><tbody>${list
            .map(
              (p: any) =>
                `<tr><td><a href="#publisher/${p.id}">${esc(p.name)}</a></td><td>${esc(
                  p.reading
                )}</td><td>${
                  db.books.filter((b: any) => b.publisher === p.id).length
                }冊</td><td><button type="button" class="tiny" data-publisher="${
                  p.id
                }">所蔵リストを表示</button></td></tr>`
            )
            .join('')}</tbody></table></div>${
            list.length ? '' : '<p class="empty">該当する出版者・レーベルがありません。</p>'
          }`
          bindFilterLinks()
        }
        input.oninput = draw
        input.oncompositionend = draw
        $('#new-publisher-page').onclick = () =>
          createRelated('publisher', (p: any) => {
            location.hash = '#publisher/' + p.id
          })
        draw()
      }

      function prepareRecordDeletion(data: any, type: string, recordId: string) {
        const next = structuredClone(data)
        const now = new Date().toISOString()
        let booksCount = 0
        let worksCount = 0
        next[type] = next[type].filter((r: any) => r.id !== recordId)
        for (const b of next.books) {
          let affected = false
          if (type === 'people') {
            affected = (b.people || []).some((p: any) => p.id === recordId)
            b.people = (b.people || []).filter((p: any) => p.id !== recordId)
          }
          if (type === 'works') {
            affected = (b.works || []).includes(recordId)
            b.works = (b.works || []).filter((id: string) => id !== recordId)
          }
          if (type === 'publishers' && b.publisher === recordId) {
            affected = true
            b.publisher = ''
          }
          if (affected) {
            booksCount++
            b.modified = now
          }
        }
        for (const w of next.works) {
          let affected = false
          if (type === 'people') {
            affected = (w.people || []).some((p: any) => p.id === recordId)
            w.people = (w.people || []).filter((p: any) => p.id !== recordId)
          }
          if (type === 'works') {
            affected =
              (w.originals || []).includes(recordId) || (w.translations || []).includes(recordId)
            w.originals = (w.originals || []).filter((id: string) => id !== recordId)
            w.translations = (w.translations || []).filter((id: string) => id !== recordId)
          }
          if (affected) worksCount++
        }
        return { next, books: booksCount, works: worksCount }
      }

      function confirmRecordDeletion(type: 'people' | 'works' | 'publishers', recordId: string) {
        const record = db[type]?.find((r: any) => r.id === recordId)
        if (!record) return
        const label = { people: '個人・団体', works: '作品', publishers: '出版者・レーベル' }[type]
        const name = record.name || record.title || '名称未入力'
        const impact = prepareRecordDeletion(db, type, recordId)
        openModal(
          `<h2>${esc(label)}を削除</h2><p><strong>${esc(name)}</strong></p><p>関連する書籍：${
            impact.books
          }冊、${
            type === 'works' ? '原作・翻訳として関連する作品' : '関連する作品'
          }：${
            impact.works
          }件</p><p>この登録と、上記の書籍・作品からの関連付けを削除します。書籍そのものや他の登録情報は削除しません。${
            type === 'publishers' ? '関連書籍の出版社欄は未設定になります。' : ''
          }</p><div class="toolbar"><button type="button" id="cancel-delete-record">キャンセル</button><button type="button" id="confirm-delete-record" class="danger">この登録を削除</button></div>`
        )
        $('#cancel-delete-record').onclick = closeModal
        $('#confirm-delete-record').onclick = () => {
          const { next } = prepareRecordDeletion(db, type, recordId)
          db = next
          persist()
          if (type === 'publishers' && filters.publisher === recordId) filters.publisher = ''
          closeModal()
          location.hash = '#' + type
          notify('「' + name + '」を削除しました')
        }
      }

      function editPublisher(source: any) {
        const p = structuredClone(source)
        app.innerHTML = `<div class="breadcrumb"><a href="#publishers">出版者・レーベル</a> › 編集</div><div class="page-head"><h1>出版者・レーベルの編集</h1><div class="detail-actions"><button type="button" id="cancel-publisher-edit">キャンセル</button><button type="button" id="save-publisher" class="primary">保存</button></div></div><form id="publisher-form" class="panel"><div class="form-grid"><label>名称<input name="name" required value="${esc(
          p.name
        )}"></label><label>よみ<input name="reading" value="${esc(p.reading)}"></label></div></form>`
        $('#cancel-publisher-edit').onclick = () => publisherDetail(source)
        const save = () => {
          const form = $('#publisher-form')
          if (!form.reportValidity()) return
          const values: any = Object.fromEntries(new FormData(form))
          const name = String(values.name || '').trim()
          if (!name) return notify('名称を入力してください')
          const next = structuredClone(db)
          const record = next.publishers.find((x: any) => x.id === p.id)
          if (!record) return notify('登録が見つかりません')
          record.name = name
          record.reading = String(values.reading || '').trim()
          db = next
          persist()
          publisherDetail(record)
          notify('出版者・レーベルを保存しました')
        }
        $('#save-publisher').onclick = save
        $('#publisher-form').onsubmit = (e: Event) => {
          e.preventDefault()
          save()
        }
      }

      function publisherDetail(p: any) {
        const relBooks = db.books.filter((b: any) => b.publisher === p.id)
        app.innerHTML = `<div class="breadcrumb"><a href="#publishers">出版者・レーベル</a> › 詳細</div><div class="page-head"><h1>${esc(
          p.name
        )}</h1><div class="detail-actions"><button type="button" id="edit-publisher" class="primary">編集</button> <button type="button" id="delete-publisher" class="danger">削除</button></div></div><div class="detail-grid"><div class="fields">${detailField(
          '名称',
          esc(p.name)
        )}${detailField(
          'よみ',
          esc(p.reading)
        )}</div><section class="panel"><h2>関連書籍 <span class="count">${
          relBooks.length
        }冊</span></h2><button type="button" data-publisher="${
          p.id
        }">所蔵リストを表示</button><ul class="relations">${
          relBooks
            .map(
              (b: any) =>
                `<li><a href="#book/${b.id}">${esc(b.title)}</a> <span class="badge">${esc(
                  b.status
                )}</span></li>`
            )
            .join('') || '<li class="muted">該当書籍なし</li>'
        }</ul></section></div>`
        bindFilterLinks()
        $('#edit-publisher').onclick = () => editPublisher(p)
        $('#delete-publisher').onclick = () => confirmRecordDeletion('publishers', p.id)
      }

      function peopleList() {
        app.innerHTML = `<div class="page-head"><div><h1>個人・団体</h1><div class="count">${db.people.length}件</div></div><button type="button" id="new-person" class="primary">＋ 個人・団体を追加</button></div><div class="toolbar"><input id="people-search" type="search" placeholder="名前・よみ・原綴り・別名で検索" aria-label="人物検索"></div><div id="people-results"></div>`
        function draw() {
          const q = normal($('#people-search').value)
          const a = db.people
            .filter((p: any) => normal(personText(p)).includes(q))
            .sort((x: any, y: any) =>
              normal(x.reading || x.name).localeCompare(normal(y.reading || y.name), 'ja')
            )
          $('#people-results').innerHTML = `<div class="table-wrap"><table><thead><tr><th>名前</th><th>よみ</th><th>肩書・別名</th></tr></thead><tbody>${a
            .map(
              (p: any) =>
                `<tr><td><a href="#person/${p.id}">${esc(p.name)}</a></td><td>${esc(
                  p.reading
                )}</td><td>${esc(
                  [p.description, ...(p.aliases || [])].filter(Boolean).join(' / ')
                )}</td></tr>`
            )
            .join('')}</tbody></table></div>`
        }
        $('#people-search').oninput = draw
        $('#new-person').onclick = () => editPerson(null)
        draw()
      }

      function safeURL(s: string) {
        try {
          return ['http:', 'https:'].includes(new URL(s).protocol)
        } catch {
          return false
        }
      }

      function personDetail(p: any) {
        const relBooks = db.books.filter((b: any) =>
          (b.people || []).some((x: any) => x.id === p.id)
        )
        const relWorks = db.works.filter((w: any) =>
          (w.people || []).some((x: any) => x.id === p.id)
        )
        app.innerHTML = `<div class="breadcrumb"><a href="#people">個人・団体</a> › 詳細</div><div class="page-head"><h1>${esc(
          p.name
        )}</h1><div class="detail-actions"><button type="button" id="edit-person" class="primary">編集</button> <button type="button" id="delete-person" class="danger">削除</button></div></div><div class="detail-grid"><div class="fields">${detailField(
          '名前',
          esc(p.name)
        )}${detailField('肩書など', esc(p.description).replaceAll('\n', '<br>'))}${detailField(
          '関連HP',
          safeURL(p.url)
            ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a>`
            : esc(p.url)
        )}${detailField('よみ', esc(p.reading))}${detailField(
          '原綴り',
          esc(p.original)
        )}${detailField('別名・別表記', (p.aliases || []).map(esc).join('<br>'))}${detailField(
          'NDL典拠ID',
          p.ndlId
            ? `<a href="https://id.ndl.go.jp/auth/ndlna/${encodeURIComponent(
                p.ndlId
              )}" target="_blank" rel="noopener">${esc(p.ndlId)}</a>`
            : ''
        )}</div><div><section class="panel"><h2>関連書籍 <span class="count">${
          relBooks.length
        }冊</span></h2><ul class="relations">${
          relBooks
            .map((b: any) => {
              const m = (b.people || []).find((x: any) => x.id === p.id)
              return `<li><a href="#book/${b.id}">${esc(b.title)}</a><span class="role">${esc(
                (m?.roles || []).join('・') || '役割未設定'
              )}</span></li>`
            })
            .join('') || '<li class="muted">該当なし</li>'
        }</ul></section><section class="panel"><h2>関連作品 <span class="count">${
          relWorks.length
        }件</span></h2><ul class="relations">${workLinks(
          relWorks.map((w: any) => w.id)
        )}</ul></section></div></div>`
        $('#edit-person').onclick = () => editPerson(p)
        $('#delete-person').onclick = () => confirmRecordDeletion('people', p.id)
      }

      function editPerson(source: any) {
        const p = structuredClone(
          source || {
            id: id(),
            name: '',
            description: '',
            url: '',
            reading: '',
            original: '',
            aliases: [],
            ndlId: '',
          }
        )
        function draw() {
          app.innerHTML = `<div class="breadcrumb"><a href="#people">個人・団体</a> › 編集</div><div class="page-head"><h1>個人・団体の編集</h1><button type="button" id="save-person" class="primary">保存</button></div><form id="person-form" class="panel"><div class="toolbar"><button type="button" id="ndl-person">NDL典拠から取得</button><a href="https://id.ndl.go.jp/auth/ndla" target="_blank" rel="noopener">NDL典拠を別画面で探す ↗</a></div><div class="form-grid">${Object.entries(
            {
              name: '名前',
              reading: 'よみ',
              original: '原綴り',
              ndlId: 'NDL典拠ID',
              description: '肩書など',
              url: '関連HP',
            }
          )
            .map(([k, n]) =>
              k === 'description'
                ? shoulderField(p.description)
                : `<label>${n}<input name="${k}" ${k === 'name' ? 'required' : ''} value="${esc(
                    p[k]
                  )}"></label>`
            )
            .join('')}<label class="wide">別名・別表記（1行に1つ）<textarea name="aliases" rows="5">${esc(
            (p.aliases || []).join('\n')
          )}</textarea></label></div></form>`
          bindShoulderField($('#person-form'))
          function read() {
            for (const [k, v] of new FormData($('#person-form'))) {
              p[k] =
                k === 'aliases'
                  ? [
                      ...new Set(
                        String(v)
                          .split('\n')
                          .map((x) => x.trim())
                          .filter(Boolean)
                      ),
                    ]
                  : v
            }
          }
          $('#save-person').onclick = () => {
            if (!$('#person-form').reportValidity()) return
            read()
            rememberShoulder(p.description)
            const i = db.people.findIndex((x: any) => x.id === p.id)
            if (i < 0) db.people.push(p)
            else db.people[i] = p
            persist()
            location.hash = '#person/' + p.id
            personDetail(p)
            notify('人物・団体を保存しました')
          }
          $('#ndl-person').onclick = () => {
            read()
            lookupAuthority(p, draw)
          }
        }
        draw()
      }

      function worksList() {
        app.innerHTML = `<div class="page-head"><div><h1>作品</h1><div class="count">${db.works.length}件</div></div><button type="button" class="primary" id="new-work">＋ 作品を追加</button></div><div class="toolbar"><input type="search" id="works-search" placeholder="作品名・著作者・形式で検索" aria-label="作品検索"></div><div id="works-results"></div>`
        function draw() {
          const q = normal($('#works-search').value)
          const a = db.works.filter((w: any) =>
            normal(w.title + ' ' + memberships(w.people) + ' ' + w.format).includes(q)
          )
          $('#works-results').innerHTML = `<div class="table-wrap"><table><thead><tr><th>作品名</th><th>著作者など</th><th>形式</th><th>初出誌</th></tr></thead><tbody>${a
            .map(
              (w: any) =>
                `<tr><td><a href="#work/${w.id}">${esc(w.title)}</a></td><td>${(w.people || [])
                  .map((p: any) => `<a href="#person/${p.id}">${esc(person(p.id)?.name)}</a>`)
                  .join(' / ')}</td><td>${esc(w.format)}</td><td>${esc(w.first)}</td></tr>`
            )
            .join('')}</tbody></table></div>`
        }
        $('#works-search').oninput = draw
        $('#new-work').onclick = () => editWork(null)
        draw()
      }

      function workDetail(w: any) {
        const relBooks = db.books.filter((b: any) => (b.works || []).includes(w.id))
        const translations = [
          ...new Set([
            ...(w.translations || []),
            ...db.works
              .filter((x: any) => (x.originals || []).includes(w.id))
              .map((x: any) => x.id),
          ]),
        ]
        app.innerHTML = `<div class="breadcrumb"><a href="#works">作品</a> › 詳細</div><div class="page-head"><h1>${esc(
          w.title
        )}</h1><div class="detail-actions"><button type="button" id="edit-work" class="primary">編集</button> <button type="button" id="delete-work" class="danger">削除</button></div></div><div class="detail-grid"><section class="fields">${detailField(
          '作品名',
          esc(w.title)
        )}${detailField(
          '著作者など',
          `<ul class="relations">${memberLinks(w.people)}</ul>`
        )}${detailField('形式', esc(w.format))}${detailField(
          '初出誌',
          esc(w.first)
        )}${detailField(
          '原作タイトル',
          esc(w.originalTitle)
        )}</section><section><div class="panel"><h2>収録先 <span class="count">${
          relBooks.length
        }冊</span></h2><ul class="relations">${
          relBooks
            .map((b: any) => `<li><a href="#book/${b.id}">${esc(b.title)}</a></li>`)
            .join('') || '<li>該当なし</li>'
        }</ul></div><div class="panel"><h2>原作</h2><ul class="relations">${workLinks(
          w.originals
        )}</ul><h2>翻訳</h2><ul class="relations">${workLinks(
          translations
        )}</ul></div></section></div>`
        $('#edit-work').onclick = () => editWork(w)
        $('#delete-work').onclick = () => confirmRecordDeletion('works', w.id)
      }

      function editWork(source: any) {
        const w = structuredClone(
          source || {
            id: id(),
            title: '',
            format: '',
            first: '',
            originalTitle: '',
            originals: [],
            translations: [],
            people: [],
          }
        )
        function read() {
          for (const [k, v] of new FormData($('#work-form'))) w[k] = v
          w.people = readMembers()
        }
        function draw() {
          app.innerHTML = `<div class="breadcrumb"><a href="#works">作品</a> › 編集</div><div class="page-head"><h1>作品を編集</h1><button type="button" id="save-work" class="primary">保存</button></div><form id="work-form" class="panel"><div class="form-grid">${Object.entries(
            {
              title: '作品名',
              format: '形式',
              first: '初出誌',
              originalTitle: '原作タイトル',
            }
          )
            .map(([k, n]) =>
              k === 'format'
                ? workFormatField(w.format)
                : `<label>${n}<input name="${k}" ${k === 'title' ? 'required' : ''} value="${esc(
                    w[k]
                  )}"></label>`
            )
            .join('')}</div><h3>著作者など</h3>${membersEditor(w.people)}<h3>原作</h3><div>${(
            w.originals || []
          )
            .map(
              (i: string) =>
                `<span class="badge">${esc(
                  work(i)?.title
                )} <button type="button" class="tiny" data-del-original="${i}">外す</button></span>`
            )
            .join(
              ''
            )}</div><div class="toolbar"><button type="button" id="add-original">原作を検索して追加</button></div><p class="muted">翻訳先の作品に原作を設定すると、原作側にも翻訳として表示します。</p></form>`
          bindMembers(
            w,
            () => {
              const members = structuredClone(w.people)
              read()
              w.people = members
              draw()
            },
            read
          )
          $('#add-original').onclick = () => {
            read()
            pickRelated(
              'work',
              (record: any) => {
                w.originals.push(record.id)
                draw()
              },
              { exclude: [w.id, ...(w.originals || [])] }
            )
          }
          $$('[data-del-original]').forEach(
            (e) =>
              (e.onclick = () => {
                read()
                w.originals = w.originals.filter((i: string) => i !== e.dataset.delOriginal)
                draw()
              })
          )
          $('#save-work').onclick = () => {
            if (!$('#work-form').reportValidity()) return
            read()
            const i = db.works.findIndex((x: any) => x.id === w.id)
            if (i < 0) db.works.push(w)
            else db.works[i] = w
            persist()
            location.hash = '#work/' + w.id
            workDetail(w)
            notify('作品を保存しました')
          }
        }
        draw()
      }

      function addTerm(type: 'roles' | 'statuses', name: string) {
        name = name.trim()
        if (!name) return
        if (db[type].includes(name)) return notify('同じ名称があります')
        db[type].push(name)
        persist()
        settings()
      }

      function renderManage(type: 'roles' | 'statuses', target: string) {
        $('#' + target).innerHTML = db[type]
          .map(
            (name: string, i: number) =>
              `<div class="member"><input data-term="${type}-${i}" value="${esc(
                name
              )}" aria-label="${
                type === 'roles' ? '役割' : '状態'
              }の名称"><button type="button" data-rename="${type}-${i}" class="tiny">修正</button><button type="button" data-move="${type}-${i}" class="tiny" ${
                i === 0 ? 'disabled' : ''
              }>↑</button><button type="button" data-delete="${type}-${i}" class="tiny danger">削除</button></div>`
          )
          .join('')
        $$('[data-rename]', $('#' + target)).forEach(
          (e) =>
            (e.onclick = () => {
              const i = Number(e.dataset.rename.split('-')[1])
              const old = db[type][i]
              const name = $(`[data-term="${type}-${i}"]`).value.trim()
              if (!name || db[type].some((n: string, j: number) => j !== i && n === name))
                return notify('名称が空欄、または重複しています')
              db[type][i] = name
              if (type === 'roles') {
                for (const obj of [...db.books, ...db.works])
                  for (const p of obj.people || [])
                    p.roles = (p.roles || []).map((r: string) => (r === old ? name : r))
              } else {
                for (const b of db.books) if (b.status === old) b.status = name
              }
              persist()
              settings()
              notify('名称を更新しました')
            })
        )
        $$('[data-move]', $('#' + target)).forEach(
          (e) =>
            (e.onclick = () => {
              const i = Number(e.dataset.move.split('-')[1])
              ;[db[type][i - 1], db[type][i]] = [db[type][i], db[type][i - 1]]
              persist()
              settings()
            })
        )
        $$('[data-delete]', $('#' + target)).forEach(
          (e) =>
            (e.onclick = () => {
              const i = Number(e.dataset.delete.split('-')[1])
              const name = db[type][i]
              if (type === 'statuses') {
                if (name === '未設定') return notify('「未設定」は残してください')
                const affected = db.books.filter((b: any) => b.status === name)
                openModal(
                  `<h2>状態「${esc(name)}」を削除</h2><p>使用中：${
                    affected.length
                  }冊。変更先を選択してください。</p><select id="replacement">${opts(
                    db.statuses.filter((n: string) => n !== name),
                    '未設定'
                  )}</select> <button type="button" class="danger" id="confirm-delete-status">変更して削除</button>`
                )
                $('#confirm-delete-status').onclick = () => {
                  const replacement = $('#replacement').value
                  affected.forEach((b: any) => {
                    b.status = replacement
                    b.modified = new Date().toISOString()
                  })
                  db.statuses.splice(i, 1)
                  persist()
                  closeModal()
                  settings()
                  notify('状態を削除しました')
                }
              } else {
                if (!confirm('使用中の「' + name + '」も役割設定から外しますか？')) return
                db.roles.splice(i, 1)
                for (const obj of [...db.books, ...db.works])
                  for (const p of obj.people || [])
                    p.roles = (p.roles || []).filter((r: string) => r !== name)
                persist()
                settings()
              }
            })
        )
      }

      // JSZipをCDNから読み込んで書影ZIPまたはJPG群をSupabase Storage `covers` バケットへアップロードする
      async function uploadCoverFiles(files: FileList, statusEl: HTMLElement) {
        const list = Array.from(files)
        let uploaded = 0
        let failed = 0

        for (const file of list) {
          if (file.name.toLowerCase().endsWith('.zip')) {
            statusEl.textContent = `ZIPを展開中: ${file.name} ...`
            if (!(window as any).JSZip) {
              await new Promise((resolve, reject) => {
                const s = document.createElement('script')
                s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
                s.onload = resolve
                s.onerror = () => reject(Error('JSZipの読み込みに失敗しました'))
                document.head.append(s)
              })
            }
            const zip = await (window as any).JSZip.loadAsync(file)
            const entries = Object.values(zip.files).filter(
              (e: any) => !e.dir && /\.(jpe?g|png)$/i.test(e.name)
            ) as any[]
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i]
              const baseName = entry.name.split('/').pop()!
              const blob = await entry.async('blob')
              const { error } = await supabase.storage.from('covers').upload(baseName, blob, {
                upsert: true,
                contentType: 'image/jpeg',
              })
              if (error) failed++
              else uploaded++
              statusEl.textContent = `${file.name}: ${i + 1} / ${entries.length} 枚処理済み（成功: ${uploaded}, 失敗: ${failed}）`
            }
          } else if (/\.(jpe?g|png)$/i.test(file.name)) {
            const { error } = await supabase.storage.from('covers').upload(file.name, file, {
              upsert: true,
              contentType: file.type || 'image/jpeg',
            })
            if (error) failed++
            else uploaded++
            statusEl.textContent = `画像アップロード中: 成功 ${uploaded} 枚 / 失敗 ${failed} 枚`
          }
        }
        statusEl.textContent = `完了！ 合計 ${uploaded} 枚の書影を保存しました${
          failed ? `（失敗 ${failed} 件：SQL Editorでcoversバケット作成SQLを実行してください）` : '。'
        }`
      }

      function settings() {
        ensureWorkFormats()
        app.innerHTML = `<div class="page-head"><h1>管理</h1></div><div class="cards"><section class="panel"><h2>役割ラベル</h2><div id="role-management"></div><div class="toolbar"><input id="new-role" aria-label="新しい役割"><button type="button" id="add-role">追加</button></div></section><section class="panel"><h2>状態の種類</h2><div id="status-management"></div><div class="toolbar"><input id="new-status" aria-label="新しい状態"><button type="button" id="add-status">追加</button></div></section><section class="panel"><h2>作品の形式</h2><div id="format-management"></div><div class="toolbar"><input id="new-format" aria-label="新しい作品の形式"><button type="button" id="add-format">追加</button></div></section></div><section class="panel"><h2>書影（表紙画像）の一括取込</h2><p class="muted">お手元の書影ZIPファイル（<code>YOPAC_書影_001.zip</code> など複数選択可）または展開済みのJPG画像を選択すると、Supabase Storage（<code>covers</code>バケット）へ一括保存され、全蔵書の書影が表示されます。</p><div class="toolbar"><label class="button primary">書影ZIP / 画像ファイルを選択して取込<input id="cover-batch-input" type="file" accept=".zip,image/*" multiple hidden></label></div><p id="image-import-status" class="muted" role="status"></p></section><section class="panel"><h2>保存した検索</h2>${
          db.saved
            .map(
              (s: any) =>
                `<div class="member"><span>${esc(
                  s.name
                )}</span><button type="button" data-load="${
                  s.id
                }">使用</button><button type="button" class="danger" data-del-search="${
                  s.id
                }">削除</button></div>`
            )
            .join('') || '<p>まだありません。</p>'
        }</section><section class="panel"><h2>データの保存・バックアップ</h2><p>変更はSupabaseデータベースにリアルタイム保存されます。</p><div class="toolbar"><button type="button" id="backup">全データをJSONで保存</button><button type="button" id="reload-data">最新データを読み直す</button></div></section>`
        renderWorkFormats()
        renderManage('roles', 'role-management')
        renderManage('statuses', 'status-management')
        $('#add-role').onclick = () => addTerm('roles', $('#new-role').value)
        $('#add-status').onclick = () => addTerm('statuses', $('#new-status').value)
        $('#backup').onclick = () => download('YOPAC-backup.json', JSON.stringify(db, null, 2))
        $('#reload-data').onclick = () => {
          if (saveRunning || pendingTarget || saveBlocked)
            return notify('保存の完了を確認してください')
          location.reload()
        }
        const batchInput = $('#cover-batch-input')
        if (batchInput) {
          batchInput.onchange = async () => {
            if (!batchInput.files?.length) return
            const statusEl = $('#image-import-status')
            await uploadCoverFiles(batchInput.files, statusEl)
          }
        }
        $$('[data-load]').forEach(
          (e) =>
            (e.onclick = () => {
              filters = structuredClone(
                db.saved.find((x: any) => x.id === e.dataset.load).filters
              )
              goBooks()
            })
        )
        $$('[data-del-search]').forEach(
          (e) =>
            (e.onclick = () => {
              db.saved = db.saved.filter((x: any) => x.id !== e.dataset.delSearch)
              persist()
              settings()
            })
        )
      }

      // 1. ワンステップで即座にその場でカメラ起動するISBNスキャナ
      async function scanISBN(done: any, { lookup = false }: { lookup?: boolean } = {}) {
        openModal(
          `<h2>ISBNバーコード読取</h2><p id="scanner-message" class="muted" role="status">カメラを起動しています。本のバーコード（978〜）をかざしてください…</p><video id="scanner-video" playsinline muted></video><div class="toolbar"><label class="button secondary">写真・画像から読取<input id="barcode-photo" type="file" accept="image/*" capture="environment" hidden></label><input id="manual-isbn" aria-label="ISBN" placeholder="またはISBNを直接入力" inputmode="numeric" style="flex:1"><button type="button" id="use-isbn" class="primary">${
            lookup ? 'このISBNで取得' : 'このISBNで検索'
          }</button></div>`
        )
        const input = $('#manual-isbn')
        const message = $('#scanner-message')
        const video = $('#scanner-video') as HTMLVideoElement
        let stopped = false
        let zxingReader: any = null
        let mediaStream: MediaStream | null = null

        const stopAll = () => {
          stopped = true
          try {
            zxingReader?.reset()
          } catch {}
          if (mediaStream) {
            mediaStream.getTracks().forEach((t) => t.stop())
            mediaStream = null
          }
        }
        scanCleanup = stopAll

        function consume(value: string) {
          const isbn = isbnClean(value)
          if (!validISBN(isbn)) {
            message.textContent = '有効なISBN（10桁または13桁）を入力してください。'
            return
          }
          stopAll()
          closeModal()
          done(isbn)
        }

        $('#use-isbn').onclick = () => consume(input.value)
        input.onkeydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault()
            consume(input.value)
          }
        }

        async function loadZXing() {
          if (!(window as any).ZXing) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script')
              script.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'
              script.onload = resolve
              script.onerror = () => reject(Error('読取ライブラリを取得できません'))
              document.head.append(script)
            })
          }
          return new (window as any).ZXing.BrowserMultiFormatReader()
        }

        $('#barcode-photo').onchange = async (e: any) => {
          const file = e.target.files?.[0]
          if (!file) return
          message.textContent = '画像からバーコードを読取中…'
          const url = URL.createObjectURL(file)
          try {
            const reader = await loadZXing()
            const result = await reader.decodeFromImageUrl(url)
            if (!stopped) consume(result.text)
          } catch {
            if (!stopped)
              message.textContent =
                '画像から読み取れませんでした。明るい場所で撮影するか手入力してください。'
          } finally {
            URL.revokeObjectURL(url)
          }
        }

        // モーダルを開いた瞬間に自動でカメラ読取を開始（余分なボタンクリック不要）
        try {
          zxingReader = await loadZXing()
          if (stopped) return
          await zxingReader.decodeFromConstraints(
            { video: { facingMode: { ideal: 'environment' } }, audio: false },
            video,
            (result: any) => {
              if (!stopped && result && validISBN(result.text)) {
                consume(result.text)
              }
            }
          )
          message.textContent = 'バーコード（978から始まる上段）を枠内に写すと自動で読み取ります。'
        } catch {
          if (!stopped) {
            video.hidden = true
            message.textContent =
              'カメラの自動起動が許可されていないか非対応です。「写真・画像から読取」または手入力をご利用ください。'
          }
        }
      }

      async function fetchNdlViaProxy(targetUrl: string) {
        const res = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
        )
        if (!res.ok) throw Error('NDL応答：HTTP ' + res.status)
        return await res.text()
      }

      async function loadXML(url: string) {
        const text = await fetchNdlViaProxy(url)
        const xml = new DOMParser().parseFromString(text, 'application/xml')
        if (xml.getElementsByTagName('parsererror').length)
          throw Error('NDLの応答を読み取れません')
        return xml
      }

      function tagValues(node: any, local: string) {
        return [...node.getElementsByTagNameNS('*', local)]
          .map((n: any) => n.textContent.trim())
          .filter(Boolean)
      }

      function ndlAgentNames(node: any, kind: string) {
        const structured = [
          ...node.getElementsByTagNameNS('http://purl.org/dc/terms/', kind),
        ]
          .flatMap((agent: any) =>
            [...agent.getElementsByTagNameNS('http://xmlns.com/foaf/0.1/', 'name')].map(
              (name: any) => name.textContent.trim()
            )
          )
          .filter(Boolean)
        const fallback = [
          ...node.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', kind),
        ]
          .map((name: any) => name.textContent.trim())
          .filter(Boolean)
        return [...new Set(structured.length ? structured : fallback)]
      }

      // OpenBD + NDL 連携で書誌情報（分類番号・価格・シリーズ・巻号・副題・書影）を一括取得
      async function lookupBook(isbn: string, draft: any, redraw: any) {
        isbn = isbnClean(isbn)
        if (!validISBN(isbn)) return notify('有効なISBNを入力してください')
        openModal('<h2>NDL / OpenBD から書誌情報を取得</h2><p data-ndl-loading>検索中…</p>')
        const loading = modalBody.querySelector('[data-ndl-loading]')
        const isCurrent = () => modal.open && modalBody.contains(loading)
        try {
          let openBdCover = ''
          let openBdPrice = ''
          let openBdSeries = ''
          let openBdVolume = ''
          let openBdSubtitle = ''
          try {
            const obdRes = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn}`)
            if (obdRes.ok) {
              const obdJson = await obdRes.json()
              const item = obdJson?.[0]
              openBdCover = item?.summary?.cover || ''
              openBdSeries = item?.summary?.series || ''
              openBdVolume = item?.summary?.volume || ''
              const onix = item?.onix
              openBdSubtitle =
                onix?.DescriptiveDetail?.TitleDetail?.TitleElement?.Subtitle?.content || ''
              const prices = onix?.ProductSupply?.SupplyDetail?.Price || []
              const jpy = prices.find((p: any) => p.CurrencyCode === 'JPY') || prices[0]
              if (jpy?.PriceAmount) {
                openBdPrice = String(jpy.PriceAmount).replace(/[^\d]/g, '')
              }
            }
          } catch {}

          const query = 'isbn="' + isbn + '" AND dpid="iss-ndl-opac"'
          const url =
            'https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&version=1.2&recordSchema=dcndl&recordPacking=xml&maximumRecords=10&query=' +
            encodeURIComponent(query)
          const xml = await loadXML(url)
          if (!isCurrent()) return
          const data = [...xml.getElementsByTagNameNS('*', 'recordData')]
          if (!data.length) throw Error('NDLで候補が見つかりませんでした')

          const candidates = data.map((n) => {
            // NDC（分類番号）の抽出
            const subjects = [...n.getElementsByTagNameNS('http://purl.org/dc/terms/', 'subject')]
            let ndc = ''
            for (const s of subjects) {
              const resAttr =
                s.getAttributeNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'resource') ||
                s.getAttribute('rdf:resource') ||
                ''
              const m = resAttr.match(/ndc(?:9|10)?\/([0-9A-Za-z.]+)/i)
              if (m) {
                ndc = m[1]
                break
              }
            }
            if (!ndc) {
              const rawSubj = tagValues(n, 'subject').find((v) => /^\d{3}(?:\.\d+)?$/.test(v))
              if (rawSubj) ndc = rawSubj
            }

            // 価格の抽出（例: "1800円" -> "1800"）
            const rawPriceText = tagValues(n, 'price')[0] || ''
            const priceMatch = rawPriceText.replace(/,/g, '').match(/(\d+)/)
            const ndlPrice = priceMatch ? priceMatch[1] : ''

            // シリーズ・巻号・副題の抽出
            const seriesTitle = tagValues(n, 'seriesTitle')[0] || openBdSeries
            const volume = tagValues(n, 'volume')[0] || openBdVolume
            const subtitle = tagValues(n, 'alternative')[0] || openBdSubtitle

            return {
              title: tagValues(n, 'title')[0] || '',
              subtitle,
              series: seriesTitle,
              volume,
              publisher: ndlAgentNames(n, 'publisher')[0] || '',
              authors: ndlAgentNames(n, 'creator'),
              classification: ndc,
              price: ndlPrice || openBdPrice,
              source: tagValues(n, 'seeAlso')[0] || '',
              isbn,
            }
          })

          openModal(
            `<h2>NDLの候補を確認</h2><p class="muted">書名・分類・価格・シリーズ・出版社・著者・書影を取り込みます。</p>${candidates
              .map(
                (c, i) =>
                  `<section class="panel"><h3>${esc(c.title)}${
                    c.volume ? ' ' + esc(c.volume) : ''
                  }</h3><p>${esc(c.publisher)}${
                    c.classification ? ` / 分類: ${esc(c.classification)}` : ''
                  }${c.price ? ` / 価格: ${esc(c.price)}円` : ''}</p><p>${esc(
                    c.authors.join(' / ')
                  )}</p><button type="button" class="primary" data-ndl-candidate="${i}">この候補を取り込む</button></section>`
              )
              .join('')}`
          )
          $$('[data-ndl-candidate]', modalBody).forEach(
            (e) =>
              (e.onclick = () => {
                const c = candidates[Number(e.dataset.ndlCandidate)]
                draft.title = c.title
                if (c.subtitle && !draft.subtitle) draft.subtitle = c.subtitle
                if (c.series && !draft.series) draft.series = c.series
                if (c.volume && !draft.volume) draft.volume = c.volume
                if (c.classification && !draft.classification)
                  draft.classification = c.classification
                if (c.price && !draft.price) draft.price = c.price
                draft.isbn = isbn
                if (!draft.cover) {
                  const i13 = toIsbn13(isbn)
                  draft.cover =
                    openBdCover || (i13 ? `https://ndlsearch.ndl.go.jp/thumbnail/${i13}.jpg` : '')
                }
                if (c.publisher) {
                  let p = db.publishers.find(
                    (pub: any) => normal(pub.name) === normal(c.publisher)
                  )
                  if (!p) {
                    p = { id: id(), name: c.publisher, reading: '' }
                    db.publishers.push(p)
                  }
                  draft.publisher = p.id
                }
                for (const name of c.authors) {
                  let p = db.people.find((per: any) => normal(per.name) === normal(name))
                  if (!p) {
                    p = {
                      id: id(),
                      name,
                      reading: '',
                      description: '',
                      url: '',
                      original: '',
                      aliases: [],
                      ndlId: '',
                    }
                    db.people.push(p)
                  }
                  if (!draft.people.some((m: any) => m.id === p.id))
                    draft.people.push({ id: p.id, roles: [], printed: name })
                }
                persist()
                closeModal()
                redraw()
                notify('候補を取り込みました。内容を確認して保存してください')
              })
          )
        } catch (e: any) {
          if (!isCurrent()) return
          openModal(
            `<h2>NDL取得を完了できませんでした</h2><p>${esc(
              e.message
            )}</p><a class="button" href="https://ndlsearch.ndl.go.jp/search?cs=bib&keyword=${encodeURIComponent(
              isbn
            )}" target="_blank" rel="noopener">NDLでISBNを検索する ↗</a>`
          )
        }
      }
      
      async function lookupAuthorityById(draft: any, redraw: any, provided?: string) {
        const n =
          provided ??
          prompt(
            'NDL典拠IDを入力してください。例：00054222。候補人物を確認してから取り込めます。',
            draft.ndlId
          )
        if (n === null) return
        if (!/^\d{8,}$/.test(n.trim())) return notify('典拠IDは数字で入力してください')
        openModal('<h2>NDL典拠を取得</h2><p>取得中…</p>')
        try {
          const xml = await loadXML('https://id.ndl.go.jp/auth/ndlna/' + n.trim() + '.rdf')
          const pref = [...xml.getElementsByTagNameNS('*', 'prefLabel')][0]
          const name =
            tagValues(pref || xml, 'literalForm')[0] || tagValues(xml, 'name')[0] || ''
          const kana =
            [...(pref || xml).getElementsByTagNameNS('*', 'transcription')].find(
              (e: any) => (e.getAttribute('xml:lang') || '') === 'ja-Kana'
            )?.textContent || ''
          const aliases = [...xml.getElementsByTagNameNS('*', 'altLabel')].flatMap((e) =>
            tagValues(e, 'literalForm')
          )
          openModal(
            `<h2>人物の典拠候補を確認</h2><p>${esc(name)}</p><p>${esc(
              kana
            )}</p><p>別表記：${esc(
              aliases.join(' / ')
            )}</p><button type="button" class="primary" id="import-authority">この人物の情報を取り込む</button>`
          )
          $('#import-authority').onclick = () => {
            draft.name = name || draft.name
            draft.reading = kana || draft.reading
            draft.aliases = [...new Set([...(draft.aliases || []), ...aliases])]
            draft.ndlId = n.trim()
            closeModal()
            redraw()
          }
        } catch (e: any) {
          openModal(
            `<h2>NDL典拠を取得できませんでした</h2><p>${esc(
              e.message
            )}</p><a class="button" href="https://id.ndl.go.jp/auth/ndlna/${encodeURIComponent(
              n.trim()
            )}" target="_blank" rel="noopener">NDL典拠を開く ↗</a>`
          )
        }
      }

      async function lookupAuthority(draft: any, redraw: any) {
        openModal(
          `<h2>NDL人物・団体の検索</h2><div class="toolbar"><input id="authority-name" aria-label="NDL人物検索" placeholder="人物名・団体名" value="${esc(
            draft.name
          )}"><button type="button" id="authority-search">名前で検索</button></div><div class="toolbar"><input id="authority-id" aria-label="NDL典拠ID" placeholder="NDL典拠ID" value="${esc(
            draft.ndlId
          )}"><button type="button" id="authority-load-id">IDで取得</button></div><div id="authority-results" role="status"></div>`
        )
        $('#authority-load-id').onclick = () =>
          lookupAuthorityById(draft, redraw, $('#authority-id').value)
        $('#authority-search').onclick = async () => {
          const name = $('#authority-name').value.trim()
          if (!name) return
          const result = $('#authority-results')
          result.textContent = '検索中…'
          try {
            const q =
              'PREFIX xl: <http://www.w3.org/2008/05/skos-xl#> SELECT DISTINCT ?uri ?label WHERE { ?uri xl:prefLabel/xl:literalForm ?label . FILTER(CONTAINS(LCASE(STR(?label)), LCASE(' +
              JSON.stringify(name) +
              '))) } LIMIT 15'
            const data = JSON.parse(
              await fetchNdlViaProxy(
                'https://id.ndl.go.jp/auth/ndla?output=json&query=' + encodeURIComponent(q)
              )
            )
            const rows = data.results?.bindings || []
            result.innerHTML = rows.length
              ? rows
                  .map(
                    (r: any) =>
                      `<div class="member"><span>${esc(
                        r.label.value
                      )}</span><button type="button" data-authority-id="${esc(
                        r.uri.value.split('/').pop()
                      )}">詳細を取得</button></div>`
                  )
                  .join('')
              : '候補が見つかりませんでした。別表記でも検索してください。'
            $$('[data-authority-id]', result).forEach(
              (e) =>
                (e.onclick = () => lookupAuthorityById(draft, redraw, e.dataset.authorityId))
            )
          } catch (e: any) {
            result.innerHTML = `<p>検索できませんでした。${esc(
              e.message
            )}</p><a href="https://id.ndl.go.jp/auth/ndla" target="_blank" rel="noopener">NDL典拠を開く ↗</a>`
          }
        }
      }

      function notFound() {
        app.innerHTML =
          '<div class="panel"><h1>登録が見つかりません</h1><a href="#books">所蔵リストへ戻る</a></div>'
      }

      function route() {
        closeModal()
        window.scrollTo(0, 0)
        if (role === 'viewer') {
          if (location.hash !== '#books') history.replaceState(null, '', '#books')
          listBooks()
          return
        }
        const [kind, key] = location.hash.slice(1).split('/')
        switch (kind) {
          case 'publishers':
            publishersList()
            break
          case 'publisher': {
            const p = db.publishers.find((x: any) => x.id === key)
            p ? publisherDetail(p) : notFound()
            break
          }
          case 'people':
            peopleList()
            break
          case 'person': {
            const p = person(key)
            p ? personDetail(p) : notFound()
            break
          }
          case 'works':
            worksList()
            break
          case 'work': {
            const w = work(key)
            w ? workDetail(w) : notFound()
            break
          }
          case 'settings':
            settings()
            break
          case 'book':
            if (key === 'new') editBook(null)
            else {
              const b = db.books.find((x: any) => x.id === key)
              b ? bookDetail(b) : notFound()
            }
            break
          case 'edit-book': {
            const b = db.books.find((x: any) => x.id === key)
            b ? editBook(b) : notFound()
            break
          }
          default:
            listBooks()
        }
      }

      window.addEventListener('hashchange', route)
      saveStateLabel('読み込み済み')
      const roleLabel = document.getElementById('role-label')
      if (roleLabel) roleLabel.textContent = role === 'viewer' ? '利用者 · 閲覧専用' : '管理者'

      const nav = document.getElementById('main-nav')
      if (nav) {
        if (role === 'viewer') {
          const backToAdminLink = isAdminUser
            ? `<a href="${window.location.pathname}">管理者画面に戻る</a>`
            : ''
          nav.innerHTML = `<a href="#books">所蔵リスト</a>${backToAdminLink}<button type="button" class="nav-btn" id="logout-btn">ログアウト</button>`
        } else {
          nav.innerHTML = `<a href="#books">所蔵リスト</a><a href="#people">個人・団体</a><a href="#works">作品</a><a href="#publishers">出版者・レーベル</a><a href="#settings">管理</a><a href="${window.location.pathname}?view=viewer">利用者画面を確認</a><button type="button" class="nav-btn" id="logout-btn">ログアウト</button>`
        }
        const logoutBtn = document.getElementById('logout-btn')
        if (logoutBtn) {
          logoutBtn.onclick = async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }
        }
      }

      route()
    }

    boot().catch((err) => {
      const app = document.getElementById('app')
      if (app) app.textContent = '読み込みできませんでした：' + err.message
      const sync = document.getElementById('sync-status')
      if (sync) sync.textContent = '接続を確認してください'
    })
  }, [router, supabase])

  return (
    <div className="yopac-root">
      <style dangerouslySetInnerHTML={{ __html: HONGAKU_STYLE }} />
      <div className="demo-banner">
        YOPAC v1.0 · <span id="role-label">管理者</span> ·{' '}
        <span id="sync-status" role="status">
          データを読み込み中…
        </span>
      </div>
      <header>
        <a className="brand" href="#books">
          YOPAC <small>芳弘の蔵書管理システム</small>
        </a>
        <nav id="main-nav" aria-label="主なメニュー">
          <a href="#books">所蔵リスト</a>
          <a href="#people">個人・団体</a>
          <a href="#works">作品</a>
          <a href="#publishers">出版者・レーベル</a>
          <a href="#settings">管理</a>
        </nav>
      </header>
      <main id="app">
        <p>蔵書データを読み込んでいます…</p>
      </main>
      <div id="toast" role="status"></div>
      <dialog id="modal">
        <div id="modal-body"></div>
        <button type="button" id="close-modal" className="secondary" style={{ marginTop: '14px' }}>
          閉じる
        </button>
      </dialog>
    </div>
  )
}
