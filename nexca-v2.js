(function(){
  'use strict';
  const AREAS=['広島市中区','広島市西区','広島市東区','広島市南区','広島市安佐南区','広島市安佐北区','広島市安芸区','広島市佐伯区','呉市','福山市','尾道市','三原市','東広島市','廿日市市','竹原市','府中市','庄原市','三次市','江田島市','神石高原','世羅','大崎上島','島しょ部'];
  const AGES=['中学生','高校生','大学生','社会人'];
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const css=document.createElement('style');
  css.textContent=`
  .ob-start-btn,.ob-vp,.ob-lbl,.ob-tagline,.ob-logo{animation:none!important;opacity:1!important;pointer-events:auto!important}.ob-start-btn{pointer-events:all!important;touch-action:manipulation}
  .profile-pref-card{margin:0 14px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:13px}.pref-row{display:flex;gap:8px;margin-top:10px}.pref-row select{flex:1;padding:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:var(--txt);font-weight:700}.pref-save{padding:10px 13px;background:var(--red);border:0;border-radius:10px;color:white;font-weight:900}
  .nx-video-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#050507}.nx-thumb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 35%,rgba(255,255,255,.13),transparent 48%),linear-gradient(135deg,#111827,#050507)}.nx-play{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);font-size:28px;backdrop-filter:blur(10px)}
  .gg-card{position:relative;overflow:hidden}.gg-card::before{content:"";position:absolute;inset:-80px;background:radial-gradient(circle at 20% 10%,rgba(255,190,0,.18),transparent 32%),radial-gradient(circle at 84% 4%,rgba(77,159,255,.18),transparent 30%);pointer-events:none}.gg-panel{display:flex;flex-direction:column;gap:12px;position:relative}.gg-field{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:11px}.gg-label{font-size:10px;font-weight:900;color:var(--dim);letter-spacing:1px;margin-bottom:8px}.gg-chips{display:flex;gap:7px;flex-wrap:wrap}.gg-chip{min-height:38px;padding:9px 11px;border-radius:999px;background:rgba(255,255,255,.065);border:1.5px solid rgba(255,255,255,.1);font-size:11px;font-weight:900;color:var(--txt);cursor:pointer;touch-action:manipulation}.gg-chip.on{background:rgba(255,190,0,.18);border-color:var(--yellow);box-shadow:0 0 20px rgba(255,190,0,.2);color:white}.gg-btn.destiny{position:relative;width:100%;min-height:52px;padding:15px;background:linear-gradient(135deg,#E63946,#ffbe00);box-shadow:0 0 24px rgba(230,57,70,.35);font-size:15px;border-radius:14px;touch-action:manipulation}.gg-spin{padding:18px;text-align:center;font-family:var(--font-en);font-size:20px;letter-spacing:2px;color:var(--yellow);animation:pulse .35s infinite alternate}.gg-result-card{border-radius:18px;padding:16px;background:linear-gradient(160deg,rgba(255,255,255,.12),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 34px rgba(0,0,0,.28)}.gg-rarity{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:900;margin-bottom:8px}.gg-rarity.normal{background:rgba(255,255,255,.08);color:var(--txt2)}.gg-rarity.rare{background:rgba(77,159,255,.16);color:var(--blue)}.gg-rarity.legendary{background:rgba(255,190,0,.2);color:var(--yellow);box-shadow:0 0 22px rgba(255,190,0,.2)}.gg-actions{display:flex;gap:8px;margin-top:12px}.gg-actions button,.gg-actions a{flex:1;text-align:center;text-decoration:none;padding:12px 8px;border-radius:11px;border:0;font-size:12px;font-weight:900;color:white;background:rgba(255,255,255,.09);font-family:var(--font-jp);touch-action:manipulation}
  .rank-tabs{display:flex;gap:6px;overflow-x:auto;margin-bottom:10px}.rank-tab{border:0;border-radius:999px;padding:7px 11px;background:rgba(255,255,255,.06);color:var(--dim);font-size:11px;font-weight:900}.rank-tab.on{background:var(--red);color:white}.my-rank{margin-bottom:10px;padding:11px;border-radius:12px;background:rgba(255,190,0,.08);border:1px solid rgba(255,190,0,.18);font-size:12px;font-weight:900;color:var(--yellow)}
  .gacha-legendary-burst{animation:nxBurst 1.4s ease both}@keyframes nxBurst{35%{box-shadow:0 0 0 999px rgba(255,190,0,.16)}}@media (max-width:520px){html,body{overscroll-behavior:none}button,.gg-chip,.nb,.sact,.cta{touch-action:manipulation;-webkit-tap-highlight-color:transparent}.screen{width:100vw;max-width:100vw}.gg-card{margin:0 10px 14px!important;padding:14px!important;border-radius:16px!important}.gg-panel{gap:10px}.gg-field{padding:10px}.gg-chips{flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.gg-chips::-webkit-scrollbar{display:none}.gg-chip{flex:0 0 auto;min-height:42px;font-size:12px;padding:10px 13px}.gg-actions{flex-direction:column}.drw-t,.stitle{overflow-wrap:anywhere}.sbot{left:12px;right:76px;bottom:18px}.srt{right:8px;bottom:92px}.sact{width:50px;height:50px}.town-hd{padding-top:max(38px,env(safe-area-inset-top))!important}.town-body{padding:10px!important}.town-map{height:calc(100svh - 286px)!important;min-height:360px!important;margin-bottom:12px!important}.town-area-tabs,.town-scroll{padding-bottom:5px}.nx-town-chat{max-width:130px;overflow:hidden;text-overflow:ellipsis}.nx-town-building{font-size:22px;min-width:42px;padding:7px 8px}.nx-town-pin{max-width:118px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nx-pg-title{font-size:22px!important}.nx-pg-sub{font-size:12px!important}}@media (orientation:landscape){#nav{height:50px}.screen{bottom:50px}.sbot{bottom:8px}.srt{bottom:62px}.stitle{font-size:17px}.ob-logo{font-size:40px}.town-map{height:360px!important}}`;
  document.head.appendChild(css);

  function publicId(id){return String(id||'').replace(/^db_/,'');}
  function moneyCap(s){if(!s||s==='制限なし')return 999999;if(s==='無料')return 0;return Number(String(s).replace(/\D/g,''))||999999;}
  function videoHtml(ev){
    const u=String(ev.video_url||ev.vid||'');
    if(!u)return `<div class="nx-thumb"><div class="nx-play">${safe(ev.em||'▶')}</div></div>`;
    let src=''; const yt=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,})/);
    if(yt)src=`https://www.youtube.com/embed/${yt[1]}?playsinline=1&mute=1&rel=0`;
    else if(/instagram\.com\//.test(u)){const id=(u.split('/p/')[1]||u.split('/reel/')[1]||'').split('/')[0]; if(id)src=`https://www.instagram.com/p/${id}/embed`;}
    else if(/tiktok\.com\//.test(u))src=u.replace('/video/','/embed/v2/');
    return src?`<iframe class="nx-video-frame" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen src="${safe(src)}"></iframe>`:`<div class="nx-thumb"><div class="nx-play">▶</div></div>`;
  }
  function extendData(){
    if(typeof GS!=='undefined'){GS.cafe={bg:'rgba(76,175,80,.13)',bd:'rgba(76,175,80,.35)',c:'#8ee6a0'};GS.vintage={bg:'rgba(255,190,0,.13)',bd:'rgba(255,190,0,.35)',c:'#ffcf4d'};}
    if(typeof OC!=='undefined'&&!OC.ネクスケ)OC.ネクスケ={color:'#E63946',genre:'event',kuchi:'次、行ってみよ。',pers:'Nexcaそのものの好奇心を持つ案内役。',weak:'予定を詰め込みすぎる。',compat:'フワリ',cd:'勢いと観察眼の相性がいい。',catch:'まだ知らない広島を、今日の予定に変える。',mbti:{E:70,N:88,F:60,P:90},strengths:['発見力','案内力','巻き込み力'],growth:'休む時間も予定に入れて。',lvUp:[]};
    if(typeof MISSIONS!=='undefined'&&Array.isArray(MISSIONS)&&MISSIONS.length<15){
      [['m6','カフェを1件保存する','カフェジャンルで行きたい登録',10],['m7','古着スポットを探す','古着ジャンルを閲覧',10],['m8','友達に1件シェアする','イベントをSNS共有',10],['m9','地図リンクを開く','詳細から地図を確認',8],['m10','今週のイベントを見る','日付で絞り込む',8],['m11','グループガチャを回す','条件を選んで運命を回す',15],['m12','マイ広島に建物を置く','街を育てる',15],['m13','キャラEXPを増やす','参加証明または街で交流',20],['m14','ランキングを見る','順位を確認',5],['m15','検索履歴を作る','検索を使う',5]].forEach(x=>MISSIONS.push({id:x[0],name:x[1],sub:x[2],pt:x[3],progress:0,goal:1,done:false}));
    }
    if(typeof GACHA!=='undefined'){
      GACHA.Common=(GACHA.Common||[]).concat(['家の近くで空を30秒見る','今日の予定に小さな寄り道を1つ足す','最近よかった店をメモする'].map(text=>({text,ev:'小さな行動変化は習慣化しやすい',type:'家',pts:15})));
      GACHA.Uncommon=(GACHA.Uncommon||[]).concat(['気になるイベントを1つ友達に送る','知らない通りを1本だけ歩く','カフェでおすすめを聞く'].map(text=>({text,ev:'新奇探索は気分転換を助ける',type:'外',pts:25})));
      GACHA.Rare=(GACHA.Rare||[]).concat(['本通り周辺で初めての店に入る','川沿いで10分だけスマホをしまう'].map(text=>({text,ev:'環境への注意はマインドフルネス効果を持つ',type:'外',pts:40})));
      GACHA.Epic=(GACHA.Epic||[]).concat([{text:'古着屋を3軒はしごしてテーマを決める',ev:'共同計画は達成感を高める',type:'外',pts:60}]);
      GACHA.Legendary=(GACHA.Legendary||[]).concat([{text:'朝から夜まで広島を1本の物語として歩く',ev:'長時間の新奇体験は自己効力感を刺激する',type:'外',pts:120}]);
    }
  }
  const seeds=['本通りの裏路地をあてもなく歩く','袋町公園でコンビニ飯を食べながら話す','喫茶店に入って長居する','路面電車に乗ってどこかで降りる','元安川沿いをゆっくり歩く','川沿いのベンチに座って何もしない','知らない喫茶店で本を読む','比治山から夕暮れの広島を見下ろす','宇品港で海を眺めながら昔話をする','原爆ドームが見える川沿いで語る','フェリーのデッキで海風を浴びる','平和公園の誰もいない早朝を歩く','太田川を北に向かって歩く','路面電車で終点まで行ってUターン','本通りの古着屋を3軒はしご','広島城の周りをランニング','宮島で大鳥居まで歩く','大和ミュージアムを見学して海沿いを歩く','じゃんけんで次の角を曲がる方向を決めて歩く','コンビニで一番変なものを買って食べる','路面電車の中で広島弁だけで話す','宇品港の工場夜景を2人で見る','元安川沿いをスマホをしまって歩く','夜の平和公園で並んで座る','干潮の砂浜を大鳥居まで2人で歩く','千光寺公園から夜景を見る','尾道の細い路地を2人で迷子になる','次のバスに乗って終点まで行く','地図を見ずに勘だけで1時間歩く','一度も降りたことのない駅で降りる','始発電車に乗って海を見に行く'];
  const moods=['まったり','エモい','アクティブ','ボケ','ロマンチック','非日常','おまかせ'];
  const plans=[]; AREAS.forEach(area=>moods.forEach(mood=>seeds.forEach((seed,i)=>{if(plans.length<340)plans.push({title:`${area}で${seed}`,desc:`${mood}気分に合わせて、${area}周辺で無理なくできる体験。危険な場所・私有地・廃墟は使わない。`,area,mood,time:['朝','午前','昼','午後','夕方','夜'][i%6],budget:[0,300,500,1000,2000,3000,5000,10000][i%8],indoor:i%3===0,outdoor:i%3!==0,map:`https://maps.google.com/?q=${encodeURIComponent(area)}`});})));
  const dayPlans=Array.from({length:24},(_,i)=>({title:`${AREAS[i%AREAS.length]} 1日ネクスカ旅 ${i+1}`,desc:'午前：川沿いか商店街を歩く → 昼：地元の店でごはん → 午後：イベントか古着/カフェを巡る → 夜：明るい駅周辺で締める。',area:AREAS[i%AREAS.length],mood:moods[i%moods.length],time:'1日',budget:[2000,3000,5000,10000][i%4],indoor:i%2===0,outdoor:true,map:`https://maps.google.com/?q=${encodeURIComponent(AREAS[i%AREAS.length])}`}));

  function hydrateGroupGacha(){
    const old=$('#group-gacha-card')||$('.gg-card'); if(!old)return;
    old.id='group-gacha-card';
    old.innerHTML='<div style="position:relative;font-family:var(--font-en);font-size:16px;letter-spacing:1px;margin-bottom:4px;">GROUP GACHA</div><div style="position:relative;font-size:11px;color:var(--dim);line-height:1.6;margin-bottom:14px;">人数・気分・場所を混ぜて、今日の行き先を1本の物語として召喚する</div><div id="gg-v2-panel" class="gg-panel"></div><button class="gg-btn destiny" onclick="drawGroupGacha()">運命を回す</button><div class="gg-result" id="gg-result"></div>';
    const field=(key,label,items,multi,max=99)=>`<div class="gg-field"><div class="gg-label">${label}</div><div class="gg-chips" data-key="${key}" data-multi="${multi?1:0}" data-max="${max}">${items.map((x,i)=>`<button class="gg-chip ${!multi&&i===0?'on':''}" data-val="${x}" onclick="selChip(this)">${x}</button>`).join('')}</div></div>`;
    $('#gg-v2-panel').innerHTML=field('count','人数',['1人','2人','3人','4人','5人以上'],false)+field('scene','シチュエーション',['友達','デート','家族','旅行','1人時間'],false)+field('time','時間帯',['朝','午前','昼','午後','夕方','夜','深夜'],true)+field('area','エリア',AREAS,true)+field('budget','予算',['無料','〜300円','〜500円','〜1000円','〜2000円','〜3000円','〜5000円','〜10000円','制限なし'],false)+field('mood','ムード',moods,true,3)+'<div class="gg-field"><div class="gg-label">天気</div><div style="font-size:11px;color:var(--dim);">現在地の天気で屋内/屋外を自動調整。取得できない場合は安全側で選出します。</div></div>';
  }
  window.selChip=function(btn){const wrap=btn.parentElement,multi=wrap.dataset.multi==='1',max=Number(wrap.dataset.max||99);if(multi){if(!btn.classList.contains('on')&&wrap.querySelectorAll('.gg-chip.on').length>=max){toast('最大'+max+'つまで選べます');return;}btn.classList.toggle('on');}else{wrap.querySelectorAll('.gg-chip').forEach(b=>b.classList.remove('on'));btn.classList.add('on');}};
  function vals(k){const w=$(`.gg-chips[data-key="${k}"]`);return w?$$(`.gg-chips[data-key="${k}"] .gg-chip.on`).map(b=>b.dataset.val):[];}
  function buildGroupPlan(){
    let times=vals('time'); if(!times.length)times=['昼','午後','夕方'];
    const count=vals('count')[0]||'1人', scene=vals('scene')[0]||'友達', areas=vals('area').length?vals('area'):['広島市中区'], budget=vals('budget')[0]||'制限なし', moodVals=vals('mood').length?vals('mood'):['おまかせ'];
    if(['中学生','高校生'].includes(age)&&times.includes('深夜')){times=times.filter(t=>t!=='深夜');toast('中高生向けに深夜プランを外しました');}
    const r=Math.random()*100, rarity=r<7?'legendary':r<34?'rare':'normal', pool=rarity==='legendary'?dayPlans:plans;
    const cap=moneyCap(budget);
    let cand=pool.filter(p=>areas.some(a=>p.area.includes(a)||a.includes(p.area))&&moodVals.some(m=>m==='おまかせ'||p.mood===m)&&times.some(t=>p.time===t||p.time==='1日')&&p.budget<=cap);
    if(count==='1人'&&times.includes('深夜'))cand=cand.filter(p=>p.indoor);
    const evHit=(typeof EVS!=='undefined'?EVS:[]).find(ev=>!ev.isOfficial&&areas.some(a=>String(ev.loc||'').includes(a.replace('広島市',''))));
    const p=evHit&&rarity!=='legendary'?{title:evHit.title,desc:'Nexca掲載イベントが条件に合ったので優先召喚。'+evHit.desc,area:evHit.loc,mood:moodVals[0],time:evHit.ts||times[0],budget:evHit.price,map:`https://maps.google.com/?q=${encodeURIComponent(evHit.addr||evHit.loc)}`,eventId:evHit.id}:(cand[Math.floor(Math.random()*cand.length)]||pool[Math.floor(Math.random()*pool.length)]);
    p.rarity=rarity;p.scene=scene;p.count=count;p.budgetLabel=budget;p.moodLabel=moodVals.join(' / ');p.route=rarity==='legendary'?['午前: 街歩き','昼: ごはん','午後: 体験','夜: 明るい駅周辺で締める']:['集合','メイン体験','寄り道'];
    return p;
  }
  function renderGroupResult(p){
    const el=$('#gg-result'); if(!el)return;
    window.lastGroupPlan=p; el.style.display='block';
    el.innerHTML=`<div class="gg-result-card"><div class="gg-rarity ${p.rarity}">${p.rarity==='legendary'?'激レア 1日プラン':p.rarity==='rare'?'レアプラン':'ノーマルプラン'}</div><div style="font-size:18px;font-weight:1000;line-height:1.35;margin-bottom:7px;">${safe(p.title)}</div><div style="font-size:12px;color:var(--txt2);line-height:1.85;">${safe(p.desc)}</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:11px;">${p.route.map(x=>`<span style="font-size:10px;font-weight:900;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:5px 8px;">${safe(x)}</span>`).join('')}</div><div style="font-size:11px;color:var(--dim);margin-top:10px;">${safe(p.scene)} · ${safe(p.count)} · ${safe(p.budgetLabel)} · ${safe(p.area)}</div><div class="gg-actions"><a href="${p.map}" target="_blank">地図</a><button onclick="addPt('今日これをやる',20,false);toast('今日のプランに決定！ +20pt')">今日これをやる</button><button onclick="shareGroupPlan()">シェア</button></div></div>`;
    const m=(typeof MISSIONS!=='undefined'?MISSIONS:[]).find(x=>x.id==='m11'); if(m&&!m.done){m.done=true;m.progress=1;addPt('ミッション達成：'+m.name,m.pt,false);}
  }
  window.drawGroupGacha=function(){
    const p=buildGroupPlan(), color=p.rarity==='legendary'?'#ffbe00':p.rarity==='rare'?'#4d9fff':'#62d6a1';
    const ov=$('#nx-premium-gacha');
    if(!ov){renderGroupResult(p);return;}
    ov.style.setProperty('--pg',color);
    ov.querySelector('#nx-pg-phase').textContent='GROUP FATE LINK';
    ov.querySelector('#nx-pg-title').textContent='みんなの運命線を接続中';
    ov.querySelector('#nx-pg-sub').textContent='人数、気分、予算、時間帯を混ぜて、今日のルートを召喚しています。';
    ov.querySelectorAll('.nx-pg-particle').forEach(x=>x.remove());
    for(let i=0;i<56;i++){const s=document.createElement('i');s.className='nx-pg-particle';s.style.left=Math.random()*100+'%';s.style.bottom=(-12+Math.random()*32)+'%';s.style.animationDelay=(Math.random()*2)+'s';s.style.animationDuration=(1.4+Math.random()*1.8)+'s';ov.appendChild(s);}
    ov.classList.add('on'); if(navigator.vibrate)navigator.vibrate([80,40,80,40,180]);
    setTimeout(()=>{ov.querySelector('#nx-pg-phase').textContent='ROUTE SHUFFLE';ov.querySelector('#nx-pg-title').textContent='集合 → 体験 → 寄り道を構築中';ov.querySelector('#nx-pg-sub').textContent='中高生・深夜・天気・安全条件をチェックしています。';},1600);
    setTimeout(()=>{ov.querySelector('#nx-pg-phase').textContent=p.rarity==='legendary'?'LEGENDARY ROUTE':'PLAN DROP';ov.querySelector('#nx-pg-title').textContent=p.rarity==='legendary'?'1日プラン、降臨。':'今日の行き先が決まる。';ov.querySelector('#nx-pg-sub').textContent='結果を確定しています。';if(navigator.vibrate)navigator.vibrate([220,70,220]);},3600);
    setTimeout(()=>{ov.classList.remove('on');renderGroupResult(p);document.getElementById('gg-result')?.scrollIntoView({behavior:'smooth',block:'center'});},5400);
  };
  window.shareGroupPlan=function(){const p=window.lastGroupPlan;if(!p)return;const text=`Nexcaグループガチャ結果：${p.title}\n${p.desc}\n#Nexca広島`;navigator.share?navigator.share({title:'Nexcaグループガチャ',text,url:location.href}).catch(()=>{}):(navigator.clipboard&&navigator.clipboard.writeText(text),toast('コピーしました！'));};

  function overrideCore(){
    if(typeof EVS==='undefined')return;
    EVS.forEach(e=>{if(e.genre==='furugiya')e.genre=e.g='vintage'; if(e.gl==='ワークショップ'||e.g==='learn'||e.g==='volunteer'){e.g=e.genre='event';e.gl='イベント・体験';e.ge='🎉';} if(e.genre==='cafe'){e.g='cafe';e.gl='カフェ';e.ge='☕';} if(e.genre==='vintage'){e.g='vintage';e.gl='古着';e.ge='👗';}});
    window.mkSlide=function(ev,i){const s=document.createElement('div');s.className='slide dn';s.dataset.i=i;const gs=(typeof GS!=='undefined'&&(GS[ev.g]||GS.event))||{bg:'rgba(230,57,70,.12)',bd:'rgba(230,57,70,.35)',c:'#ff8fa0'}, lk=likes.has(ev.id), wnt=wants.has(ev.id), id=ev.id;s.innerHTML=`<div class="sbg" style="background:${safe(ev.bg)};">${videoHtml(ev)}</div><div class="sovl"></div><div class="srt"><button class="sact${lk?' lk':''}" id="lb-${id}" onclick="toggleLike('${id}')"><div class="sact-c">${lk?'❤️':'🤍'}</div><div class="sact-l" id="lc-${id}">${ev.like_count||0}</div></button><button class="sact${wnt?' wnt':''}" id="wb-${id}" onclick="toggleWant('${id}')"><div class="sact-c">${wnt?'⭐':'☆'}</div><div class="sact-l">行きたい</div></button><button class="sact" onclick="shareEv('${id}')"><div class="sact-c">📤</div><div class="sact-l">シェア</div></button></div><div class="sbot">${ev.charKey?`<div class="schar-badge"><span style="font-size:14px;">${safe(ev.charEmoji||'🎭')}</span><span style="font-size:10px;font-weight:700;">${safe(ev.charName||ev.charKey)}</span></div>`:''}<div class="sgtag" style="background:${gs.bg};border-color:${gs.bd};color:${gs.c};">${safe(ev.ge)} ${safe(ev.gl)}</div><div class="stitle">${safe(ev.title)}</div><div class="smeta"><span class="smeta-i">📅 ${safe(ev.ds||ev.ts||'随時')}</span><span class="smeta-i">📍 ${safe(ev.loc)}</span></div><button class="sdbtn" onclick="openDrw('${id}')">詳細情報・参加コード</button></div><div class="shint">↑ スワイプで次へ</div>`;return s;};
    window.renderGenreOpts=function(){const cfg=[['all','すべて','全ジャンル表示','📍'],['vintage','古着','ヴィンテージ・セレクト','👗'],['cafe','カフェ','喫茶・コーヒー・休憩','☕'],['event','イベント・体験','おでかけ・フェス・ワークショップ','🎉']];const el=$('#fm-gopts');if(el)el.innerHTML=cfg.map(c=>`<div class="fm-gopt${genre===c[0]?' on':''}" data-g="${c[0]}" onclick="pickGenre(this)"><div class="fm-gopt-ic">${c[3]}</div><div><div class="fm-gopt-n">${c[1]}</div><div class="fm-gopt-sub">${c[2]}</div></div><div class="fm-gopt-chk">✓</div></div>`).join('');};
    window.renderFlyerTabs=function(){const cfg=[['all','すべて','📍'],['vintage','古着','👗'],['cafe','カフェ','☕'],['event','イベント・体験','🎉']];const el=$('#ftabs-wrap');if(el)el.innerHTML=cfg.map(c=>`<div class="ftab${flyG===c[0]?' on':''}" data-g="${c[0]}" onclick="setFlyG(this)">${c[2]} ${c[1]}</div>`).join('');};
    window.pickGenre=function(el){$$('.fm-gopt').forEach(b=>b.classList.remove('on'));el.classList.add('on');genre=el.dataset.g;const lb={all:'すべて',vintage:'古着',cafe:'カフェ',event:'イベント・体験'};$('#fl').textContent=lb[genre]||'すべて';renderFeed();closeFM();};
    window.renderFeed=function(){let src=feedMode==='official'?EVS.filter(e=>e.isOfficial):EVS.filter(e=>!e.isOfficial&&(!e.age||!age||e.age.includes(age)));if(feedMode!=='official'&&genre&&genre!=='all')src=src.filter(e=>e.g===genre||e.genre===genre||(genre==='event'&&!['cafe','vintage'].includes(e.g)));if(feedMode==='recommend')src=src.slice().sort((a,b)=>getRecScore(b)-getRecScore(a));fevs=src;idx=0;const st=$('#stack');st.innerHTML='';if(!src.length){st.innerHTML='<div class="empty" style="position:absolute;inset:0;display:flex;"><div class="empty-ic">🔍</div><div class="empty-t">この条件のイベントはありません</div></div>';return;}src.forEach((ev,i)=>st.appendChild(mkSlide(ev,i)));updPos();};
    window.openDrw=function(id){const ev=EVS.find(e=>e.id===id);if(!ev)return;const gs=(typeof GS!=='undefined'&&(GS[ev.g]||GS.event))||{bg:'rgba(230,57,70,.12)',c:'#ff8fa0'}, map=`https://maps.google.com/?q=${encodeURIComponent(ev.addr||ev.loc)}`, cd=ev.charKey&&OC?OC[ev.charKey]:null, info=cd?calcCprog(charExp[ev.charKey]||0):null;const link=(cls,label,url,type)=>url?`<a class="cta ${cls}" href="${safe(url)}" target="_blank" onclick="trackLinkClick('${ev.id}','${type}')">${label}</a>`:'';$('#drwbody').innerHTML=`<button class="bkbtn" onclick="closeDrw()">← 動画フィードに戻る</button><div class="drw-t">${safe(ev.title)}</div><div class="drw-gt" style="background:${gs.bg};color:${gs.c};">${safe(ev.ge)} ${safe(ev.gl)}</div><div class="drw-tags">${(ev.tags||[]).map(t=>`<div class="drw-tag">${safe(t)}</div>`).join('')}</div>${cd?`<div class="cblk"><span style="font-size:34px;">${safe(ev.charEmoji||'🎭')}</span><div style="flex:1;"><div class="cblk-name" style="color:${cd.color};">${safe(ev.charName||ev.charKey)}</div><div class="cblk-desc">${safe(ev.charDesc||cd.catch)}</div><div class="clvbar"><div class="clvfill" style="width:${info.pct}%;background:${cd.color};"></div></div><div style="font-size:9px;color:var(--dim);margin-top:3px;">Lv${info.lv} · EXP ${info.cur}/${info.need}</div></div></div>`:''}<div class="ic"><div class="ic-l">DATE / TIME</div><div class="ic-v">${safe(ev.ds||'随時')} ${safe(ev.ts||'')}</div></div><div class="ic"><div class="ic-l">LOCATION</div><div class="ic-v">${safe(ev.loc)}<br>${safe(ev.addr||'')}</div><a href="${map}" target="_blank" onclick="trackLinkClick('${ev.id}','map')" class="gmapbtn">🗺️ Googleマップで開く</a></div><div class="ic"><div class="ic-l">FEE</div><div class="ic-v">${safe(ev.price||'無料')}</div></div><p class="desc-txt">${safe(ev.desc)}</p><div class="ctas"><button class="cta cta-y" onclick="openPartM('${ev.id}')">参加コードを入力する</button><a class="cta cta-m" href="${map}" target="_blank" onclick="trackLinkClick('${ev.id}','map')">🗺️ 地図</a>${link('cta-i','Instagram',ev.ig,'instagram')}${link('cta-h','公式サイト',ev.website_url||ev.hp,'website')}${link('cta-a','予約する',ev.booking_url||ev.rev,'booking')}<button class="cta cta-h" onclick="shareLine('${ev.id}')">LINEでシェア</button></div>`;$('#drw').classList.add('on');$('#drwbg').classList.add('on');};
  }
  window.trackLinkClick=async function(id,type){try{await sb.from('event_link_clicks').insert({event_id:publicId(id),link_type:type,click_type:type,user_id:(typeof user!=='undefined'&&user)?user.id:null,clicked_at:new Date().toISOString()});}catch(e){}};
  window.shareLine=function(id){const ev=EVS.find(e=>e.id===id);if(!ev)return;trackLinkClick(id,'line_share');window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(location.href.split('#')[0]+'#/event/'+id)}&text=${encodeURIComponent(ev.title+'｜Nexcaで見つけた広島の体験')}`,'_blank');};
  window.loadDBEvents=async function(){
    try{
      let r=await sb.from('events').select('*').eq('status','published').eq('is_active',true).order('created_at',{ascending:false}).limit(40);
      if(r.error&&String(r.error.message||'').includes('status'))r=await sb.from('events').select('*').eq('is_active',true).eq('show_in_feed',true).order('created_at',{ascending:false}).limit(40);
      if(r.error)throw r.error;
      if(r.data&&r.data.length>0){
        const dbEvs=r.data.map(e=>({
          id:'db_'+e.id,g:e.genre||'event',gl:e.genre_label||'イベント・体験',ge:e.genre_emoji||'🎉',
          title:e.title||'',ds:e.date_start||'',ts:e.time_info||e.time_range||'',loc:e.location||'',addr:e.address||e.location||'',price:e.price||'無料',
          desc:e.description||'',em:e.emoji||'🎉',bg:e.background||e.bg_gradient||'linear-gradient(135deg,#1a0a2e,#0a1428)',
          tags:Array.isArray(e.tags)?e.tags:[],age:Array.isArray(e.age_groups)?e.age_groups:['中学生','高校生','大学生','社会人'],
          fixed:!!e.is_fixed,isOfficial:!!e.is_official,wantCount:e.want_count||0,
          charKey:e.char_key||'',charEmoji:e.char_emoji||'',charName:e.char_name||'',charDesc:e.char_desc||'',
          qr:e.participation_code||'',genre:e.genre||'event',ig:e.instagram_url||'',website_url:e.website_url||e.homepage_url||'',booking_url:e.booking_url||e.reservation_url||'',video_url:e.video_url||''
        }));
        dbEvs.forEach(ev=>{if(!EVS.find(e=>e.id===ev.id))EVS.unshift(ev);});
        installCharSystem&&installCharSystem();renderFeed&&renderFeed();renderFlyer&&renderFlyer();renderTodayWidget&&renderTodayWidget();
      }
    }catch(e){console.warn('loadDBEvents error',e);}
  };
  const originalSearch=window.doSearch; window.doSearch=function(q){q=String(q||'').trim();if(q){const h=JSON.parse(localStorage.getItem('nx_search_history')||'[]').filter(x=>x!==q);h.unshift(q);localStorage.setItem('nx_search_history',JSON.stringify(h.slice(0,8)));} if(originalSearch)originalSearch(q);};
  async function hasGachaToday(){const d=new Date().toISOString().slice(0,10);if((typeof user!=='undefined'&&user)){try{const r=await sb.from('gacha_logs').select('id').eq('user_id',user.id).eq('date',d).maybeSingle();if(r.data)return true;}catch(e){}}return localStorage.getItem('nx_gacha_date')===d;}
  async function recordGachaToday(){const d=new Date().toISOString().slice(0,10);localStorage.setItem('nx_gacha_date',d);if((typeof user!=='undefined'&&user)){try{await sb.from('gacha_logs').insert({user_id:user.id,date:d,created_at:new Date().toISOString()});}catch(e){}}}
  window.openGacha=async function(){if(await hasGachaToday()){toast('本日のガチャは使用済みです');return;}const weights={Common:45,Uncommon:27,Rare:17,Epic:8,Legendary:3};let rand=Math.random()*100,rarity='Common',cum=0;for(const r of Object.keys(weights)){cum+=weights[r];if(rand<cum){rarity=r;break;}}const pool=GACHA[rarity]||GACHA.Common;window.gMission=pool[Math.floor(Math.random()*pool.length)];gMission.rarity=rarity;await recordGachaToday();if(rarity==='Legendary'){document.body.classList.add('gacha-legendary-burst');setTimeout(()=>document.body.classList.remove('gacha-legendary-burst'),1600);}const icons={Common:'🎴',Uncommon:'🌟',Rare:'💎',Epic:'🔮',Legendary:'🌈'}, cls={Common:'gr-c',Uncommon:'gr-u',Rare:'gr-r',Epic:'gr-e',Legendary:'gr-l'};$('#gr-icon').textContent=icons[rarity];$('#gr-rarity').className='gr-rarity '+cls[rarity];$('#gr-rarity').textContent=rarity;$('#gr-type').textContent=gMission.type==='家'?'🏠 家でできるミッション':'🌿 外でできるミッション';$('#gr-text').textContent=gMission.text;$('#gr-evidence').textContent='📚 '+gMission.ev;$('#gacha-ov').classList.add('on');};
  const oldAccept=window.acceptGacha; window.acceptGacha=function(){if(!window.gMission)return oldAccept&&oldAccept();const txt=`Nexcaガチャで「${gMission.text}」を引いた！ #Nexca広島`;addPt('ガチャミッション達成',gMission.pts,false);navigator.share&&navigator.share({title:'Nexcaガチャ結果',text:txt,url:location.href}).catch(()=>{});closeGacha();toast('ミッション受け取り！頑張ろう');};
  window.renderRank=async function(){const el=$('#rank-list');if(!el)return;el.innerHTML=`<div class="rank-tabs"><button class="rank-tab on" onclick="renderRankScope('week',this)">週間</button><button class="rank-tab" onclick="renderRankScope('month',this)">月間</button><button class="rank-tab" onclick="renderRankScope('all',this)">全期間</button><button class="rank-tab" onclick="renderRankScope('area',this)">エリア別</button></div><div id="rank-scope-list"></div>`;renderRankScope('week',el.querySelector('.rank-tab'));};
  window.renderRankScope=async function(scope,btn){$$('.rank-tab').forEach(b=>b.classList.remove('on'));btn&&btn.classList.add('on');const box=$('#rank-scope-list');box.innerHTML='<div style="text-align:center;padding:18px;color:var(--dim);">読み込み中...</div>';try{let q=sb.from('rankings').select('*').order('total_points',{ascending:false}).limit(50);if(scope==='area'&&city)q=q.eq('city',city);const r=await q,data=r.data||[];if(!data.length){box.innerHTML='<div class="empty"><div class="empty-ic">🏆</div><div class="empty-t">まだランキングデータがありません</div></div>';return;}const me=(typeof user!=='undefined'&&user)?data.findIndex(x=>x.user_id===user.id):-1;box.innerHTML=(me>=0?`<div class="my-rank">あなたの順位：${me+1}位 · ${data[me].total_points||0}pt</div>`:'')+data.slice(0,10).map((r,i)=>`<div class="rank-item"><div class="rank-num${i===0?' gold':i===1?' silver':i===2?' bronze':''}">${['🥇','🥈','🥉'][i]||i+1}</div><div class="rank-name">${safe(r.nickname||'ユーザー')}<div style="font-size:9px;color:var(--dim);">${safe(r.city||'広島')}</div></div><div class="rank-pt">${r.total_points||0}pt</div></div>`).join('');}catch(e){box.innerHTML='<div class="empty"><div class="empty-ic">🏆</div><div class="empty-t">取得できませんでした</div></div>';}}
  function addProfilePrefs(){const l=$('#lsec');if(!l||$('#profile-pref-card'))return;const div=document.createElement('div');div.id='profile-pref-card';div.className='profile-pref-card';div.innerHTML=`<div style="font-size:13px;font-weight:900;">地域・年齢層</div><div style="font-size:11px;color:var(--dim);margin-top:3px;">マイページでいつでも変更できます</div><div class="pref-row"><select id="pref-age">${AGES.map(a=>`<option ${a===age?'selected':''}>${a}</option>`).join('')}</select><select id="pref-city">${AREAS.concat(['その他・県外']).map(c=>`<option ${c===city?'selected':''}>${c}</option>`).join('')}</select><button class="pref-save" onclick="saveProfilePrefs()">保存</button></div>`;l.insertBefore(div,l.firstChild);}
  window.saveProfilePrefs=async function(){age=$('#pref-age').value;city=$('#pref-city').value;localStorage.setItem('nx_age',age);localStorage.setItem('nx_city',city);localStorage.setItem('nx_onboarding_done','1');updateAB&&updateAB();renderMP&&renderMP();renderFeed&&renderFeed();if((typeof user!=='undefined'&&user)){try{await sb.from('profiles').upsert({user_id:user.id,age_group:age,city:city,updated_at:new Date().toISOString()},{onConflict:'user_id'});}catch(e){}}toast('プロフィールを更新しました');};
  const oldRenderMP=window.renderMP; window.renderMP=function(){oldRenderMP&&oldRenderMP();addProfilePrefs();};
  async function applyProfile(){if((typeof user!=='undefined'&&user)){try{const p=await sb.from('profiles').select('age_group,city,town_data,char_exp,total_points').eq('user_id',user.id).maybeSingle();if(p.data){if(p.data.age_group){age=p.data.age_group;localStorage.setItem('nx_age',age);}if(p.data.city){city=p.data.city;localStorage.setItem('nx_city',city);}if(p.data.town_data)townData=p.data.town_data;if(p.data.char_exp)charExp=Object.assign(charExp||{},p.data.char_exp);localStorage.setItem('nx_onboarding_done','1');$('#ob')&&$('#ob').classList.add('hide');$('#ab')&&($('#ab').style.display='flex');updateAB&&updateAB();boot&&boot();renderMP&&renderMP();}}catch(e){}}else if(!localStorage.getItem('nx_onboarding_done')&&!localStorage.getItem('nx_prereg')){$('#ob')&&$('#ob').classList.remove('hide');}}
  const oldStart=window.startApp; window.startApp=function(){localStorage.setItem('nx_onboarding_done','1');oldStart&&oldStart();if((typeof user!=='undefined'&&user))saveProfilePrefs();};
  const oldPre=window.submitPreReg; window.submitPreReg=async function(){await (oldPre&&oldPre());localStorage.setItem('nx_onboarding_done','1');};
  function installNexcaGameLayer(){
    const gameCss=document.createElement('style');
    gameCss.textContent=`
      .nx-char-svg{width:44px;height:44px;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,.04));box-shadow:0 0 22px var(--c,rgba(255,255,255,.2));overflow:hidden;position:relative}
      .nx-char-card{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.1);box-shadow:inset 0 1px rgba(255,255,255,.14),0 10px 24px rgba(0,0,0,.28)}
      .nx-summon-stage{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,var(--c,rgba(255,255,255,.3)),transparent 34%),rgba(0,0,0,.92);animation:nxSummonBg 2.4s ease both;z-index:-1}
      @keyframes nxSummonBg{0%{filter:brightness(.2)}45%{filter:brightness(1.8)}100%{filter:brightness(1)}}
      .nx-evo-title{font-family:var(--font-en);font-size:13px;letter-spacing:3px;color:var(--yellow);margin-bottom:8px;text-align:center}
      #char-summon.on .summon-char{animation:nxSummonJump 1.4s cubic-bezier(.17,.84,.44,1) both}@keyframes nxSummonJump{0%{transform:translateY(26px) scale(.2) rotate(-16deg);filter:brightness(3) blur(8px)}45%{transform:translateY(-18px) scale(1.28) rotate(8deg);filter:brightness(1.8)}100%{transform:translateY(0) scale(1);filter:brightness(1)}}
      .town-map{height:min(64vh,520px)!important;border-radius:18px!important;background:#10151e;box-shadow:0 18px 45px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,.08)}
      .nx-town-road{position:absolute;left:-8%;right:-8%;bottom:18%;height:38%;background:linear-gradient(116deg,transparent 0 22%,rgba(255,255,255,.08) 22% 27%,rgba(42,47,52,.88) 27% 43%,rgba(255,255,255,.08) 43% 47%,transparent 47% 100%);opacity:.96}
      .nx-town-river{position:absolute;left:-10%;right:-10%;top:37%;height:15%;background:linear-gradient(90deg,rgba(64,170,255,.78),rgba(138,215,255,.94),rgba(64,170,255,.72));transform:rotate(-8deg);box-shadow:0 0 22px rgba(80,190,255,.25)}
      .nx-town-plaza{position:absolute;left:50%;top:61%;width:96px;height:58px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,222,137,.55),rgba(148,101,41,.32) 62%,transparent 64%);border:1px solid rgba(255,255,255,.16)}
      .nx-town-building{position:absolute;transform:translate(-50%,-50%);font-size:26px;filter:drop-shadow(0 9px 10px rgba(0,0,0,.45));background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:9px 10px;min-width:48px;text-align:center}
      .nx-town-building span{display:block;font-size:7px;font-weight:900;color:rgba(255,255,255,.72);margin-top:3px;white-space:nowrap}
      .nx-town-chat{position:absolute;left:50%;top:-25px;transform:translateX(-50%);white-space:nowrap;background:rgba(7,7,9,.82);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:4px 9px;font-size:9px;color:white;box-shadow:0 8px 18px rgba(0,0,0,.25)}
      .town-char-el{animation:nxTownWalk 5.8s ease-in-out infinite!important}.town-char-el:nth-child(odd){animation-duration:6.9s!important}@keyframes nxTownWalk{0%,100%{transform:translate(-50%,-50%) translateX(-6px) translateY(0)}35%{transform:translate(-50%,-50%) translateX(7px) translateY(-4px)}65%{transform:translate(-50%,-50%) translateX(2px) translateY(4px)}}
      .nx-town-pin{position:absolute;transform:translate(-50%,-100%);background:rgba(0,0,0,.58);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 8px;font-size:10px;font-weight:900;backdrop-filter:blur(8px);box-shadow:0 8px 18px rgba(0,0,0,.22);cursor:pointer}
      .nx-town-life{position:absolute;left:10px;right:10px;bottom:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.nx-town-life div{background:rgba(0,0,0,.34);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:7px;font-size:9px;color:rgba(255,255,255,.78);text-align:center}
      .nx-gacha-cinema{position:fixed;inset:0;z-index:920;display:none;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(255,190,0,.18),rgba(0,0,0,.96) 56%);font-family:var(--font-en);font-size:26px;letter-spacing:4px;color:var(--yellow)}
      .nx-gacha-cinema.on{display:flex;animation:nxCine 2.3s ease both}@keyframes nxCine{0%{opacity:0;transform:scale(1.1)}25%,80%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.96)}}
      .nx-premium-gacha{position:fixed;inset:0;z-index:980;display:none;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.16),transparent 22%),linear-gradient(180deg,#05060b,#110515 48%,#020207);color:white}.nx-premium-gacha.on{display:block}.nx-pg-sky{position:absolute;inset:-20%;background:conic-gradient(from 0deg,rgba(230,57,70,.18),rgba(255,190,0,.24),rgba(77,159,255,.18),rgba(192,132,252,.2),rgba(230,57,70,.18));animation:nxPortal 3s linear infinite;filter:blur(8px)}@keyframes nxPortal{to{transform:rotate(360deg)}}
      .nx-pg-core{position:absolute;left:50%;top:44%;width:164px;height:164px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#fff 0 9%,var(--pg,#ffbe00) 10% 32%,rgba(0,0,0,.2) 33% 42%,transparent 43%);box-shadow:0 0 42px var(--pg,#ffbe00),0 0 100px rgba(255,255,255,.22);animation:nxCore 1.1s ease-in-out infinite alternate}@keyframes nxCore{to{transform:translate(-50%,-50%) scale(1.12);filter:brightness(1.6)}}
      .nx-pg-orbit{position:absolute;left:50%;top:44%;width:260px;height:260px;margin:-130px;border:1px solid rgba(255,255,255,.28);border-radius:50%;animation:nxOrbit 1.6s linear infinite}.nx-pg-orbit.o2{width:328px;height:328px;margin:-164px;animation-duration:2.3s;transform:rotate(38deg)}@keyframes nxOrbit{to{transform:rotate(360deg)}}
      .nx-pg-card{position:absolute;left:50%;top:44%;width:118px;height:166px;margin-left:-59px;margin-top:-83px;border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.24),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.28);box-shadow:0 18px 60px rgba(0,0,0,.45),0 0 38px var(--pg,#ffbe00);display:flex;align-items:center;justify-content:center;font-family:var(--font-en);font-size:17px;letter-spacing:2px;font-weight:900;animation:nxCardDrop 5.2s cubic-bezier(.17,.84,.44,1) both}@keyframes nxCardDrop{0%{transform:translateY(-260px) rotateY(0) scale(.55);opacity:0}28%{opacity:1}58%{transform:translateY(0) rotateY(720deg) scale(1)}78%{transform:translateY(0) rotateY(900deg) scale(1.05);filter:brightness(2)}100%{transform:translateY(0) rotateY(1080deg) scale(1)}}
      .nx-pg-cut{position:absolute;left:0;right:0;top:44%;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 30px #fff;opacity:0;animation:nxCut 5.2s ease both}@keyframes nxCut{62%,72%{opacity:1;transform:scaleY(12)}100%{opacity:0}}
      .nx-pg-text{position:absolute;left:20px;right:20px;bottom:12%;text-align:center}.nx-pg-phase{font-family:var(--font-en);font-size:12px;letter-spacing:3px;color:var(--pg,#ffbe00);margin-bottom:9px}.nx-pg-title{font-size:24px;font-weight:1000;line-height:1.25;text-shadow:0 0 22px rgba(255,255,255,.35)}.nx-pg-sub{margin-top:10px;font-size:12px;color:rgba(255,255,255,.72);line-height:1.7}
      .nx-pg-particle{position:absolute;width:5px;height:5px;border-radius:50%;background:var(--pg,#ffbe00);box-shadow:0 0 14px var(--pg,#ffbe00);animation:nxParticle 2.4s ease-in infinite}@keyframes nxParticle{0%{transform:translateY(20vh) scale(.2);opacity:0}20%,70%{opacity:1}100%{transform:translateY(-90vh) scale(1.2);opacity:0}}
      .nx-gacha-result-sigil{width:94px;height:94px;margin:0 auto 14px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(255,255,255,.9),var(--pg,#ffbe00) 42%,rgba(0,0,0,.3));box-shadow:0 0 44px var(--pg,#ffbe00);font-size:46px;animation:nxResultPop .7s cubic-bezier(.17,.84,.44,1) both}@keyframes nxResultPop{0%{transform:scale(.2);filter:brightness(3)}70%{transform:scale(1.16)}100%{transform:scale(1)}}`;
    document.head.appendChild(gameCss);
    if(!document.getElementById('nx-gacha-cinema')){const g=document.createElement('div');g.id='nx-gacha-cinema';g.className='nx-gacha-cinema';g.textContent='NEXCA FATE DROP';document.body.appendChild(g);}
    if(!document.getElementById('nx-premium-gacha')){
      const p=document.createElement('div');p.id='nx-premium-gacha';p.className='nx-premium-gacha';
      p.innerHTML='<div class="nx-pg-sky"></div><div class="nx-pg-orbit"></div><div class="nx-pg-orbit o2"></div><div class="nx-pg-core"></div><div class="nx-pg-card">NEXCA</div><div class="nx-pg-cut"></div><div class="nx-pg-text"><div class="nx-pg-phase" id="nx-pg-phase">CONNECTING FATE</div><div class="nx-pg-title" id="nx-pg-title">広島の体験運命線を接続中</div><div class="nx-pg-sub" id="nx-pg-sub">街の記憶、今日の気分、まだ知らない一歩を合成しています。</div></div>';
      document.body.appendChild(p);
    }
  }
  const OFFICIAL_CHARS={
    'アガル':{genre:'event',color:'#ff4d4d',icon:'🔥',evo:['火花のアガル','熱風のアガル','爆祭のアガル'],line:['よし、今日を動かすぞ。','その一歩、ちゃんと熱になってる。','街ごと上げていこう。']},
    'ツムギ':{genre:'vintage',color:'#ffd54a',icon:'🧵',evo:['目利きのツムギ','記憶編みのツムギ','時装のツムギ'],line:['その服、物語を持ってる。','好きはちゃんと積み重なる。','君の審美眼、進化してる。']},
    'ヌクミ':{genre:'cafe',color:'#6ee7a8',icon:'☕',evo:['ひだまりのヌクミ','深煎りのヌクミ','憩界のヌクミ'],line:['まあ座って、息をしよう。','休むのも前に進むこと。','ここが君の充電スポット。']},
    'テクル':{genre:'event',color:'#7c8cff',icon:'⚙️',evo:['試作のテクル','発明のテクル','未来図のテクル'],line:['失敗はデータ。次いこ。','発見、ちゃんと記録した？','君の工夫が街を変える。']},
    'コネル':{genre:'event',color:'#c084fc',icon:'🫧',evo:['糸口のコネル','結び目のコネル','縁環のコネル'],line:['つながりは小さく始まる。','話してみる価値、あるかも。','その縁、育ってきたね。']},
    'フワリ':{genre:'cafe',color:'#67d8ff',icon:'🪽',evo:['そよぎのフワリ','雲間のフワリ','風詠みのフワリ'],line:['急がなくていいよ。','見えてるもの、言葉にしてみて。','軽やかに、でも確かに。']},
    'ネクスケ':{genre:'event',color:'#e63946',icon:'🧭',evo:['案内人ネクスケ','開拓者ネクスケ','Nexcaの羅針盤'],line:['次の広島、見つけに行こ。','今日の選択が地図になる。','君がNexcaを進めてる。']},
    'カゲ':{genre:'event',color:'#9aa0ff',icon:'🌙',evo:['月影のカゲ','静守のカゲ','夜導のカゲ'],line:['静かな参加も、ちゃんと力だ。','見えないところで街は育つ。','君の一歩、誰かを支えてる。']}
  };
  function charForEvent(ev){if(ev.charKey&&OFFICIAL_CHARS[ev.charKey])return ev.charKey;if(ev.g==='vintage'||ev.genre==='vintage')return 'ツムギ';if(ev.g==='cafe'||ev.genre==='cafe')return 'ヌクミ';const pool=['アガル','ネクスケ','コネル','テクル','カゲ'];return pool[Math.abs(String(ev.id||ev.title).split('').reduce((a,c)=>a+c.charCodeAt(0),0))%pool.length];}
  function charSvg(name,size=72){
    const c=OFFICIAL_CHARS[name]||OFFICIAL_CHARS.ネクスケ, icon=c.icon, hue=c.color;
    const parts={
      'アガル':'<path d="M42 22 C48 4 58 15 60 3 C66 17 82 9 76 29" fill="#ffbe00" opacity=".9"/><path d="M35 88 C44 108 78 108 86 88" fill="none" stroke="#ff8c00" stroke-width="8" stroke-linecap="round"/>',
      'ツムギ':'<path d="M24 42 C12 24 35 18 43 36" fill="#fff4bf"/><path d="M96 42 C108 24 85 18 77 36" fill="#fff4bf"/><path d="M31 86 C44 76 75 76 89 86" fill="none" stroke="#8b5e34" stroke-width="4" stroke-dasharray="4 5"/>',
      'ヌクミ':'<path d="M28 34 C18 18 39 18 45 35" fill="#d7ffe7"/><path d="M75 27 C93 17 101 35 84 43" fill="#d7ffe7"/><path d="M37 84 C45 93 76 93 84 84" fill="none" stroke="#5a3b20" stroke-width="5" stroke-linecap="round"/>',
      'テクル':'<path d="M24 55 h-12 M108 55 h-12 M60 18 v-12" stroke="#dce7ff" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="60" r="48" fill="none" stroke="#dce7ff" stroke-width="3" stroke-dasharray="7 8"/>',
      'コネル':'<path d="M22 72 C34 46 47 46 60 72 C73 98 86 98 98 72" fill="none" stroke="#f0d7ff" stroke-width="7" stroke-linecap="round"/><circle cx="30" cy="34" r="8" fill="#f0d7ff" opacity=".9"/><circle cx="91" cy="33" r="6" fill="#f0d7ff" opacity=".75"/>',
      'フワリ':'<path d="M20 58 C24 30 48 37 52 57 C41 62 31 64 20 58Z" fill="#e2f8ff"/><path d="M100 58 C96 30 72 37 68 57 C79 62 89 64 100 58Z" fill="#e2f8ff"/><path d="M41 91 C54 99 68 99 81 91" fill="none" stroke="#dff9ff" stroke-width="5" stroke-linecap="round"/>',
      'ネクスケ':'<path d="M60 10 L71 34 L60 29 L49 34 Z" fill="#fff"/><path d="M60 99 L72 78 L60 84 L48 78 Z" fill="#fff" opacity=".85"/><path d="M35 35 L85 85 M85 35 L35 85" stroke="#fff" stroke-width="3" opacity=".55"/>',
      'カゲ':'<path d="M84 26 C62 28 50 46 54 66 C58 84 75 92 92 86 C82 102 44 96 34 70 C25 45 48 20 84 26Z" fill="#e9eaff" opacity=".9"/><circle cx="36" cy="30" r="4" fill="#fff" opacity=".8"/>'
    };
    return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-label="${safe(name)}">
      <defs><radialGradient id="nxBody${safe(name)}"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#fff"/><stop offset=".55" stop-color="${hue}"/><stop offset="1" stop-color="#12131a"/></radialGradient><filter id="nxGlow${safe(name)}"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      ${parts[name]||parts.ネクスケ}
      <ellipse cx="60" cy="66" rx="40" ry="42" fill="url(#nxBody${safe(name)})" filter="url(#nxGlow${safe(name)})"/>
      <ellipse cx="44" cy="62" rx="6" ry="8" fill="#08080a"/><ellipse cx="76" cy="62" rx="6" ry="8" fill="#08080a"/>
      <circle cx="46" cy="59" r="2" fill="#fff"/><circle cx="78" cy="59" r="2" fill="#fff"/>
      <ellipse cx="36" cy="75" rx="7" ry="4" fill="#ff9fb5" opacity=".55"/><ellipse cx="84" cy="75" rx="7" ry="4" fill="#ff9fb5" opacity=".55"/>
      <path d="M50 82 Q60 90 70 82" fill="none" stroke="#08080a" stroke-width="4" stroke-linecap="round"/>
      <text x="60" y="47" text-anchor="middle" font-size="20">${icon}</text>
      <path d="M26 99 C42 111 78 111 94 99" fill="none" stroke="${hue}" stroke-width="7" stroke-linecap="round" opacity=".9"/>
    </svg>`;
  }
  function stageForExp(exp){return exp>=900?2:exp>=350?1:0;}
  function persistCharState(){try{localStorage.setItem('nx_char_exp',JSON.stringify(charExp));localStorage.setItem('nx_owned_chars',JSON.stringify(Array.from(ocChars||[])));}catch(e){}if((typeof user!=='undefined'&&user)){try{sb.from('profiles').upsert({user_id:user.id,char_exp:charExp,updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(()=>{}).catch(()=>{});}catch(e){}}}
  window.showCharSummon=function(charKey,pt,exp,mode){
    const ch=OFFICIAL_CHARS[charKey]||OFFICIAL_CHARS.ネクスケ, oldStage=stageForExp(Math.max(0,(charExp[charKey]||0)-exp)), newStage=stageForExp(charExp[charKey]||0), evo=newStage>oldStage;
    const el=document.getElementById('char-summon');if(!el){toast(charKey+' EXP+'+exp);return;}
    el.style.setProperty('--summon-color',ch.color);el.style.setProperty('--c',ch.color);
    if(!el.querySelector('.nx-summon-stage'))el.insertAdjacentHTML('afterbegin','<div class="nx-summon-stage"></div>');
    document.getElementById('summon-char').innerHTML=charSvg(charKey,106);
    document.getElementById('summon-name').textContent=(evo?'EVOLUTION · ':'')+ch.evo[newStage];
    document.getElementById('summon-catch').innerHTML=(evo?'<div class="nx-evo-title">CHARACTER EVOLUTION</div>':'')+safe(ch.line[newStage]||ch.line[0]);
    document.getElementById('summon-pts').textContent=(mode==='owned'?'EXP+':'+'+pt+'pt ＋ EXP+')+exp;
    document.getElementById('summon-close').textContent=evo?'進化した！':'仲間になった！';
    el.classList.add('on');
  };
  function installCharSystem(){
    if(typeof OC!=='undefined')Object.keys(OFFICIAL_CHARS).forEach(k=>{if(!OC[k])OC[k]={color:OFFICIAL_CHARS[k].color,genre:OFFICIAL_CHARS[k].genre,kuchi:OFFICIAL_CHARS[k].line[0],pers:'Nexca公式キャラクター。体験参加でEXPを集めて進化する。',weak:'まだ未知の体験が足りない。',compat:'ネクスケ',cd:'一緒に街を広げる相棒。',catch:OFFICIAL_CHARS[k].line[0],mbti:{E:60,N:70,F:65,P:70},strengths:['発見','参加','成長'],growth:'参加コードで体験を証明すると進化に近づく。',lvUp:[]};});
    if(typeof EVS!=='undefined')EVS.forEach(ev=>{const k=charForEvent(ev);ev.charKey=k;ev.charEmoji=OFFICIAL_CHARS[k].icon;ev.charName=ev.charName||OFFICIAL_CHARS[k].evo[stageForExp(charExp[k]||0)];ev.charDesc=OFFICIAL_CHARS[k].line[stageForExp(charExp[k]||0)];});
  }
  const oldSubmitPart=window.submitPart;
  window.submitPart=async function(){
    const code=document.getElementById('part-code')&&document.getElementById('part-code').value.trim().toUpperCase();
    const ev=EVS.find(e=>e.id===partEvId); if(!ev)return;
    if(!code||code.length<3){toast('参加コードを入力してください');return;}
    if(code!==String(ev.qr||'').toUpperCase()){document.getElementById('partm-content').innerHTML=`<div style="color:var(--red);font-weight:900;text-align:center;padding:18px;">コードが違います。主催者の画面に表示されている参加コードを確認してください。</div><button class="part-sub" onclick="openPartM('${ev.id}')">もう一度入力する</button>`;return;}
    const eid=publicId(ev.id), key='part_'+eid;
    if(parts[ev.id]||localStorage.getItem(key)==='1'){document.getElementById('partm-content').innerHTML='<div style="color:var(--green);font-weight:900;text-align:center;padding:20px;">この参加コードは使用済みです。キャラはもう仲間になっています。</div><button class="part-sub" onclick="closePartM()">閉じる</button>';return;}
    if((typeof user!=='undefined'&&user)){
      try{const chk=await sb.from('participations').select('id').eq('user_id',user.id).eq('event_id',eid).maybeSingle();if(chk.data){parts[ev.id]='ok';localStorage.setItem(key,'1');document.getElementById('partm-content').innerHTML='<div style="color:var(--green);font-weight:900;text-align:center;padding:20px;">この参加コードは使用済みです。</div><button class="part-sub" onclick="closePartM()">閉じる</button>';return;}}catch(e){}
    }
    parts[ev.id]='ok';localStorage.setItem(key,'1');
    const charKey=charForEvent(ev), owned=!!(charExp[charKey]&&charExp[charKey]>0), ptG=ev.fixed?80:120, expG=owned?90:140;
    if((typeof user!=='undefined'&&user)){try{await sb.from('participations').insert({user_id:user.id,event_id:eid,code:code,points:ptG,created_at:new Date().toISOString(),age_group:age,city:city,character:charKey});}catch(e){}}
    addPt('参加証明：'+ev.title,ptG,false,'part_'+eid);
    const before=charExp[charKey]||0; charExp[charKey]=before+expG; ocChars.add('CHAR_'+charKey); persistCharState();
    setTimeout(()=>{closePartM();showCharSummon(charKey,ptG,expG,owned?'owned':'new');renderOcGrid&&renderOcGrid();renderTownChars&&renderTownChars();},450);
  };
  function tuneEconomy(){
    if(typeof SHOP!=='undefined'){const costs={g1:120,g2:180,g3:280,g4:420,g5:900};SHOP.forEach(s=>{if(costs[s.id])s.cost=costs[s.id];});}
    if(typeof EARN!=='undefined'){EARN.forEach(e=>{if(e.name==='動画視聴')e.pt=5;if(e.name==='いいね')e.pt=8;if(e.name==='行きたい登録')e.pt=8;if(e.name==='診断完了')e.pt=60;if(e.name==='参加証明')e.pt=120;if(e.name==='振り返り投稿')e.pt=50;if(e.name==='ログイン')e.pt=10;});}
  }
  function enhanceGacha(){
    if(typeof GACHA==='undefined')return;
    GACHA.Common=[
      {text:'気になったスポットを1つ「行きたい」に入れて、ネクスケに報告する',ev:'小さな意思決定は次の行動を起こしやすくする',type:'家',pts:55,char:'ネクスケ'},
      {text:'今日の気分に合うカフェを1つ保存して、休憩予定を作る',ev:'休憩の予定化は外出の心理的負担を下げる',type:'家',pts:60,char:'ヌクミ'},
      {text:'古着ジャンルを見て、今の自分にない色を1つ決める',ev:'選択肢の拡張は自己表現の幅を広げる',type:'家',pts:60,char:'ツムギ'}
    ];
    GACHA.Uncommon=[
      {text:'徒歩10分以内で入ったことのない店の前まで行く',ev:'近距離の新奇探索は継続しやすい',type:'外',pts:90,char:'アガル'},
      {text:'友達に「ここ一緒に行かん？」を1件送る',ev:'共有は参加ハードルを下げ、行動を現実に近づける',type:'家',pts:95,char:'コネル'},
      {text:'今日見つけた広島の“いい違和感”を写真で残す',ev:'観察の習慣は街への愛着を高める',type:'外',pts:100,char:'フワリ'}
    ];
    GACHA.Rare=[
      {text:'Nexca掲載スポットを開いて、地図・料金・参加方法まで確認する',ev:'具体的な移動イメージは実参加率を高める',type:'外',pts:150,char:'テクル'},
      {text:'カフェ→古着→川沿いを90分の小さな旅として回る',ev:'連続した体験は記憶に残りやすい',type:'外',pts:170,char:'ツムギ'}
    ];
    GACHA.Epic=[
      {text:'今日の広島を「朝・昼・夕方」の3枚で記録して、1本の物語にする',ev:'体験を物語化すると満足度と継続意欲が上がる',type:'外',pts:240,char:'フワリ'},
      {text:'Nexcaで見つけた場所に実際に行き、参加コード獲得まで狙う',ev:'完了体験は自己効力感を強く伸ばす',type:'外',pts:280,char:'ネクスケ'}
    ];
    GACHA.Legendary=[
      {text:'午前は街歩き、昼は地元ごはん、午後はイベント、夜は駅周辺で締める「広島1日クエスト」を達成する',ev:'長時間の新奇体験は街への愛着と自己効力感を大きく刺激する',type:'外',pts:420,char:'アガル'},
      {text:'誰かを1人誘って、Nexca掲載体験を本当に1つやり切る',ev:'共同達成は記憶の強度を高め、次の参加につながる',type:'外',pts:460,char:'コネル'}
    ];
  }
  function rarityColor(r){return {Common:'#cdd3df',Uncommon:'#62d6a1',Rare:'#4d9fff',Epic:'#c084fc',Legendary:'#ffbe00'}[r]||'#ffbe00';}
  function drawPremiumMission(){
    const weights={Common:42,Uncommon:28,Rare:18,Epic:9,Legendary:3};let rand=Math.random()*100,rarity='Common',cum=0;
    for(const r of Object.keys(weights)){cum+=weights[r];if(rand<cum){rarity=r;break;}}
    const pool=GACHA[rarity]||GACHA.Common, mission={...pool[Math.floor(Math.random()*pool.length)]};
    mission.rarity=rarity; mission.char=mission.char||(['アガル','ツムギ','ヌクミ','テクル','コネル','フワリ','ネクスケ','カゲ'][Math.floor(Math.random()*8)]);
    return mission;
  }
  function showPremiumResult(mission){
    const ch=OFFICIAL_CHARS[mission.char]||OFFICIAL_CHARS.ネクスケ, color=rarityColor(mission.rarity), icons={Common:'🎴',Uncommon:'🌿',Rare:'💎',Epic:'🔮',Legendary:'🌈'};
    const ov=$('#gacha-ov'); if(!ov)return;
    ov.style.setProperty('--pg',color);
    $('#gr-icon').innerHTML=`<div class="nx-gacha-result-sigil">${icons[mission.rarity]||'🎴'}</div>`;
    $('#gr-rarity').className='gr-rarity '+({Common:'gr-c',Uncommon:'gr-u',Rare:'gr-r',Epic:'gr-e',Legendary:'gr-l'}[mission.rarity]||'gr-c');
    $('#gr-rarity').textContent=mission.rarity==='Legendary'?'LEGENDARY DROP':mission.rarity+' DROP';
    $('#gr-type').innerHTML=`<div style="margin:8px auto 10px;width:96px;height:96px;display:flex;align-items:center;justify-content:center;">${charSvg(mission.char,92)}</div><div style="color:${ch.color};font-weight:1000;">${safe(mission.char)}からのクエスト</div>`;
    $('#gr-text').textContent=mission.text;
    $('#gr-evidence').textContent='📚 '+mission.ev+' / 報酬 '+mission.pts+'pt';
    ov.classList.add('on');
    if(mission.rarity==='Legendary'){document.body.classList.add('gacha-legendary-burst');setTimeout(()=>document.body.classList.remove('gacha-legendary-burst'),1800);}
  }
  window.openGacha=async function(){
    if(await hasGachaToday()){toast('本日のガチャは使用済みです');return;}
    if(typeof GACHA==='undefined')return;
    const mission=drawPremiumMission(); window.gMission=mission; gMission=mission; await recordGachaToday();
    const p=$('#nx-premium-gacha'), color=rarityColor(mission.rarity);
    if(!p){showPremiumResult(mission);return;}
    p.style.setProperty('--pg',color);
    p.querySelector('#nx-pg-phase').textContent='FATE LINE CONNECTED';
    p.querySelector('#nx-pg-title').textContent='広島の体験運命線を接続中';
    p.querySelector('#nx-pg-sub').textContent='街の記憶、今日の気分、キャラの導きを合成しています。';
    p.querySelectorAll('.nx-pg-particle').forEach(x=>x.remove());
    for(let i=0;i<42;i++){const s=document.createElement('i');s.className='nx-pg-particle';s.style.left=Math.random()*100+'%';s.style.bottom=(-10+Math.random()*30)+'%';s.style.animationDelay=(Math.random()*1.8)+'s';s.style.animationDuration=(1.6+Math.random()*1.7)+'s';p.appendChild(s);}
    p.classList.add('on'); if(navigator.vibrate)navigator.vibrate([80,50,120,50,220]);
    setTimeout(()=>{p.querySelector('#nx-pg-phase').textContent='CHARACTER SIGNAL';p.querySelector('#nx-pg-title').textContent=(mission.char||'ネクスケ')+'が反応している';p.querySelector('#nx-pg-sub').textContent='このクエストは、キャラEXPにもつながる特別な一歩です。';},1700);
    setTimeout(()=>{p.querySelector('#nx-pg-phase').textContent=mission.rarity+' DROP';p.querySelector('#nx-pg-title').textContent=mission.rarity==='Legendary'?'激レア、来る。':'カードが開く。';p.querySelector('#nx-pg-sub').textContent='結果を確定しています。';if(navigator.vibrate)navigator.vibrate([240,80,240]);},3600);
    setTimeout(()=>{p.classList.remove('on');showPremiumResult(mission);},5400);
  };
  const oldSelQ=window.selQ;
  window.selQ=function(oi){try{if((typeof user!=='undefined'&&user)&&typeof dQ!=='undefined'&&dQ[cQ]){const q=dQ[cQ];sb.from('diagnosis_answers').insert({user_id:user.id,question_no:q.n||cQ+1,answer_index:oi,age_group:age,city:city,created_at:new Date().toISOString()}).then(()=>{}).catch(()=>{});}}catch(e){}oldSelQ(oi);};
  const oldRenderOc=window.renderOcGrid;
  window.renderOcGrid=function(){const el=document.getElementById('official-char-grid');if(!el)return oldRenderOc&&oldRenderOc();el.innerHTML=Object.keys(OFFICIAL_CHARS).map(k=>{const exp=charExp[k]||0, st=stageForExp(exp), got=exp>0||ocChars.has('CHAR_'+k);return `<div class="char-cell ${got?'got':''}" onclick="charExp['${k}']=(charExp['${k}']||0)+80;persistCharState&&persistCharState();showCharSummon('${k}',0,80,'owned');renderOcGrid();"><div class="nx-char-svg" style="--c:${OFFICIAL_CHARS[k].color};">${got?charSvg(k,42):'?'}</div><div class="char-cell-name ${got?'got':''}" style="${got?'color:'+OFFICIAL_CHARS[k].color:''}">${got?OFFICIAL_CHARS[k].evo[st]:'???'}</div><div style="font-size:7px;color:${OFFICIAL_CHARS[k].color};">EXP ${exp}</div></div>`;}).join('');};
  const oldTownChars=window.renderTownChars;
  window.renderTownChars=function(){
    const el=document.getElementById('town-chars-scroll');if(!el)return;
    el.innerHTML=Object.keys(OFFICIAL_CHARS).map(k=>{
      const exp=charExp[k]||0, active=(townData.chars||[]).some(c=>c.key===k), st=stageForExp(exp), locked=exp<=0&&!ocChars.has('CHAR_'+k);
      return `<div class="town-char-thumb ${active?'in-town':''}" onclick="${locked?`toast('参加コードで${k}を仲間にしよう')`:`toggleCharInTown('${k}')`}"><div class="nx-char-svg nx-char-card" style="--c:${OFFICIAL_CHARS[k].color};opacity:${locked?.38:1};">${locked?'?':charSvg(k,42)}</div><div class="town-char-thumb-name" style="color:${OFFICIAL_CHARS[k].color};">${locked?'???':OFFICIAL_CHARS[k].evo[st]}</div><div style="font-size:7px;color:${OFFICIAL_CHARS[k].color};">EXP ${exp}</div></div>`;
    }).join('');
  };
  function persistTownState(){
    try{localStorage.setItem('nx_town_data',JSON.stringify(townData));}catch(e){}
    if((typeof user!=='undefined'&&user)){try{sb.from('profiles').upsert({user_id:user.id,town_data:townData,updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(()=>{}).catch(()=>{});}catch(e){}}
  }
  const oldOpenTown=window.openTown;
  window.openTown=function(){oldOpenTown&&oldOpenTown();renderTownMap&&renderTownMap();renderTownChars&&renderTownChars();renderTownShop&&renderTownShop();};
  const oldBuyTownItem=window.buyTownItem;
  window.buyTownItem=function(itemId){oldBuyTownItem&&oldBuyTownItem(itemId);persistTownState();setTimeout(()=>{renderTownMap&&renderTownMap();renderTownShop&&renderTownShop();},50);};
  const oldToggleCharInTown=window.toggleCharInTown;
  window.toggleCharInTown=function(charKey){
    if(charKey&&typeof charKey==='object')charKey=charKey.dataset.key;
    if(!townData.chars)townData.chars=[];
    const exists=townData.chars.findIndex(c=>c.key===charKey);
    if(exists>=0){townData.chars.splice(exists,1);toast(charKey+'を街から外しました');}
    else{
      const pos=[[24,67],[42,58],[58,70],[72,55],[34,78],[83,72]][townData.chars.length%6];
      townData.chars.push({key:charKey,x:pos[0]+Math.random()*4,y:pos[1]+Math.random()*4});
      toast(charKey+'がマイ広島に来ました');
    }
    persistTownState();renderTownMap();renderTownChars();updateTownLevel();
  };
  window.renderTownMap=function(){
    const layer=document.getElementById('town-items-layer'),empty=document.getElementById('town-empty-msg');if(!layer)return;
    if(!townData.items)townData.items=[]; if(!townData.chars)townData.chars=[];
    const hour=new Date().getHours(),night=hour>=19||hour<6,evening=hour>=16&&hour<19,morning=hour>=5&&hour<10;
    const sky=document.querySelector('.town-sky'),ground=document.querySelector('.town-ground'),time=document.getElementById('town-time-ind');
    if(sky)sky.style.background=night?'linear-gradient(180deg,#050615,#101c43 62%,#2c1d3a)':evening?'linear-gradient(180deg,#fb9f6d,#ffd27a 52%,#6aa0c8)':'linear-gradient(180deg,#73c8ff,#bfeaff 58%,#ffe5a4)';
    if(ground)ground.style.background=night?'linear-gradient(180deg,#142813,#061509)':'linear-gradient(180deg,#4b9a48,#1f6231)';
    if(time)time.textContent=night?'🌙 NIGHT':evening?'🌆 EVENING':morning?'🌅 MORNING':'☀️ DAY';
    if(empty)empty.style.display='none';
    const area=(townData.area||'center');
    const buildings={
      center:[['🏪','コンビニ',17,72],['☕','喫茶',35,60],['👗','古着',58,68],['🎪','イベント',78,58],['🚉','駅前',86,78],['🍜','ごはん',47,82]],
      park:[['🌳','木陰',18,70],['🛝','広場',38,62],['🥤','売店',62,72],['🎪','野外',78,58],['🌼','花壇',84,78]],
      port:[['⚓','港',16,72],['⛴️','フェリー',38,59],['☕','海カフェ',62,69],['🌉','夜景',80,54],['🍋','島店',86,78]],
      shrine:[['⛩️','参道',18,70],['🍡','茶屋',36,61],['🌲','杜',58,70],['🦌','広場',76,57],['🧧','願い',86,78]]
    }[area]||[];
    layer.innerHTML='<div class="nx-town-river"></div><div class="nx-town-road"></div><div class="nx-town-plaza"></div>';
    buildings.forEach(b=>layer.insertAdjacentHTML('beforeend',`<div class="nx-town-building" style="left:${b[2]}%;top:${b[3]}%" onclick="showTownAreaEvents('${safe(b[1])}')">${b[0]}<span>${safe(b[1])}</span></div>`));
    townData.items.forEach((item,i)=>layer.insertAdjacentHTML('beforeend',`<div class="town-el" style="left:${item.x}%;top:${item.y}%;font-size:${24+(i%3)*3}px;filter:drop-shadow(0 8px 8px rgba(0,0,0,.35));">${safe(item.em)}</div>`));
    const activeChars=townData.chars.length?townData.chars:Object.keys(OFFICIAL_CHARS).filter(k=>(charExp[k]||0)>0||ocChars.has('CHAR_'+k)).slice(0,3).map((k,i)=>({key:k,x:30+i*18,y:66+(i%2)*10}));
    activeChars.forEach((tc,i)=>{
      const k=tc.key,ch=OFFICIAL_CHARS[k]||OFFICIAL_CHARS.ネクスケ,x=tc.x||30+i*14,y=tc.y||62+(i%3)*8,st=stageForExp(charExp[k]||0);
      layer.insertAdjacentHTML('beforeend',`<div class="town-char-el" style="left:${x}%;top:${y}%;--c:${ch.color};animation-delay:${i*.4}s" onclick="openTcm('${k}')"><div class="nx-town-chat">${safe(ch.line[st])}</div><div class="nx-char-svg nx-char-card" style="--c:${ch.color};width:54px;height:54px;">${charSvg(k,54)}</div></div>`);
    });
    (typeof EVS!=='undefined'?EVS:[]).filter(e=>!e.isOfficial).slice(0,3).forEach((ev,i)=>layer.insertAdjacentHTML('beforeend',`<div class="nx-town-pin" style="left:${22+i*27}%;top:${31+i%2*6}%" onclick="openDrw('${ev.id}')">${safe(ev.ge||'🎉')} ${safe(String(ev.title).slice(0,7))}</div>`));
    const owned=Object.keys(OFFICIAL_CHARS).filter(k=>(charExp[k]||0)>0||ocChars.has('CHAR_'+k)).length;
    layer.insertAdjacentHTML('beforeend',`<div class="nx-town-life"><div>仲間 ${owned}/8</div><div>建物 ${townData.items.length}</div><div>街EXP ${owned*80+townData.items.length*45}</div></div>`);
    updateTownLevel&&updateTownLevel();
  };
  window.showTownAreaEvents=function(label){
    const list=(typeof EVS!=='undefined'?EVS:[]).filter(e=>!e.isOfficial).slice(0,3);
    toast(label+'周辺のイベントを表示します');
    if(list[0])openDrw(list[0].id);
  };
  window.updateTownLevel=function(){
    const owned=Object.keys(OFFICIAL_CHARS).filter(k=>(charExp[k]||0)>0||ocChars.has('CHAR_'+k)).length;
    const n=(townData.items||[]).length+owned,lv=Math.max(1,Math.floor(n/2)+1),pct=Math.min(100,20+(n%4)*24);
    const b=document.getElementById('town-lv-badge'),name=document.getElementById('town-lv-name'),sub=document.getElementById('town-lv-sub'),fill=document.getElementById('town-lv-fill');
    if(b)b.textContent='LV'+lv;
    if(name)name.textContent=lv>=8?'Nexcaキャラタウン':lv>=5?'にぎわう育成タウン':lv>=3?'キャラが暮らす街':'はじまりのマイ広島';
    if(sub)sub.textContent='キャラを仲間にして、建物を置いて、街を育てる';
    if(fill)fill.style.width=pct+'%';
  };
  window.persistCharState=persistCharState;
  function bootGameLayer(){installNexcaGameLayer();tuneEconomy();enhanceGacha();installCharSystem();renderOcGrid&&renderOcGrid();renderTownChars&&renderTownChars();}
  window.addEventListener('DOMContentLoaded',()=>{bootGameLayer();setTimeout(()=>{bootGameLayer();renderFeed&&renderFeed();renderShop&&renderShop();renderEarn&&renderEarn();},900);});
  window.addEventListener('DOMContentLoaded',()=>{extendData();overrideCore();hydrateGroupGacha();renderGenreOpts&&renderGenreOpts();renderFlyerTabs&&renderFlyerTabs();renderFeed&&renderFeed();applyProfile();const ob=$('#ob');if(ob&&(localStorage.getItem('nx_onboarding_done')==='1'||localStorage.getItem('nx_prereg')==='1')&&localStorage.getItem('nx_age'))ob.classList.add('hide');});
})();


