(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const OWNER_EMAIL='taichi102433@gmail.com';
  let reviewQueue=[];
  let isNexcaAdmin=false;
  const css=document.createElement('style');
  css.textContent=`
  .founding-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;background:rgba(255,190,0,.12);border:1px solid rgba(255,190,0,.25);color:var(--yellow);font-size:9px;font-weight:900;margin-left:6px}
  .mini-chart{height:120px;display:flex;align-items:flex-end;gap:8px;padding:10px;background:var(--s2);border-radius:12px;border:1px solid rgba(255,255,255,.06)}
  .mini-bar{flex:1;border-radius:7px 7px 3px 3px;min-height:8px;background:linear-gradient(180deg,var(--red),rgba(255,23,68,.35));position:relative}
  .mini-bar span{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:9px;color:var(--dim);margin-bottom:4px}
  .plan-price strong{font-size:18px;color:var(--green)}
  .code-row{display:flex;gap:8px}.code-row input{flex:1}.danger-note{font-size:10px;color:var(--dim);line-height:1.6;margin-top:4px}
  .seg-title{font-size:11px;font-weight:900;color:var(--dim);letter-spacing:1px;margin:14px 0 8px}.seg-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.seg-card{background:var(--s2);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px}.seg-name{font-size:12px;font-weight:900}.seg-num{font-size:18px;font-weight:900;color:var(--yellow);margin-top:3px}.paid-lock{margin-top:10px;border:1px solid rgba(255,190,0,.25);background:rgba(255,190,0,.08);border-radius:12px;padding:12px;font-size:11px;color:rgba(255,190,0,.85);line-height:1.7}
  .status-pending{background:rgba(255,190,0,.12);color:var(--yellow)}.status-rejected{background:rgba(255,23,68,.12);color:var(--red)}.status-draft{background:rgba(255,255,255,.06);color:var(--dim)}
  .review-panel{margin:14px;border:1px solid rgba(255,190,0,.24);background:linear-gradient(160deg,rgba(255,190,0,.09),rgba(255,255,255,.025));border-radius:18px;padding:14px}.review-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.review-title{font-size:14px;font-weight:1000}.review-sub{font-size:11px;color:var(--dim);line-height:1.6}.review-list{display:flex;flex-direction:column;gap:10px}.review-card{background:var(--s2);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px}.review-meta{font-size:10px;color:var(--dim);line-height:1.7;margin:6px 0}.review-video{font-size:10px;word-break:break-all;color:var(--blue);margin-top:6px}.review-actions{display:flex;gap:8px;margin-top:10px}.review-actions button{flex:1;border:0;border-radius:10px;padding:11px 8px;font-size:12px;font-weight:900;color:white;font-family:inherit}.approve-btn{background:var(--green)}.reject-btn{background:var(--red)}.review-empty{font-size:12px;color:var(--dim);text-align:center;padding:16px}.review-select{width:100%;margin-top:10px;padding:10px 11px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;color:var(--txt);font-size:12px;font-weight:900;font-family:inherit}.plan-pill{display:inline-flex;padding:3px 8px;border-radius:999px;font-size:9px;font-weight:900;margin-top:6px}.plan-free{background:rgba(255,255,255,.08);color:var(--dim)}.plan-paid{background:rgba(255,190,0,.13);color:var(--yellow);border:1px solid rgba(255,190,0,.22)}.code-display{padding:18px;background:linear-gradient(160deg,rgba(255,190,0,.14),rgba(255,255,255,.035));border:1px solid rgba(255,190,0,.22);border-radius:14px;text-align:center}.code-main{font-family:var(--font-en);font-size:30px;letter-spacing:5px;font-weight:1000;color:var(--yellow);margin:8px 0}.code-copy{width:100%;padding:12px;background:var(--yellow);border:0;border-radius:10px;color:#1a1508;font-size:13px;font-weight:900;font-family:inherit}`;
  document.head.appendChild(css);
  function normGenre(g){return g==='furugiya'?'vintage':g;}
  function extendGenres(){
    if(Array.isArray(window.GENRE_OPTIONS)){
      GENRE_OPTIONS.splice(0,GENRE_OPTIONS.length,
        {g:'vintage',sub:'',label:'古着',emoji:'👗'},
        {g:'cafe',sub:'',label:'カフェ',emoji:'☕'},
        {g:'event',sub:'',label:'イベント・体験',emoji:'🎉'}
      );
    }
  }
  function mapEvent(e){
    const g=normGenre(e.genre||'event');
    return {
      id:e.id,title:e.title||'',g,sub:e.sub_genre||'',gl:e.genre_label||(g==='vintage'?'古着':g==='cafe'?'カフェ':'イベント・体験'),ge:e.genre_emoji||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),
      ds:e.date_start||'',de:e.date_end||'',ts:e.time_info||e.time_range||'',loc:e.location||'',addr:e.address||'',price:e.price||'',desc:e.description||'',vid:e.video_url||'',ig:e.instagram_url||'',hp:e.website_url||e.homepage_url||'',rev:e.booking_url||e.reservation_url||'',
      code:e.participation_code||'',hasRev:!!(e.booking_url||e.reservation_url),fixed:!!e.is_fixed,official:!!e.is_official,expired:!!e.is_expired,bg:e.background||e.bg_gradient||'linear-gradient(135deg,#1a1a2e,#16213e)',em:e.emoji||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),age:e.age_groups||[],tags:e.tags||[],wantCount:e.want_count||0,
      thumbnail_url:e.thumbnail_url||'',char_image_url:e.char_image_url||'',char_name:e.char_name||'',char_desc:e.char_desc||'',
      gacha_enabled:e.gacha_enabled!==false,gacha_conditions:e.gacha_conditions||'',production_option:e.production_option||'self',
      status:e.status||((e.is_active&&e.show_in_feed)?'published':'pending_review'),submitted_by_role:e.submitted_by_role||'organizer',review_note:e.review_note||'',reviewed_at:e.reviewed_at||'',rejection_reason:e.rejection_reason||'',data_plan:e.data_plan||'free',
      date_start:e.date_start,date_end:e.date_end
    };
  }
  function statusLabel(ev){
    const s=ev.status||'pending_review';
    if(s==='published')return ['status-active','掲載中'];
    if(s==='rejected')return ['status-rejected','差戻し'];
    if(s==='draft')return ['status-draft','下書き'];
    return ['status-pending','審査待ち'];
  }
  if(window.loadMyEvents){
    window.loadMyEvents=async function(){
      if(!window.user)return;
      try{
        const {data,error}=await sb.from('events').select('*').eq('organizer_id',user.id).order('created_at',{ascending:false});
        if(error)throw error;
        const mapped=(data||[]).map(mapEvent);
        window.myEvents=mapped;
        try{myEvents=mapped;}catch(e){}
      }catch(e){showToast('掲載データを取得できませんでした');window.myEvents=[];}
    };
  }
  window.renderHome=async function(){
    let views=0,likes=0,wants=0,clicks=0,parts=0;
    const ids=(window.myEvents||[]).map(e=>e.id);
    if(ids.length){
      try{
        const [v,l,w,c,p]=await Promise.all([
          sb.from('event_views').select('id',{count:'exact'}).in('event_id',ids),
          sb.from('likes').select('id',{count:'exact'}).in('event_id',ids),
          sb.from('want_to_go').select('id',{count:'exact'}).in('event_id',ids),
          sb.from('event_link_clicks').select('id',{count:'exact'}).in('event_id',ids),
          sb.from('participations').select('id',{count:'exact'}).in('event_id',ids)
        ]);
        views=v.count||v.data?.length||0; likes=l.count||l.data?.length||0; wants=w.count||w.data?.length||0; clicks=c.count||c.data?.length||0; parts=p.count||p.data?.length||0;
      }catch(e){}
    }
    [['kpi-views',views],['kpi-likes',likes],['kpi-wants',wants],['kpi-clicks',clicks]].forEach(([id,n])=>{const el=$('#'+id);if(el)el.textContent=n;});
    const list=$('#home-ev-list');
    if(!list)return;
    if(!myEvents.length){list.innerHTML='<div class="empty"><div class="empty-ic">📌</div><div class="empty-t">まだ掲載がありません<br>「新規掲載」から追加してください</div></div>';return;}
    list.innerHTML=myEvents.slice(0,3).map(ev=>{const st=statusLabel(ev);return `<div class="ev-card" onclick="openEditModal('${ev.id}')"><div class="ev-card-top"><div class="ev-card-em" style="background:${safe(ev.bg)};">${safe(ev.em)}</div><div style="flex:1;"><div class="ev-card-t">${safe(ev.title)}</div><div class="ev-card-s">${safe(ev.ge)} ${safe(ev.gl)} · ${ev.fixed?'固定掲載':(ev.ds?ev.ds.replace(/-/g,'/'):'常時')}</div></div><span class="status-tag ${st[0]}">${st[1]}</span></div><div class="ev-stats"><div class="ev-stat"><div class="ev-stat-n" style="color:var(--blue);">${views}</div><div class="ev-stat-l">視聴</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--red);">${likes}</div><div class="ev-stat-l">いいね</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--green);">${parts}</div><div class="ev-stat-l">参加証明</div></div></div></div>`}).join('');
    renderReviewPanel();
  };
  window.renderEventList=function(){
    const el=$('#event-list'), label=$('#ev-count-label'); if(!el)return;
    const events=window.myEvents||[];
    if(label){const pub=events.filter(e=>e.status==='published').length,pending=events.filter(e=>e.status!=='published').length;label.textContent=`掲載中 ${pub}件 / 審査中 ${pending}件`;}
    if(!events.length){el.innerHTML='<div class="empty"><div class="empty-ic">📌</div><div class="empty-t">まだ掲載がありません<br>「新規掲載」から追加してください</div></div>';return;}
    el.innerHTML=events.map(ev=>{const st=statusLabel(ev);return `<div class="eli"><div class="eli-top"><div class="eli-em" style="background:${safe(ev.bg)};">${safe(ev.em)}</div><div style="flex:1;min-width:0;"><div class="eli-t">${safe(ev.title)}</div><div class="eli-s">${safe(ev.ge)} ${safe(ev.gl)} · ${ev.ds?ev.ds.replace(/-/g,'/'):ev.fixed?'固定掲載':'常時'}</div>${ev.status==='rejected'?`<div class="danger-note">差戻し理由: ${safe(ev.rejection_reason||'内容を確認してください')}</div>`:''}</div><span class="status-tag ${st[0]}">${st[1]}</span></div><div class="eli-stats"><div class="ev-stat"><div class="ev-stat-n" style="color:var(--blue);">${ev.status==='published'?'公開':'-'}</div><div class="ev-stat-l">状態</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--yellow);">${safe(ev.code||'-')}</div><div class="ev-stat-l">参加コード</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--green);">${ev.char_name?'あり':'-'}</div><div class="ev-stat-l">独自キャラ</div></div></div><div class="eli-btns"><button class="eli-btn eli-btn-edit" onclick="openEditModal('${ev.id}')">✏️ 編集</button><button class="eli-btn eli-btn-stat" onclick="goToData('${ev.id}')">📊 データ</button><button class="eli-btn eli-btn-del" onclick="confirmDelete('${ev.id}')">🗑️</button></div></div>`}).join('')+'<div style="height:80px;"></div>';
  };
  const oldBuild=window.buildForm;
  window.buildForm=function(ev){
    let h=oldBuild?oldBuild(ev):'';
    h=h.replace('YouTubeのURL（動画ID）','動画URL（YouTube / Instagram / TikTok）');
    h=h.replace('ホームページURL','公式サイトURL');
    h=h.replace('申し込み・予約URL','予約リンクURL');
    const extra=`<div class="form-group"><div class="form-label">サムネイル画像URL</div><input class="form-input" id="f-thumb" type="url" placeholder="https://.../thumbnail.jpg" value="${safe(ev?ev.thumbnail_url||'':'')}"><div class="danger-note">チラシ一覧に表示される画像です。タップするとショート動画が開きます。</div></div><div class="form-group"><div class="form-label">参加コード</div><div class="code-row"><input class="form-input" id="f-code" type="text" maxlength="16" placeholder="例：ART001" value="${safe(ev?ev.code:'')}"><button class="eli-btn eli-btn-stat" type="button" onclick="genParticipationCode()">自動生成</button></div><div class="danger-note">ユーザーはQRではなく、この参加コードを入力して参加証明します。</div></div><div class="form-group"><div class="form-label">主催者独自キャラ画像URL</div><input class="form-input" id="f-char-img" type="url" placeholder="Supabase Storage / GitHub画像URL" value="${safe(ev?ev.char_image_url||'':'')}"></div><div class="form-group"><div class="form-label">独自キャラ名 / 説明</div><div class="form-row"><input class="form-input" id="f-char-name" type="text" placeholder="例：ミヤジマル" value="${safe(ev?ev.char_name||'':'')}"><input class="form-input" id="f-char-desc" type="text" placeholder="キャラの一言" value="${safe(ev?ev.char_desc||'':'')}"></div></div><div class="form-group"><div class="form-label">ガチャ出現条件</div><textarea class="form-textarea" id="f-gacha-cond" placeholder="例：友達/デート向け、夕方、雨の日OK、予算1000円、ボケミッション歓迎">${safe(ev?ev.gacha_conditions||'':'')}</textarea><label class="form-check" style="margin-top:8px;"><input type="checkbox" id="f-gacha-enabled" ${!ev||ev.gacha_enabled!==false?'checked':''}><span class="form-check-l">条件が合えばガチャ候補に入れる</span></label></div><div class="form-group"><div class="form-label">動画・キャラ制作オプション</div><select class="form-select" id="f-production"><option value="self" ${ev&&ev.production_option==='self'?'selected':''}>自分で用意する</option><option value="video_request" ${ev&&ev.production_option==='video_request'?'selected':''}>動画制作をNexcaに相談</option><option value="character_request" ${ev&&ev.production_option==='character_request'?'selected':''}>独自キャラ制作をNexcaに相談</option><option value="both_request" ${ev&&ev.production_option==='both_request'?'selected':''}>動画・キャラ両方を相談</option></select></div><div class="form-group"><div class="form-label">契約・掲載規約への同意</div><label class="form-check"><input type="checkbox" id="f-contract-ok" ${ev?'checked':''}><span class="form-check-l">Nexca掲載規約、動画/画像利用許諾、掲載審査、データ提供条件に同意します</span></label><div class="danger-note">同意日時・アカウント・規約バージョン・ブラウザ情報を保存します。正式運用前に弁護士確認を推奨します。</div></div><div class="form-group"><div class="form-label">掲載期間</div><div class="form-row"><input class="form-input" id="f-period-start" type="date" value="${safe(ev?ev.ds:'')}"><input class="form-input" id="f-period-end" type="date" value="${safe(ev?ev.de:'')}"></div></div>`;
    return h.replace('<button class="submit-btn"',extra+'<button class="submit-btn"');
  };
  window.genParticipationCode=function(){const el=$('#f-code');if(el)el.value='NX'+Math.random().toString(36).slice(2,8).toUpperCase();};
  window.submitForm=async function(){
    const title=$('#f-title')?.value.trim(), loc=$('#f-loc')?.value.trim();
    if(!title||!loc){showToast('タイトルと会場は必須です');return;}
    if(!$('#f-contract-ok')?.checked){showToast('掲載規約への同意が必要です');return;}
    const genreRaw=$('#f-genre')?.value.split('||')||[];
    const ages=$$('input[name="age"]:checked').map(c=>c.value);
    const g=normGenre(genreRaw[0]||'event');
    const payload={
      title,genre:g,sub_genre:genreRaw[1]||'',genre_label:genreRaw[2]||(g==='vintage'?'古着':g==='cafe'?'カフェ':'イベント・体験'),genre_emoji:genreRaw[3]||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),
      date_start:$('#f-period-start')?.value||$('#f-ds')?.value||null,date_end:$('#f-period-end')?.value||$('#f-de')?.value||null,time_info:$('#f-ts')?.value.trim()||'',
      location:loc,address:$('#f-addr')?.value.trim()||'',price:$('#f-price')?.value.trim()||'',description:$('#f-desc')?.value.trim()||'',
      video_url:$('#f-vid')?.value.trim()||null,thumbnail_url:$('#f-thumb')?.value.trim()||null,instagram_url:$('#f-ig')?.value.trim()||null,website_url:$('#f-hp')?.value.trim()||null,booking_url:$('#f-rev')?.value.trim()||null,has_reservation:!!$('#f-rev')?.value.trim(),
      participation_code:$('#f-code')?.value.trim().toUpperCase()||null,char_image_url:$('#f-char-img')?.value.trim()||null,char_name:$('#f-char-name')?.value.trim()||null,char_desc:$('#f-char-desc')?.value.trim()||null,age_groups:ages,is_fixed:$('#f-fixed')?.checked||false,
      gacha_enabled:$('#f-gacha-enabled')?.checked!==false,gacha_conditions:$('#f-gacha-cond')?.value.trim()||null,production_option:$('#f-production')?.value||'self',
      status:'pending_review',submitted_by_role:'organizer',submitted_at:new Date().toISOString(),review_note:null,rejection_reason:null,data_plan:'free',show_in_feed:false,is_active:false,
      organizer_id:user.id,emoji:genreRaw[3]||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),background:'linear-gradient(135deg,#1a1a2e,#16213e)'
    };
    const eventId=window.editingId||crypto.randomUUID();
    const savePayload=async (body)=>{
      if(window.editingId)return sb.from('events').update(body).eq('id',editingId);
      return sb.from('events').insert({...body,id:eventId,created_at:new Date().toISOString()});
    };
    try{
      let res=await savePayload(payload);
      if(res.error){
        const msg=String(res.error.message||'');
        if(msg.includes('thumbnail_url')||msg.includes('gacha_enabled')||msg.includes('gacha_conditions')||msg.includes('production_option')||msg.includes('char_image_url')||msg.includes('char_name')||msg.includes('char_desc')||msg.includes('status')||msg.includes('submitted_by_role')||msg.includes('submitted_at')||msg.includes('review_note')||msg.includes('rejection_reason')||msg.includes('data_plan')){
          const slim={...payload};
          delete slim.thumbnail_url; delete slim.gacha_enabled; delete slim.gacha_conditions; delete slim.production_option; delete slim.char_image_url; delete slim.char_name; delete slim.char_desc;
          delete slim.status; delete slim.submitted_by_role; delete slim.submitted_at; delete slim.review_note; delete slim.rejection_reason; delete slim.data_plan;
          res=await savePayload(slim);
        }
      }
      if(res.error)throw res.error;
      try{await sb.from('contract_acceptances').insert({event_id:eventId,user_id:user.id,contract_version:'nexca_listing_terms_v1',accepted_at:new Date().toISOString(),user_agent:navigator.userAgent,terms_snapshot:'Nexca掲載規約、動画/画像利用許諾、掲載審査、データ提供条件への同意'});}catch(e){}
      showToast(window.editingId?'✅ 更新しました。Nexca運営の再審査に送信しました':'📨 Nexca運営に審査依頼を送りました');
      closeModal(); await loadMyEvents(); renderHome(); renderEventList(); populateSelects();
    }catch(e){showToast('エラーが発生しました: '+e.message);}
  };
  async function detectAdmin(){
    if(!window.user){isNexcaAdmin=false;return false;}
    const email=String(user.email||'').toLowerCase();
    isNexcaAdmin=email===OWNER_EMAIL;
    return isNexcaAdmin;
  }
  async function loadReviewQueue(){
    if(!isNexcaAdmin)return [];
    try{
      let r=await sb.from('events').select('*').eq('status','pending_review').order('submitted_at',{ascending:true}).limit(40);
      if(r.error)throw r.error;
      reviewQueue=(r.data||[]).map(mapEvent);
    }catch(e){
      try{
        const r=await sb.from('events').select('*').eq('is_active',false).eq('show_in_feed',false).order('created_at',{ascending:false}).limit(40);
        reviewQueue=(r.data||[]).map(mapEvent);
      }catch(err){reviewQueue=[];}
    }
    return reviewQueue;
  }
  function renderReviewPanel(){
    const homeList=$('#home-ev-list'); if(!homeList||!isNexcaAdmin)return;
    let panel=$('#nexca-review-panel');
    if(!panel){
      homeList.parentElement.insertAdjacentHTML('beforebegin','<div class="review-panel" id="nexca-review-panel"><div class="review-head"><div><div class="review-title">Nexca運営 審査キュー</div><div class="review-sub">主催者から送信された動画・詳細情報・独自キャラを確認して公開します。</div></div><button class="eli-btn eli-btn-stat" onclick="refreshReviewQueue()">更新</button></div><div class="review-list" id="review-list"><div class="review-empty">読み込み中...</div></div></div>');
      panel=$('#nexca-review-panel');
    }
    const list=$('#review-list'); if(!list)return;
    if(!reviewQueue.length){list.innerHTML='<div class="review-empty">審査待ちはありません</div>';return;}
    list.innerHTML=reviewQueue.map(ev=>`<div class="review-card"><div style="display:flex;gap:10px;align-items:flex-start;"><div class="eli-em" style="background:${safe(ev.bg)};">${safe(ev.em)}</div><div style="flex:1;min-width:0;"><div class="eli-t">${safe(ev.title)}</div><div class="review-meta">${safe(ev.ge)} ${safe(ev.gl)} / ${safe(ev.loc)} / ${safe(ev.price||'料金未設定')}<br>${safe(ev.desc).slice(0,160)}${ev.desc&&ev.desc.length>160?'...':''}</div>${ev.vid?`<div class="review-video">動画: ${safe(ev.vid)}</div>`:''}${ev.ig?`<div class="review-video">Instagram: ${safe(ev.ig)}</div>`:''}${ev.hp?`<div class="review-video">公式: ${safe(ev.hp)}</div>`:''}${ev.rev?`<div class="review-video">予約: ${safe(ev.rev)}</div>`:''}${ev.char_name||ev.char_image_url?`<div class="review-video">独自キャラ: ${safe(ev.char_name||'名称未設定')} ${safe(ev.char_desc||'')}</div>${ev.char_image_url?`<div class="review-video">画像: ${safe(ev.char_image_url)}</div>`:''}`:''}<span class="plan-pill ${ev.data_plan==='paid'?'plan-paid':'plan-free'}">${ev.data_plan==='paid'?'有料データ':'無料データ'}</span></div></div><select class="review-select" id="plan-${ev.id}"><option value="free" ${ev.data_plan!=='paid'?'selected':''}>無料データ: 視聴・いいね・行きたい・リンク・参加数</option><option value="paid" ${ev.data_plan==='paid'?'selected':''}>有料データ: 年齢層・地域・月別・属性別分析まで開放</option></select><div class="review-actions"><button class="approve-btn" onclick="approveEvent('${ev.id}')">承認して公開</button><button class="reject-btn" onclick="rejectEvent('${ev.id}')">差戻し</button></div></div>`).join('');
  }
  window.refreshReviewQueue=async function(){await detectAdmin();await loadReviewQueue();renderReviewPanel();};
  window.approveEvent=async function(id){
    if(!isNexcaAdmin){showToast('運営権限がありません');return;}
    const plan=$(`#plan-${id}`)?.value||'free';
    try{
      let r=await sb.from('events').update({status:'published',is_active:true,show_in_feed:true,data_plan:plan,reviewed_at:new Date().toISOString(),reviewed_by:user.id,rejection_reason:null}).eq('id',id);
      if(r.error&&String(r.error.message||'').includes('status'))r=await sb.from('events').update({is_active:true,show_in_feed:true}).eq('id',id);
      if(r.error&&String(r.error.message||'').includes('data_plan'))r=await sb.from('events').update({status:'published',is_active:true,show_in_feed:true,reviewed_at:new Date().toISOString(),reviewed_by:user.id,rejection_reason:null}).eq('id',id);
      if(r.error)throw r.error;
      showToast(`✅ 公開しました（${plan==='paid'?'有料データ':'無料データ'}）`);
      await refreshReviewQueue(); await loadMyEvents(); renderEventList(); populateSelects();
    }catch(e){showToast('承認に失敗しました: '+e.message);}
  };
  window.rejectEvent=async function(id){
    if(!isNexcaAdmin){showToast('運営権限がありません');return;}
    const reason=prompt('差戻し理由を入力してください','内容を確認して再送信してください')||'内容を確認して再送信してください';
    try{
      let r=await sb.from('events').update({status:'rejected',is_active:false,show_in_feed:false,rejection_reason:reason,reviewed_at:new Date().toISOString(),reviewed_by:user.id}).eq('id',id);
      if(r.error&&String(r.error.message||'').includes('status'))r=await sb.from('events').update({is_active:false,show_in_feed:false}).eq('id',id);
      if(r.error)throw r.error;
      showToast('差戻しにしました');
      await refreshReviewQueue(); await loadMyEvents(); renderEventList(); populateSelects();
    }catch(e){showToast('差戻しに失敗しました: '+e.message);}
  };
  const oldPopulate=window.populateSelects;
  window.populateSelects=function(){
    if(oldPopulate)oldPopulate();
    const sel=$('#qr-ev-select'); if(sel)sel.innerHTML='<option value="">イベント・店舗を選択</option>'+(window.myEvents||[]).map(e=>`<option value="${e.id}">${safe(e.title)}</option>`).join('');
  };
  window.updateQR=function(){
    const id=$('#qr-ev-select')?.value, ev=(window.myEvents||[]).find(e=>e.id===id), box=$('#qr-box'), title=$('#qr-title'), sub=$('#qr-sub'), dl=$('#qr-dl-btn');
    if(!box)return;
    if(!ev){box.innerHTML='<div style="text-align:center;padding:10px;"><div style="font-size:28px;margin-bottom:6px;">🔑</div><div style="font-size:10px;color:#888;">イベントを選択してください</div></div>';if(title)title.textContent='イベントを選択してください';if(sub)sub.textContent='主催者が表示する参加コードで証明します';if(dl){dl.disabled=true;dl.style.opacity='.4';dl.textContent='参加コードをコピー';}return;}
    const code=ev.code||'未設定';
    box.innerHTML=`<div class="code-display"><div style="font-size:10px;color:var(--dim);font-weight:900;">PARTICIPATION CODE</div><div class="code-main">${safe(code)}</div><button class="code-copy" onclick="copyParticipationCode('${safe(code)}')">コードをコピー</button></div>`;
    if(title)title.textContent=ev.title;
    if(sub)sub.textContent=ev.fixed?'店頭でこの参加コードを見せて訪問証明します':'イベント会場でこの参加コードを見せて参加証明します';
    if(dl){dl.disabled=false;dl.style.opacity='1';dl.textContent='参加コードをコピーする';}
  };
  window.copyParticipationCode=function(code){if(!code||code==='未設定'){showToast('参加コードが未設定です');return;}navigator.clipboard&&navigator.clipboard.writeText(code);showToast('参加コードをコピーしました');};
  window.downloadQR=function(){const id=$('#qr-ev-select')?.value, ev=(window.myEvents||[]).find(e=>e.id===id);if(!ev){showToast('イベントを選択してください');return;}copyParticipationCode(ev.code||'');};
  window.shareQR=function(){const id=$('#qr-ev-select')?.value, ev=(window.myEvents||[]).find(e=>e.id===id);if(!ev){showToast('イベントを選択してください');return;}const text=`【${ev.title}】参加コード: ${ev.code||'未設定'}\nNexcaで参加証明してください`;if(navigator.share)navigator.share({title:ev.title,text}).catch(()=>{});else{navigator.clipboard&&navigator.clipboard.writeText(text);showToast('コピーしました');}};
  window.loadEventData=async function(){
    const id=$('#data-ev-select')?.value, el=$('#data-content'); if(!el)return;
    if(!id){el.innerHTML='<div class="empty"><div class="empty-ic">📊</div><div class="empty-t">イベントを選択してデータを確認</div></div>';return;}
    const ev=(window.myEvents||[]).find(e=>e.id===id); if(!ev)return;
    el.innerHTML='<div class="empty"><div class="empty-ic">⏳</div><div class="empty-t">読み込み中...</div></div>';
    const [v,l,w,c,p]=await Promise.all([
      sb.from('event_views').select('id',{count:'exact'}).eq('event_id',id),
      sb.from('likes').select('id',{count:'exact'}).eq('event_id',id),
      sb.from('want_to_go').select('id',{count:'exact'}).eq('event_id',id),
      sb.from('event_link_clicks').select('link_type,click_type').eq('event_id',id),
      sb.from('participations').select('id',{count:'exact'}).eq('event_id',id)
    ]);
    const nums=[v.count||v.data?.length||0,l.count||l.data?.length||0,w.count||w.data?.length||0,(c.data||[]).length,p.count||p.data?.length||0];
    const max=Math.max(...nums,1), labels=['閲覧','いいね','行きたい','リンク','参加'];
    let ageSeg=[], citySeg=[], monthSeg=[];
    try{
      const lr=await sb.from('likes').select('created_at,user_id,event_id,profiles(age_group,city)').eq('event_id',id);
      const rows=lr.data||[];
      const countBy=(fn)=>Object.entries(rows.reduce((a,r)=>{const k=fn(r)||'未設定';a[k]=(a[k]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6);
      ageSeg=countBy(r=>r.profiles&&r.profiles.age_group);
      citySeg=countBy(r=>r.profiles&&r.profiles.city);
      monthSeg=countBy(r=>String(r.created_at||'').slice(0,7));
    }catch(e){}
    const segHtml=(title,rows)=>`<div class="seg-title">${title}</div><div class="seg-grid">${(rows.length?rows:[['データなし',0]]).map(r=>`<div class="seg-card"><div class="seg-name">${safe(r[0])}</div><div class="seg-num">${r[1]}</div></div>`).join('')}</div>`;
    const paid=ev.data_plan==='paid';
    el.innerHTML=`<div class="data-summary"><div class="ds-t">📊 ${safe(ev.title)} <span class="plan-pill ${paid?'plan-paid':'plan-free'}">${paid?'有料データ':'無料データ'}</span></div><div class="ds-grid">${nums.map((n,i)=>`<div class="ds-item"><div class="ds-n" style="color:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};">${n}</div><div class="ds-l">${labels[i]}</div></div>`).join('')}</div></div><div class="data-section"><div class="data-section-t">月別リアルタイム表示グラフ</div><div class="mini-chart">${nums.map((n,i)=>`<div class="mini-bar" style="height:${Math.max(8,Math.round(n/max*100))}%;background:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};"><span>${labels[i]}</span></div>`).join('')}</div>${paid?segHtml('月別いいね',monthSeg)+segHtml('年齢層別いいね',ageSeg)+segHtml('地域別いいね',citySeg):'<div class="paid-lock">年齢層別・地域別・月別の深い分析は有料データで開放されます。</div>'}</div><div class="data-plan-note"><div class="dpn-t">Foundingメンバー特典</div><div class="dpn-s">2026年7月〜12月は無料。2027年1月から月額 <strong>3,300円</strong> の予定です。</div></div>`;
  };
  function decorate(){
    extendGenres();
    const logo=$('.hd-logo'); if(logo&&!$('.founding-badge'))logo.insertAdjacentHTML('afterend','<span class="founding-badge">Founding</span>');
    const plan=$('.plan-price'); if(plan)plan.innerHTML='2026年7月〜12月無料 / 2027年1月から <strong>月3,300円</strong>';
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const pairs=[['QRコード生成','参加コード管理'],['QR生成','コード管理'],['参加証明QR','参加コード'],['QRコードを保存する','参加コードをコピーする'],['QRを印刷・スマホに表示','参加コードを店頭・会場で表示'],['参加者がNexcaアプリでスキャン','参加者がNexcaでコード入力'],['QR','コード']];
    const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{let t=n.nodeValue;pairs.forEach(([a,b])=>{t=t.replaceAll(a,b);});n.nodeValue=t;});
  }
  window.addEventListener('DOMContentLoaded',()=>{decorate();setTimeout(async()=>{await detectAdmin();await loadReviewQueue();renderHome&&renderHome();renderEventList&&renderEventList();renderReviewPanel();},700);});
})();
