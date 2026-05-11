(function(){
  'use strict';
  const D=window.NexcaData;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=D.esc;
  const today=new Date('2026-05-11T12:00:00+09:00');
  const state={genre:'all',date:'all',sort:'recommend',areaMode:'profile',listMode:'thumb',query:'',coords:null};
  const store={profile:'nexca_core_profile_v1'};
  function ls(k,d){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d));}catch(e){return d;}}
  function setls(k,v){localStorage.setItem(k,JSON.stringify(v));}
  function profile(){return ls(store.profile,{id:'local-user',nickname:'ゲスト',age:localStorage.getItem('nx_age')||'高校生',area:'広島市中区'});}
  function saveProfile(){
    const p={id:'local-user',nickname:$('#core-nick').value.trim()||'Nexcaユーザー',age:$('#core-age').value,area:$('#core-area').value};
    setls(store.profile,p); localStorage.setItem('nx_age',p.age);
    try{age=p.age;city=p.area;}catch(e){}
    $('#core-setup')?.classList.remove('on'); toast('プロフィールを設定しました'); renderAll();
  }
  function ensureSetup(){
    if($('#core-setup'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="core-setup"><div class="core-setup-box"><h2>Nexcaの初期設定</h2><p>おすすめ表示と主催者向けの地域別反応分析に使います。マイページからいつでも変更できます。</p><label>ニックネーム</label><input id="core-nick" placeholder="例：たいち"><label>年齢層</label><select id="core-age">${['中学生','高校生','大学生','社会人'].map(x=>`<option>${x}</option>`).join('')}</select><label>地域</label><select id="core-area">${D.areas.map(x=>`<option>${x}</option>`).join('')}</select><button onclick="NexcaCore.saveProfile()">Nexcaをはじめる</button></div></div>`);
  }
  function maybeSetup(){ensureSetup();if(!localStorage.getItem(store.profile))$('#core-setup').classList.add('on');}
  function setupShell(){
    $('#core-app-top')?.remove();
    document.body.insertAdjacentHTML('beforeend',`<div id="core-app-top"><div><div class="core-logo">Nexca</div><button class="core-age-btn" onclick="NexcaCore.editProfile()">${esc(profile().age)} ▼</button></div><button class="core-cond-btn" onclick="NexcaCore.openCondition()">条件 ▼</button></div>`);
    const labs=$$('#nav .nb-lb'); if(labs[1])labs[1].textContent='まとめ見';
    const ft=$('.fl-title'); if(ft)ft.textContent='まとめ見';
  }
  function editProfile(){ensureSetup();const p=profile();$('#core-nick').value=p.nickname;$('#core-age').value=p.age;$('#core-area').value=p.area;$('#core-setup').classList.add('on');}
  function visibleListings(){
    let arr=D.publicListings();
    if(state.genre!=='all')arr=arr.filter(x=>x.category===state.genre);
    if(state.areaMode==='profile')arr=arr.filter(x=>x.area===profile().area||profile().area==='広島県全域');
    if(state.date!=='all')arr=arr.filter(matchDate);
    if(state.query)arr=arr.filter(x=>(x.title+x.catchcopy+x.short_description+x.area+x.tags.join('')).includes(state.query));
    if(state.sort==='near'&&state.coords)arr=arr.slice().sort((a,b)=>dist(a)-dist(b));
    if(state.sort==='new')arr=arr.slice().sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
    if(state.sort==='date')arr=arr.slice().sort((a,b)=>String(a.start_date||'9999').localeCompare(String(b.start_date||'9999')));
    return arr;
  }
  function matchDate(x){
    if(x.event_date_type==='evergreen')return ['all','month'].includes(state.date);
    const s=new Date((x.start_date||x.end_date)+'T00:00:00+09:00'), e=new Date((x.end_date||x.start_date)+'T23:59:59+09:00');
    const day=today.getDay(), weekendStart=new Date(today); weekendStart.setDate(today.getDate()+(6-day+7)%7); const weekendEnd=new Date(weekendStart); weekendEnd.setDate(weekendStart.getDate()+1);
    if(state.date==='today')return s<=today&&e>=today;
    if(state.date==='tomorrow'){const t=new Date(today);t.setDate(t.getDate()+1);return s<=t&&e>=t;}
    if(state.date==='week'){const t=new Date(today);t.setDate(t.getDate()+7);return e>=today&&s<=t;}
    if(state.date==='weekend')return e>=weekendStart&&s<=weekendEnd;
    if(state.date==='month')return e>=today&&s.getMonth()===today.getMonth();
    return true;
  }
  function dist(x){const c=state.coords;if(!c||!x.latitude||!x.longitude)return 999999;const R=6371,dLat=(x.latitude-c.lat)*Math.PI/180,dLon=(x.longitude-c.lng)*Math.PI/180,a=Math.sin(dLat/2)**2+Math.cos(c.lat*Math.PI/180)*Math.cos(x.latitude*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function dateText(x){return x.event_date_type==='evergreen'?x.business_hours:(x.start_date===x.end_date?x.start_date:x.start_date+'〜'+x.end_date)+' / '+x.business_hours;}
  function mediaLabel(x){return x.media_type==='flyer'?'チラシ':x.media_type==='video_with_thumbnail'?'動画＋サムネ':'動画あり';}
  function emoji(x){return x.icon||(x.category==='古着'?'👕':x.category==='カフェ'?'☕':'🎪');}
  function colors(x){return x.colors||(x.category==='古着'?['#315f4c','#8dd07c']:x.category==='カフェ'?['#74411f','#df9a54']:['#9d334a','#ef8b52']);}
  function actionState(listingId,type){
    const data=D.load(), u=D.actor().user_id;
    return type==='like'?data.likes.some(x=>x.user_id===u&&x.listing_id===listingId):data.wanted_listings.some(x=>x.user_id===u&&x.listing_id===listingId);
  }
  function renderFeed(){
    const root=$('#feed'), stack=$('#stack'); if(!root||!stack)return;
    const arr=visibleListings().filter(x=>x.show_in_video_feed);
    if(!arr.length){stack.innerHTML='<div class="core-empty-feed"><b>条件に合う動画掲載がありません</b><span>右上の条件からジャンルや日程を変更できます。</span></div>';return;}
    stack.innerHTML=arr.map((x,i)=>slideHtml(x,i)).join('');
    try{fevs=arr;idx=0;updPos();}catch(e){$$('.slide').forEach((s,i)=>s.className='slide '+(i?'dn':'cur'));}
  }
  function slideHtml(x,i){
    const org=D.organizerById(x.organizer_id), cs=colors(x), liked=actionState(x.id,'like'), wanted=actionState(x.id,'want');
    return `<div class="slide ${i?'dn':'cur'}" data-i="${i}"><div class="core-feed-card"><div class="core-media core-${x.category}" style="--c1:${cs[0]};--c2:${cs[1]};"><div class="core-reel"><div class="core-reel-label">${mediaLabel(x)} / 15-30 sec</div><div class="core-reel-icon">${emoji(x)}</div><div class="core-reel-title">${esc(x.catchcopy)}</div></div></div><div class="srt core-actions"><button class="sact ${liked?'lk':''}" onclick="NexcaCore.toggleLike('${x.id}')"><div class="sact-c">${liked?'❤️':'♡'}</div><div class="sact-l">いいね</div><div class="core-action-count">${x.like_count||0}</div></button><button class="sact ${wanted?'wnt':''}" onclick="NexcaCore.toggleWant('${x.id}')"><div class="sact-c">${wanted?'★':'☆'}</div><div class="sact-l">行きたい</div><div class="core-action-count">${x.want_count||0}</div></button><button class="sact" onclick="NexcaCore.share('${x.id}')"><div class="sact-c">↗</div><div class="sact-l">シェア</div></button><button class="sact" onclick="NexcaCore.openOrganizer('${x.organizer_id}')"><div class="sact-c">店</div><div class="sact-l">主催者</div></button></div><div class="core-feed-bottom"><div class="sgtag">${esc(x.category)}</div><div class="stitle">${esc(x.title)}</div><div class="core-line">${esc(dateText(x))}</div><div class="core-line">${esc(x.address||x.area)} / 料金 ${esc(x.price_text||'予約時に確認')}</div><div class="core-catch">${esc(x.catchcopy)}</div><p class="core-short">${esc(x.short_description||x.description)}</p><div class="core-tags">${(x.tags||[]).slice(0,3).map(t=>`<span class="core-tag">${esc(t)}</span>`).join('')}</div><button class="sdbtn" onclick="NexcaCore.openDetail('${x.id}')">詳細情報</button><button class="core-host-link" onclick="NexcaCore.openOrganizer('${x.organizer_id}')">${esc(org?.name||'主催者')}</button></div></div></div>`;
  }
  function renderFlyer(){
    const grid=$('#flgrid'), screen=$('#flyer'); if(!grid)return;
    const sc=$('#flscr')||screen;
    if(sc&&!$('#core-list-tools'))sc.insertAdjacentHTML('afterbegin',`<div id="core-list-tools" class="core-list-tools"><div class="core-list-head"><div><b>まとめ見</b><span>動画・サムネ・チラシを比較できます</span></div><button onclick="NexcaCore.openCondition()">条件 ▼</button></div><div class="core-mode"><button class="${state.listMode==='thumb'?'on':''}" onclick="NexcaCore.setListMode('thumb')">サムネイル</button><button class="${state.listMode==='flyer'?'on':''}" onclick="NexcaCore.setListMode('flyer')">チラシ</button></div><input class="core-search" placeholder="タイトル・エリア・タグで検索" oninput="NexcaCore.search(this.value)"><div class="core-near"><b>近くのNexca</b><span>${state.coords?'現在地から近い順で表示できます。':'位置情報を許可すると、現在地から近い順で見られます。'}</span><button onclick="NexcaCore.useLocation()">現在地を使う</button></div></div>`);
    $('#core-list-tools .core-mode').innerHTML=`<button class="${state.listMode==='thumb'?'on':''}" onclick="NexcaCore.setListMode('thumb')">サムネイル</button><button class="${state.listMode==='flyer'?'on':''}" onclick="NexcaCore.setListMode('flyer')">チラシ</button>`;
    const base=visibleListings().filter(x=>x.show_in_flyer_view);
    const arr=state.listMode==='flyer'?base.filter(x=>x.media_type==='flyer'||x.flyer_image_url):base;
    grid.className='core-grid '+(state.listMode==='flyer'?'flyer-mode':'thumb-mode');
    grid.innerHTML=arr.map(cardHtml).join('')||'<div class="core-empty-card">掲載がありません。条件を変更してください。</div>';
  }
  function cardHtml(x){const cs=colors(x);return `<div class="core-card" onclick="NexcaCore.openDetail('${x.id}')"><div class="core-thumb" style="--c1:${cs[0]};--c2:${cs[1]};"><div class="core-badges"><span class="core-badge">${mediaLabel(x)}</span><span class="core-badge">${statusLabel(x)}</span></div><span>${emoji(x)}</span></div><div class="core-card-body"><h3>${esc(x.title)}</h3><p>${esc(x.catchcopy)}</p><div class="core-meta"><span>${esc(x.category)}</span><span>${esc(x.area)}</span><span>料金 ${esc(x.price_text)}</span></div></div></div>`;}
  function statusLabel(x){if(x.event_date_type==='evergreen')return '通年';if(x.end_date){const left=Math.ceil((new Date(x.end_date+'T23:59:59+09:00')-today)/86400000);if(left>=0&&left<=7)return '終了間近';}return '開催中';}
  function info(l,v){return `<div class="core-info"><small>${esc(l)}</small><b>${esc(v||'未設定')}</b></div>`;}
  function openDetail(id){
    const x=D.listingById(id); if(!x)return; const org=D.organizerById(x.organizer_id), map='https://maps.google.com/?q='+encodeURIComponent(x.address||x.area), cs=colors(x);
    D.recordClick(id,'detail_open');
    $('#drwbody').innerHTML=`<button class="bkbtn" onclick="closeDrw()">← 戻る</button><div class="core-detail-media" style="--c1:${cs[0]};--c2:${cs[1]};"><div class="core-reel-icon">${emoji(x)}</div><span>${mediaLabel(x)}</span></div><div class="drw-t">${esc(x.title)}</div><div class="core-catch">${esc(x.catchcopy)}</div><div class="core-tags">${(x.tags||[]).slice(0,3).map(t=>`<span class="core-tag">${esc(t)}</span>`).join('')}</div><div class="core-info-grid">${info('日程/営業時間',dateText(x))}${info('住所/エリア',x.address||x.area)}${info('料金',x.price_text)}${info('対象年齢',(x.target_age_groups||[]).join('・'))}${info('予約/申込状況',x.accepts_nexca_interest?'参加希望受付中':'外部リンクで確認')}</div><div class="core-section-title">本文</div><p class="desc-txt">${esc(x.short_description||'')}</p><p class="desc-txt">${esc(x.description||'')}</p><div class="core-section-title">詳細情報</div><p class="desc-txt">${esc(x.detail_info||'')}</p><div class="core-section-title">ユニークな情報</div><p class="desc-txt">${esc(x.unique_info||'')}</p><div class="core-section-title">注意事項</div><p class="desc-txt">${esc(x.notes||'参加後、マイページで参加コードを入力するとポイントがもらえます')}</p><div class="core-links"><a class="core-link-btn" href="${x.instagram_url||'#'}" target="_blank" onclick="NexcaCore.track('${x.id}','instagram')">Instagram</a><a class="core-link-btn" href="${x.website_url||'#'}" target="_blank" onclick="NexcaCore.track('${x.id}','website')">ホームページ</a><a class="core-link-btn" href="${map}" target="_blank" onclick="NexcaCore.track('${x.id}','map')">地図</a><button class="core-link-btn" onclick="NexcaCore.openOrganizer('${x.organizer_id}')">主催者ページ</button>${x.reservation_url?`<a class="core-link-btn primary" href="${x.reservation_url}" target="_blank" onclick="NexcaCore.track('${x.id}','reservation')">外部予約/申込</a>`:''}<button class="core-link-btn" onclick="NexcaCore.interest('${x.id}')">Nexcaで参加希望</button></div><div class="core-note">参加後、マイページで参加コードを入力するとポイントがもらえます</div><button class="cta cta-y" onclick="NexcaCore.share('${x.id}')">共有する</button><div class="core-section-title">参加者の声</div>${reviewsHtml(x.id)}`;
    openDrawer();
  }
  function reviewsHtml(id){
    const rs=D.load().reviews.filter(r=>r.listing_id===id&&r.moderation_status!=='rejected');
    return rs.length?rs.map(r=>`<div class="core-review"><b>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)} ${esc(r.display_name||'匿名')}</b><p>${esc(r.comment)}</p></div>`).join(''):'<div class="core-review"><p>まだ参加者の声はありません。</p></div>';
  }
  function openOrganizer(id){
    const data=D.load(), o=data.organizers.find(x=>x.id===id); if(!o)return;
    const posts=data.listings.filter(x=>x.organizer_id===id), active=posts.filter(x=>D.publicListings().some(p=>p.id===x.id)), past=posts.filter(x=>!active.some(a=>a.id===x.id));
    const likes=data.likes.filter(x=>posts.some(p=>p.id===x.listing_id)).length, wants=data.wanted_listings.filter(x=>posts.some(p=>p.id===x.listing_id)).length, clicks=data.link_clicks.filter(x=>posts.some(p=>p.id===x.listing_id)).length;
    const cover=o.cover||['#24283b','#4d9fff'];
    $('#drwbody').innerHTML=`<button class="bkbtn" onclick="closeDrw()">← 戻る</button><div class="core-org-head" style="--c1:${cover[0]};--c2:${cover[1]};"><div class="core-org-icon">${o.icon||'店'}</div></div><div class="drw-t">${esc(o.name)}</div><div class="core-org-labels"><span class="core-badge">Nexca確認済み</span>${o.is_initial_partner?'<span class="core-badge">初期掲載パートナー</span>':''}<span class="core-badge">参加コード対応</span></div><p class="desc-txt">${esc(o.description||'')}</p><div class="core-info-grid">${info('ジャンル',(o.genres||[]).join('・'))}${info('活動地域',o.area)}${info('いいね合計',likes)}${info('行きたい合計',wants)}${info('リンククリック合計',clicks)}${info('電話番号',o.show_phone?o.phone_number:'非表示')}</div><div class="core-section-title">ユニークな情報</div><p class="desc-txt">${esc(o.unique_info||'Nexca掲載情報を通して、初めての人にも魅力が伝わるように整理しています。')}</p><div class="core-links"><a class="core-link-btn" href="${o.instagram_url||'#'}" target="_blank">Instagram</a><a class="core-link-btn" href="${o.website_url||'#'}" target="_blank">ホームページ</a>${o.show_phone?`<a class="core-link-btn" href="tel:${o.phone_number}">電話</a>`:''}</div><div class="core-section-title">掲載中の投稿</div><div class="core-grid">${active.map(cardHtml).join('')||'<div class="core-review"><p>掲載中の投稿はありません。</p></div>'}</div><div class="core-section-title">過去の投稿</div>${past.length?`<div class="core-grid">${past.map(cardHtml).join('')}</div>`:'<div class="core-review"><p>過去投稿はまだありません。</p></div>'}<div class="core-section-title">口コミ/参加者の声</div>${posts.map(p=>reviewsHtml(p.id)).join('')}`;
    openDrawer();
  }
  function openDrawer(){$('#drw').classList.add('on');$('#drwbg').classList.add('on');}
  function toggleLike(id){const on=D.upsertLike(id);toast(on?'いいねしました':'いいねを解除しました');try{if(on)addPt('いいね',2,false);}catch(e){}renderAll();}
  function toggleWant(id){const on=D.upsertWanted(id);toast(on?'行きたいに追加しました':'行きたいを解除しました');try{if(on)addPt('行きたい',3,false);}catch(e){}renderAll();}
  function share(id){const x=D.listingById(id);if(!x)return;const url=location.href.split('#')[0]+'#/listing/'+id;D.recordShare(id);const text='【'+x.title+'】\n'+x.catchcopy+'\n'+url;if(navigator.share)navigator.share({title:x.title,text,url});else{navigator.clipboard&&navigator.clipboard.writeText(text);toast('URLをコピーしました');}renderAll();}
  function track(id,type){D.recordClick(id,type);}
  function interest(id){D.recordClick(id,'nexca_interest');toast('参加希望を記録しました');}
  function openCondition(){
    const g=['all'].concat(D.categories), dates=[['all','すべて'],['today','今日'],['tomorrow','明日'],['week','今週'],['weekend','週末'],['month','今月']], sorts=[['recommend','おすすめ'],['near','現在地から近い順'],['new','新着'],['date','開催日が近い順']];
    $('#drwbody').innerHTML=`<button class="bkbtn" onclick="closeDrw()">← 戻る</button><div class="drw-t">条件</div><div class="core-form"><label>ジャンル</label><select onchange="NexcaCore.setCond('genre',this.value)">${g.map(x=>`<option value="${x}" ${state.genre===x?'selected':''}>${x==='all'?'すべて':x}</option>`).join('')}</select><label>日程</label><select onchange="NexcaCore.setCond('date',this.value)">${dates.map(x=>`<option value="${x[0]}" ${state.date===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select><label>並び替え</label><select onchange="NexcaCore.setCond('sort',this.value)">${sorts.map(x=>`<option value="${x[0]}" ${state.sort===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select><label>位置情報設定</label><div class="core-profile-actions"><button onclick="NexcaCore.useLocation()">現在地を使う</button><button onclick="NexcaCore.setCond('areaMode','profile')">登録地域を使う</button></div></div>`;
    openDrawer();
  }
  function setCond(k,v){state[k]=v;renderAll();}
  function setListMode(v){state.listMode=v;renderFlyer();}
  function search(v){state.query=v.trim();renderFlyer();}
  function useLocation(){state.areaMode='near';state.sort='near';if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>{state.coords={lat:p.coords.latitude,lng:p.coords.longitude};toast('現在地から近い順にします');renderAll();},()=>{state.areaMode='profile';toast('位置情報なし: 登録地域を使います');renderAll();});}else{toast('位置情報に対応していません');}}
  function submitCoreCode(){const r=D.redeemCode($('#core-code-input')?.value);toast(r.message);if(r.ok){try{addPt('参加コード入力',80,false,'core_code_'+r.code.code);}catch(e){}renderMP();renderAll();}}
  function submitReview(id){const comment=($('#core-review-comment')?.value||'').trim();if(!comment){toast('コメントを入力してください');return;}D.addReview(id,$('#core-review-rating')?.value||5,comment,$('#core-review-anon')?.checked);toast('参加者の声を投稿しました。運営確認後に表示されます');renderMP();}
  function renderMP(){
    const p=profile(), data=D.load(), u=D.actor().user_id;
    $('#mpname')&&( $('#mpname').textContent=p.nickname );
    $('#mpemail')&&( $('#mpemail').textContent=p.area+' / '+p.age );
    $('#mpage')&&( $('#mpage').textContent='🎒 '+p.age+' · '+p.area );
    $('#mpav')&&( $('#mpav').innerHTML='👤' );
    $('#gsec')&&( $('#gsec').style.display='none' ); $('#lsec')&&( $('#lsec').style.display='block' );
    const l=data.likes.filter(x=>x.user_id===u).map(x=>D.listingById(x.listing_id)).filter(Boolean);
    const w=data.wanted_listings.filter(x=>x.user_id===u).map(x=>D.listingById(x.listing_id)).filter(Boolean);
    const reds=data.participation_code_redemptions.filter(x=>x.user_id===u);
    const top=$('#lsec'); if(!top)return;
    if(!$('#core-profile-card'))top.insertAdjacentHTML('afterbegin',`<div id="core-profile-card" class="core-profile-card"></div>`);
    $('#core-profile-card').innerHTML=`<h3>${esc(p.nickname)}</h3><p>${esc(p.age)} / ${esc(p.area)}<br>いいね ${l.length}件・行きたい ${w.length}件・参加コード ${reds.length}件・ポイント ${Math.floor(typeof pts==='number'?pts:0)}pt</p><div class="core-profile-actions"><button onclick="NexcaCore.editProfile()">プロフィール編集</button><button onclick="openTown()">Nexca Town</button></div>`;
    $('#lgrid')&&( $('#lgrid').innerHTML=l.length?l.map(cardHtml).join(''):'<div class="empty" style="grid-column:1/-1;"><div class="empty-ic">♡</div><div class="empty-t">いいねした掲載はまだありません</div></div>' );
    $('#wgrid')&&( $('#wgrid').innerHTML=w.length?w.map(cardHtml).join(''):'<div class="empty" style="grid-column:1/-1;"><div class="empty-ic">☆</div><div class="empty-t">行きたい掲載はまだありません</div></div>' );
    if(!$('#core-participation-box'))$('#core-profile-card').insertAdjacentHTML('afterend',`<div id="core-participation-box" class="core-profile-card"></div>`);
    const reviewTargets=reds.map(r=>D.listingById(r.listing_id)).filter(Boolean);
    $('#core-participation-box').innerHTML=`<h3>参加コード入力</h3><p>同じコードは1回だけ使用できます。入力後、その掲載に参加済みとして記録され、参加者の声を投稿できます。</p><div class="core-form"><input id="core-code-input" placeholder="例：VINTAGE50" oninput="this.value=this.value.toUpperCase()"><button class="cta cta-y" onclick="NexcaCore.submitCoreCode()">参加コードを送信</button></div><div class="core-section-title">参加コード履歴</div>${reds.length?reds.map(r=>{const x=D.listingById(r.listing_id);return `<div class="core-review"><b>${esc(x?.title||r.code)}</b><p>${esc(r.redeemed_at.slice(0,10))}</p></div>`}).join(''):'<div class="core-review"><p>参加コード履歴はまだありません。</p></div>'}${reviewTargets.length?`<div class="core-section-title">参加者の声を投稿</div><div class="core-form"><select id="core-review-listing">${reviewTargets.map(x=>`<option value="${x.id}">${esc(x.title)}</option>`).join('')}</select><select id="core-review-rating"><option value="5">満足度 5</option><option value="4">満足度 4</option><option value="3">満足度 3</option><option value="2">満足度 2</option><option value="1">満足度 1</option></select><textarea id="core-review-comment" placeholder="行ってみた感想"></textarea><label style="font-size:12px;color:var(--txt2);"><input type="checkbox" id="core-review-anon"> 匿名で表示</label><button class="cta cta-a" onclick="NexcaCore.submitReview(document.getElementById('core-review-listing').value)">投稿する</button></div>`:''}`;
  }
  function renderAll(){setupShell();renderFeed();renderFlyer();if($('#mypage')?.classList.contains('on'))renderMP();}
  function boot(){maybeSetup();renderAll();}
  window.NexcaCore={boot,saveProfile,editProfile,openCondition,setCond,useLocation,setListMode,search,openDetail,openOrganizer,toggleLike,toggleWant,share,track,interest,submitCoreCode,submitReview};
  window.renderFeed=renderFeed; window.renderFlyer=renderFlyer; window.renderFlyerTabs=function(){}; window.openDrw=openDetail; window.openVOV=openDetail; window.toggleLike=toggleLike; window.shareEv=share; window.renderMP=renderMP; window.openPartM=function(){goTab('mypage',$$('#nav .nb')[4]);setTimeout(()=>$('#core-code-input')?.focus(),120);};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,450));
})();
