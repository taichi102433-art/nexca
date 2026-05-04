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
  .code-row{display:flex;gap:8px}.code-row input{flex:1}.danger-note{font-size:10px;color:var(--dim);line-height:1.6;margin-top:4px}`;
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
    const extra=`<div class="form-group"><div class="form-label">参加コード</div><div class="code-row"><input class="form-input" id="f-code" type="text" maxlength="16" placeholder="例：ART001" value="${safe(ev?ev.code:'')}"><button class="eli-btn eli-btn-stat" type="button" onclick="genParticipationCode()">自動生成</button></div><div class="danger-note">変更すると古い参加コードは使えなくなります。無効化したい場合は空欄にしてください。</div></div><div class="form-group"><div class="form-label">掲載期間</div><div class="form-row"><input class="form-input" id="f-period-start" type="date" value="${safe(ev?ev.ds:'')}"><input class="form-input" id="f-period-end" type="date" value="${safe(ev?ev.de:'')}"></div></div>`;
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
      participation_code:$('#f-code')?.value.trim().toUpperCase()||null,age_groups:ages,is_fixed:$('#f-fixed')?.checked||false,show_in_feed:true,is_active:true,organizer_id:user.id,emoji:genreRaw[3]||(g==='vintage'?'👗':g==='cafe'?'☕':'🎉'),background:'linear-gradient(135deg,#1a1a2e,#16213e)'
    };
    try{
      if(window.editingId){await sb.from('events').update(payload).eq('id',editingId);showToast('✅ 更新しました');}
      else{await sb.from('events').insert({...payload,id:crypto.randomUUID(),created_at:new Date().toISOString()});showToast('🎉 掲載しました！');}
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
    el.innerHTML=`<div class="data-summary"><div class="ds-t">📊 ${safe(ev.title)}</div><div class="ds-grid">${nums.map((n,i)=>`<div class="ds-item"><div class="ds-n" style="color:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};">${n}</div><div class="ds-l">${labels[i]}</div></div>`).join('')}</div></div><div class="data-section"><div class="data-section-t">リアルタイム表示グラフ</div><div class="mini-chart">${nums.map((n,i)=>`<div class="mini-bar" style="height:${Math.max(8,Math.round(n/max*100))}%;background:${['var(--blue)','var(--red)','var(--yellow)','var(--green)','var(--purple)'][i]};"><span>${labels[i]}</span></div>`).join('')}</div></div><div class="data-plan-note"><div class="dpn-t">Foundingメンバー特典</div><div class="dpn-s">2026年7月〜12月は無料。2027年1月から月額 <strong>3,300円</strong> の予定です。</div></div>`;
  };
  function decorate(){
    extendGenres();
    const logo=$('.hd-logo'); if(logo&&!$('.founding-badge'))logo.insertAdjacentHTML('afterend','<span class="founding-badge">Founding</span>');
    const plan=$('.plan-price'); if(plan)plan.innerHTML='2026年7月〜12月無料 / 2027年1月から <strong>月3,300円</strong>';
  }
  window.addEventListener('DOMContentLoaded',()=>{decorate();setTimeout(()=>{renderHome&&renderHome();renderEventList&&renderEventList();},700);});
})();
