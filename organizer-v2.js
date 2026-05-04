(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const css=document.createElement('style');
  css.textContent=`
  .founding-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;background:rgba(255,190,0,.12);border:1px solid rgba(255,190,0,.25);color:var(--yellow);font-size:9px;font-weight:900;margin-left:6px}
  .mini-chart{height:120px;display:flex;align-items:flex-end;gap:8px;padding:10px;background:var(--s2);border-radius:12px;border:1px solid rgba(255,255,255,.06)}
  .mini-bar{flex:1;border-radius:7px 7px 3px 3px;min-height:8px;background:linear-gradient(180deg,var(--red),rgba(255,23,68,.35));position:relative}
  .mini-bar span{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:9px;color:var(--dim);margin-bottom:4px}
  .plan-price strong{font-size:18px;color:var(--green)}
  .code-row{display:flex;gap:8px}.code-row input{flex:1}.danger-note{font-size:10px;color:var(--dim);line-height:1.6;margin-top:4px}
  .seg-title{font-size:11px;font-weight:900;color:var(--dim);letter-spacing:1px;margin:14px 0 8px}.seg-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.seg-card{background:var(--s2);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px}.seg-name{font-size:12px;font-weight:900}.seg-num{font-size:18px;font-weight:900;color:var(--yellow);margin-top:3px}.paid-lock{margin-top:10px;border:1px solid rgba(255,190,0,.25);background:rgba(255,190,0,.08);border-radius:12px;padding:12px;font-size:11px;color:rgba(255,190,0,.85);line-height:1.7}`;
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
      char_image_url:e.char_image_url||'',char_name:e.char_name||'',char_desc:e.char_desc||'',
      date_start:e.date_start,date_end:e.date_end
    };
  }
  if(window.loadMyEvents){
    window.loadMyEvents=async function(){
      if(!window.user)return;
      try{
        const {data,error}=await sb.from('events').select('*').eq('organizer_id',user.id).order('created_at',{ascending:false});
        if(error)throw error;
        window.myEvents=(data||[]).map(mapEvent);
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
    list.innerHTML=myEvents.slice(0,3).map(ev=>`<div class="ev-card" onclick="openEditModal('${ev.id}')"><div class="ev-card-top"><div class="ev-card-em" style="background:${safe(ev.bg)};">${safe(ev.em)}</div><div style="flex:1;"><div class="ev-card-t">${safe(ev.title)}</div><div class="ev-card-s">${safe(ev.ge)} ${safe(ev.gl)} · ${ev.fixed?'固定掲載':(ev.ds?ev.ds.replace(/-/g,'/'):'常時')}</div></div><span class="status-tag ${ev.expired?'status-expired':ev.fixed?'status-fixed':'status-active'}">${ev.expired?'終了':ev.fixed?'固定':'掲載中'}</span></div><div class="ev-stats"><div class="ev-stat"><div class="ev-stat-n" style="color:var(--blue);">${views}</div><div class="ev-stat-l">視聴</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--red);">${likes}</div><div class="ev-stat-l">いいね</div></div><div class="ev-stat"><div class="ev-stat-n" style="color:var(--green);">${parts}</div><div class="ev-stat-l">参加証明</div></div></div></div>`).join('');
  };
  const oldBuild=window.buildForm;
  window.buildForm=function(ev){
    let h=oldBuild?oldBuild(ev):'';
    h=h.replace('YouTubeのURL（動画ID）','動画URL（YouTube / Instagram / TikTok）');
    h=h.replace('ホームページURL','公式サイトURL');
    h=h.replace('申し込み・予約URL','予約リンクURL');
    const extra=`<div class="form-group"><div class="form-label">参加コード</div><div class="code-row"><input class="form-input" id="f-code" type="text" maxlength="16" placeholder="例：ART001" value="${safe(ev?ev.code:'')}"><button class="eli-btn eli-btn-stat" type="button" onclick="genParticipationCode()">自動生成</button></div><div class="danger-note">変更すると古い参加コードは使えなくなります。無効化したい場合は空欄にしてください。</div></div><div class="form-group"><div class="form-label">主催者独自キャラ画像URL</div><input class="form-input" id="f-char-img" type="url" placeholder="Supabase Storage / GitHub画像URL" value="${safe(ev?ev.char_image_url||'':'')}"><div class="danger-note">画像を送ってくれれば、このURLに配置してイベント詳細・カードに表示できます。</div></div><div class="form-group"><div class="form-label">独自キャラ名 / 説明</div><div class="form-row"><input class="form-input" id="f-char-name" type="text" placeholder="例：ミヤジマル" value="${safe(ev?ev.char_name||'':'')}"><input class="form-input" id="f-char-desc" type="text" placeholder="キャラの一言" value="${safe(ev?ev.char_desc||'':'')}"></div></div><div class="form-group"><div class="form-label">掲載期間</div><div class="form-row"><input class="form-input" id="f-period-start" type="date" value="${safe(ev?ev.ds:'')}"><input class="form-input" id="f-period-end" type="date" value="${safe(ev?ev.de:'')}"></div></div>`;
    return h.replace('<button class="submit-btn"',extra+'<button class="submit-btn"');
  };
  window.genParticipationCode=function(){const el=$('#f-code');if(el)el.value='NX'+Math.random().toString(36).slice(2,8).toUpperCase();};
  window.submitForm=async function(){
    const title=$('#f-title')?.value.trim(), loc=$('#f-loc')?.value.trim();
    if(!title||!loc){showToast('タイトルと会場は必須です');return;}
    const genreRaw=$('#f-genre')?.value.split('||')||[];
    const ages=$$('input[name="age"]:checked').map(c=>c.value);
    const g=normGenre(genreRaw[0]||'event');
    const payload={
      title,genre:g,sub_genre:genreRaw[1]||'',genre_label:genreRaw[2]||(g==='vintage'?'古着':g==='cafe'?'カフェ':'イベント・体験'),genre_emoji:genreRaw[3]||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),
      date_start:$('#f-period-start')?.value||$('#f-ds')?.value||null,date_end:$('#f-period-end')?.value||$('#f-de')?.value||null,time_info:$('#f-ts')?.value.trim()||'',
      location:loc,address:$('#f-addr')?.value.trim()||'',price:$('#f-price')?.value.trim()||'',description:$('#f-desc')?.value.trim()||'',
      video_url:$('#f-vid')?.value.trim()||null,instagram_url:$('#f-ig')?.value.trim()||null,website_url:$('#f-hp')?.value.trim()||null,booking_url:$('#f-rev')?.value.trim()||null,has_reservation:!!$('#f-rev')?.value.trim(),
      participation_code:$('#f-code')?.value.trim().toUpperCase()||null,char_image_url:$('#f-char-img')?.value.trim()||null,char_name:$('#f-char-name')?.value.trim()||null,char_desc:$('#f-char-desc')?.value.trim()||null,age_groups:ages,is_fixed:$('#f-fixed')?.checked||false,show_in_feed:true,is_active:true,organizer_id:user.id,emoji:genreRaw[3]||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),background:'linear-gradient(135deg,#1a1a2e,#16213e)'
    };
    const savePayload=async (body)=>{
      if(window.editingId)return sb.from('events').update(body).eq('id',editingId);
      return sb.from('events').insert({...body,id:crypto.randomUUID(),created_at:new Date().toISOString()});
    };
    try{
      let res=await savePayload(payload);
      if(res.error){
        const msg=String(res.error.message||'');
        if(msg.includes('char_image_url')||msg.includes('char_name')||msg.includes('char_desc')){
          const slim={...payload};
          delete slim.char_image_url; delete slim.char_name; delete slim.char_desc;
          res=await savePayload(slim);
        }
      }
      if(res.error)throw res.error;
      showToast(window.editingId?'✅ 更新しました':'🎉 掲載しました！');
      closeModal(); await loadMyEvents(); renderHome(); renderEventList(); populateSelects();
    }catch(e){showToast('エラーが発生しました: '+e.message);}
  };
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
    el.innerHTML=`<div class="data-summary"><div class="ds-t">📊 ${safe(ev.title)}</div><div class="ds-grid">${nums.map((n,i)=>`<div class="ds-item"><div class="ds-n" style="color:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};">${n}</div><div class="ds-l">${labels[i]}</div></div>`).join('')}</div></div><div class="data-section"><div class="data-section-t">月別リアルタイム表示グラフ</div><div class="mini-chart">${nums.map((n,i)=>`<div class="mini-bar" style="height:${Math.max(8,Math.round(n/max*100))}%;background:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};"><span>${labels[i]}</span></div>`).join('')}</div>${segHtml('月別いいね',monthSeg)}${segHtml('年齢層別いいね',ageSeg)}${segHtml('地域別いいね',citySeg)}<div class="paid-lock">有料分析では「大竹市の高校生からいいねが多い」のように、地域 × 年齢層 × 行動を個人が特定されない集計で表示します。</div></div><div class="data-plan-note"><div class="dpn-t">Foundingメンバー特典</div><div class="dpn-s">2026年7月〜12月は無料。2027年1月から月額 <strong>3,300円</strong> の予定です。</div></div>`;
  };
  function decorate(){
    extendGenres();
    const logo=$('.hd-logo'); if(logo&&!$('.founding-badge'))logo.insertAdjacentHTML('afterend','<span class="founding-badge">Founding</span>');
    const plan=$('.plan-price'); if(plan)plan.innerHTML='2026年7月〜12月無料 / 2027年1月から <strong>月3,300円</strong>';
  }
  window.addEventListener('DOMContentLoaded',()=>{decorate();setTimeout(()=>{renderHome&&renderHome();renderEventList&&renderEventList();},700);});
})();
