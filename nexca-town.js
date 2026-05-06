(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  const D=()=>window.NEXCA_TOWN_DATA||{buildings:[],characters:[],games:[],shop:[],quests:[]};
  const today=()=>new Date().toISOString().slice(0,10);
  const safe=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let state=null, view='town', activeGame=null, gameState={};

  function baseState(){
    const b={}; D().buildings.forEach(x=>b[x[0]]={buildingId:x[0],name:x[1],genre:x[2],level:1,exp:0,visualStage:1,rewardReady:x[0]!=='home',lastRewardCollectedAt:null});
    const c={}; D().characters.forEach((x,i)=>c[x[0]]={id:x[0],name:x[1],type:x[2],rarity:x[3],level:1,exp:0,skillName:x[5],skillDescription:x[5],dialogue:x[6],costume:'default',isMain:i===0});
    return {playerLevel:1,playerExp:0,points:0,gems:0,townPopularity:0,townRank:1,loginStreak:0,lastLoginDate:null,totalMiniGamesPlayed:0,totalExperienceCards:0,totalParticipationCodesRedeemed:0,buildings:b,characters:c,inventory:[],collections:[],experienceCards:[],dailyQuests:[],miniGamePlays:{},claimedLoginBonus:null};
  }
  function load(){
    try{state=Object.assign(baseState(),JSON.parse(localStorage.getItem('nexca_town_state')||'{}'));}catch(e){state=baseState();}
    state.buildings=Object.assign(baseState().buildings,state.buildings||{});
    state.characters=Object.assign(baseState().characters,state.characters||{});
    resetDaily();
    syncPoints();
    return state;
  }
  function save(){
    syncPoints();
    localStorage.setItem('nexca_town_state',JSON.stringify(state));
    try{localStorage.setItem('nx_town_data',JSON.stringify({nexcaTown:state,items:state.inventory,chars:Object.values(state.characters).filter(c=>c.level>1).map((c,i)=>({key:c.name,x:30+i*12,y:64+i%2*9}))}));}catch(e){}
    if(window.user&&window.sb){try{sb.from('profiles').upsert({user_id:user.id,town_data:{nexcaTown:state},total_points:Math.floor((window.pts||0)),updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(()=>{});}catch(e){}}
  }
  function syncPoints(){if(typeof window.pts==='number')state.points=Math.max(state.points||0,Math.floor(window.pts));}
  function grantPoints(n,label){state.points+=n;if(typeof window.addPt==='function')window.addPt(label||'Nexca Town',n,false);else if(typeof window.pts==='number')window.pts+=n;}
  function resetDaily(){
    if(state.dailyDate===today())return;
    state.dailyDate=today();
    state.dailyQuests=D().quests.map(q=>({questId:q[0],title:q[1],targetAction:q[2],targetCount:q[3],currentCount:q[2]==='openTown'?1:0,rewardPoints:q[4],rewardExp:q[5],isCompleted:q[2]==='openTown',isClaimed:false,date:today()}));
    if(state.lastLoginDate){
      const y=new Date();y.setDate(y.getDate()-1);
      state.loginStreak=state.lastLoginDate===y.toISOString().slice(0,10)?(state.loginStreak||0)+1:1;
    }else state.loginStreak=1;
    state.lastLoginDate=today();
  }
  function progress(action,n=1){
    state.dailyQuests.forEach(q=>{if(q.targetAction===action&&!q.isClaimed){q.currentCount=Math.min(q.targetCount,q.currentCount+n);q.isCompleted=q.currentCount>=q.targetCount;}});
  }
  function expNeed(lv){return 90+lv*35}
  function addPlayerExp(n){
    state.playerExp+=n;
    let leveled=false;
    while(state.playerExp>=expNeed(state.playerLevel)){state.playerExp-=expNeed(state.playerLevel);state.playerLevel++;state.gems+=2;grantPoints(50,'Nexca Town レベルアップ');leveled=true;}
    if(leveled)reward('LEVEL UP','プレイヤーLv'+state.playerLevel+'になりました。新しい街の飾りが近づいています。','🎉');
  }
  function addBuildingExp(id,n){
    const b=state.buildings[id]||state.buildings.plaza;b.exp+=n;
    while(b.exp>=80+b.level*30){b.exp-=80+b.level*30;b.level++;b.visualStage=Math.min(3,Math.floor((b.level+1)/2));state.townPopularity+=8;reward('建物レベルアップ',b.name+' がLv'+b.level+'になりました。','🏗️');}
  }
  function addCharExp(id,n){
    const c=state.characters[id]||state.characters.neku;c.exp+=n;
    while(c.exp>=70+c.level*25){c.exp-=70+c.level*25;c.level++;reward('キャラレベルアップ',c.name+' がLv'+c.level+'になりました。','✨');}
  }
  function reward(title,sub,em='⭐'){let ov=$('#nxt-reward');if(!ov){ov=document.createElement('div');ov.id='nxt-reward';ov.className='nxt-overlay';document.body.appendChild(ov);}ov.innerHTML=`<div class="nxt-reward-box"><div class="nxt-reward-em">${em}</div><div class="nxt-reward-title">${safe(title)}</div><div class="nxt-reward-sub">${safe(sub)}</div><button class="nxt-close" onclick="document.getElementById('nxt-reward').classList.remove('on')">受け取る</button></div>`;ov.classList.add('on');}

  function open(){load();mount();render();save();}
  function close(){const ov=$('#town-ov');if(ov)ov.style.display='none';}
  function mount(){
    const ov=$('#town-ov');if(!ov)return;
    ov.className='nx-town';ov.style.display='flex';
    ov.innerHTML=`<div class="nxt-shell"><div class="nxt-top"><button class="nxt-back" onclick="NexcaTown.close()">←</button><div class="nxt-title"><span class="nxt-logo-mark"><i></i><b></b><em></em></span><span class="nxt-logo-text">Nexca</span><strong>Nexca Town</strong><small>まだ知らない体験が、次の自分を連れてくる。</small></div><div class="nxt-stats" id="nxt-stats"></div><button class="nxt-gift" onclick="NexcaTown.loginBonus()">🎁<br><span style="font-size:10px">7日ログイン</span></button></div><main class="nxt-main"><div class="nxt-board" id="nxt-board"></div></main><nav class="nxt-bottom" id="nxt-tabs"></nav><section class="nxt-screen" id="nxt-screen"></section></div>`;
  }
  function render(){
    $('#nxt-stats').innerHTML=`<div class="nxt-pill">Lv. ${state.playerLevel}</div><div class="nxt-pill">🏅 ${state.townRank||1}</div><div class="nxt-pill">💗 ${Math.floor(state.points)} pt</div><div class="nxt-pill">💎 ${state.gems}</div><div class="nxt-pill">にぎわい ${state.townPopularity}</div><div class="nxt-pill">${state.loginStreak}日連続</div>`;
    $('#nxt-tabs').innerHTML=[['town','マップ','🗺️'],['chars','公式キャラ','👧'],['games','ミニゲーム','🎮'],['shop','ショップ','🛍️'],['collection','実績','🏆']].map(t=>`<button class="nxt-tab ${view===t[0]?'on':''}" onclick="NexcaTown.nav('${t[0]}')"><div>${t[2]}</div>${t[1]}</button>`).join('');
    view==='town'?renderTown():renderScreen(view);
  }
  function nav(v){view=v;activeGame=null;render();}
  function charArt(id,small){
    const cls='nxt-avatar '+(small?'mini ':'')+'char-'+safe(id);
    const face=id==='furugy'?'眼鏡の発掘家':id==='caferu'?'カップの案内人':id==='eventy'?'旗の案内人':'ネクちゃん';
    return `<span class="${cls}" aria-label="${face}"><i></i><b></b><em></em></span>`;
  }
  function buildingArt(id,icon){
    return `<span class="nxt-b-roof"></span><span class="nxt-b-wall"><i></i><b></b><em></em></span><span class="nxt-b-sign">${safe(icon)}</span>`;
  }
  function townDecor(){
    return `<div class="nxt-decor torii"></div><div class="nxt-decor tram"><span></span><span></span><i></i></div><div class="nxt-decor bridge"></div><div class="nxt-decor boat"></div><div class="nxt-decor build"><b>建設中...</b><span>5時間26分</span></div>${Array.from({length:26},(_,i)=>`<i class="nxt-flower" style="left:${12+(i*17)%77}%;top:${24+(i*29)%58}%;animation-delay:${(i%6)*.2}s"></i>`).join('')}`;
  }
  function townSceneSvg(){
    return `<svg class="nxt-city-art" viewBox="0 0 900 620" aria-hidden="true">
      <defs>
        <linearGradient id="nxwater" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7ad5ff"/><stop offset="1" stop-color="#278fb6"/></linearGradient>
        <linearGradient id="nxgrass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b8ef82"/><stop offset="1" stop-color="#55b757"/></linearGradient>
        <linearGradient id="nxstone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f6df9c"/><stop offset="1" stop-color="#b77d3a"/></linearGradient>
      </defs>
      <rect width="900" height="620" fill="url(#nxwater)"/>
      <g opacity=".42">
        ${Array.from({length:16},(_,i)=>`<path d="M${-90+i*70} ${120+i%4*42} C${-40+i*70} ${104+i%4*42} ${18+i*70} ${137+i%4*42} ${72+i*70} ${116+i%4*42}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`).join('')}
      </g>
      <g opacity=".46">
        ${Array.from({length:18},(_,i)=>`<rect x="${32+i*48}" y="${58+(i%3)*18}" width="28" height="${46+(i%4)*12}" rx="4" fill="#8aa9b8"/><rect x="${38+i*48}" y="${70+(i%3)*18}" width="5" height="5" fill="#fff6bd"/><rect x="${50+i*48}" y="${82+(i%3)*18}" width="5" height="5" fill="#fff6bd"/>`).join('')}
        <circle cx="602" cy="95" r="34" fill="none" stroke="#9bb4be" stroke-width="8"/><rect x="578" y="98" width="48" height="56" rx="4" fill="#91a8b1"/>
      </g>
      <path d="M118 214 C216 144 344 146 451 168 C588 103 774 178 804 298 C876 382 793 523 644 531 C531 611 342 586 254 536 C107 539 32 430 70 315 C78 270 91 236 118 214Z" fill="url(#nxstone)"/>
      <path d="M133 222 C228 167 350 170 455 191 C577 136 743 194 771 304 C832 381 759 501 623 503 C521 569 358 546 269 504 C137 506 67 418 98 319 C104 276 112 246 133 222Z" fill="url(#nxgrass)"/>
      <path d="M180 472 C270 392 362 351 451 313 C526 281 620 240 730 222" fill="none" stroke="#d19b56" stroke-width="42" stroke-linecap="round"/>
      <path d="M180 472 C270 392 362 351 451 313 C526 281 620 240 730 222" fill="none" stroke="#f5dba2" stroke-width="28" stroke-linecap="round"/>
      <path d="M260 226 C320 292 384 348 465 400 C521 436 584 474 650 512" fill="none" stroke="#d19b56" stroke-width="38" stroke-linecap="round"/>
      <path d="M260 226 C320 292 384 348 465 400 C521 436 584 474 650 512" fill="none" stroke="#f5dba2" stroke-width="24" stroke-linecap="round"/>
      <circle cx="455" cy="354" r="60" fill="#ddaa61"/><circle cx="455" cy="354" r="48" fill="#ffe4aa"/><circle cx="455" cy="344" r="28" fill="#68d1ff"/><circle cx="455" cy="344" r="18" fill="#2b98cf"/>
      ${Array.from({length:62},(_,i)=>`<g transform="translate(${118+(i*67)%680} ${218+(i*43)%302})"><circle r="${8+(i%3)*2}" fill="${i%2?'#3a9f54':'#56b765'}"/><rect x="-2" y="5" width="4" height="10" fill="#8b5a2b"/></g>`).join('')}
      ${Array.from({length:38},(_,i)=>`<circle cx="${145+(i*83)%650}" cy="${238+(i*37)%280}" r="${3+i%3}" fill="${['#ff7aa2','#fff1a1','#ffffff','#ffc85c'][i%4]}"/>`).join('')}
      <g transform="translate(421 188)"><rect x="0" y="42" width="96" height="48" rx="8" fill="#1e1c2e" stroke="#ffc45a" stroke-width="5"/><path d="M-12 43 H108 L92 13 H4Z" fill="#ef4c68"/><rect x="14" y="56" width="12" height="28" rx="3" fill="#5aa6ff"/><rect x="70" y="56" width="12" height="28" rx="3" fill="#5aa6ff"/><rect x="34" y="61" width="28" height="16" rx="8" fill="#ffbe00"/></g>
      <g transform="translate(228 258)"><rect x="0" y="30" width="80" height="58" rx="8" fill="#d89145"/><path d="M-8 31 H88 L72 0 H9Z" fill="#275b50"/><rect x="15" y="44" width="14" height="15" fill="#fff0b2"/><rect x="51" y="44" width="14" height="15" fill="#fff0b2"/></g>
      <g transform="translate(612 260)"><rect x="0" y="30" width="86" height="58" rx="8" fill="#c67a39"/><path d="M-8 31 H94 L75 0 H10Z" fill="#8a4c25"/><rect x="10" y="48" width="66" height="12" fill="#fff0c1"/><path d="M10 48 H76" stroke="#ff7b68" stroke-width="6" stroke-dasharray="9 9"/></g>
    </svg>`;
  }
  function renderTown(){
    const board=$('#nxt-board'); if(!board)return;
    const screen=$('#nxt-screen'); if(screen)screen.classList.remove('on');
    const friends=Object.values(state.characters).slice(0,4);
    const collectRate=Math.min(99,Math.round((state.collections.length+state.experienceCards.length+state.inventory.length)/24*100));
    board.innerHTML=`${townSceneSvg()}<div class="nxt-plaza"></div>${townDecor()}<button class="nxt-game-dock" onclick="NexcaTown.nav('games')"><span>MINI GAME PLAZA</span><b>5つのゲームで街を育てる</b><i>PLAY</i></button><div class="nxt-quest"><div class="nxt-panel-title">今日のクエスト</div>${state.dailyQuests.map(q=>`<div class="nxt-q"><div><div class="nxt-q-t">${safe(q.title)}</div><div class="nxt-bar"><i style="width:${Math.round(q.currentCount/q.targetCount*100)}%"></i></div></div><button class="nxt-claim" onclick="NexcaTown.claimQuest('${q.questId}')" ${!q.isCompleted||q.isClaimed?'disabled':''}>${q.isClaimed?'済':q.rewardPoints+'pt'}</button></div>`).join('')}<button class="nxt-claim" style="width:100%;margin-top:8px" onclick="NexcaTown.claimAll()">すべて受け取る</button></div><div class="nxt-side"><div class="nxt-panel-title">イベント報酬</div><div class="nxt-side-grid"><button class="nxt-code-btn" onclick="NexcaTown.nav('code')">参加コード</button><button class="nxt-side-card" onclick="NexcaTown.nav('cards')">体験カード<br><b>${state.experienceCards.length}枚</b></button><button class="nxt-side-card strong" onclick="NexcaTown.nav('games')">ミニゲーム広場<br><b>今すぐ遊ぶ</b></button></div></div><div class="nxt-zone" style="right:6%;top:39%;width:96px;height:82px;">🔒<br>エリア拡張<br>Lv.20で解放</div><div class="nxt-zone" style="right:5%;bottom:25%;width:104px;height:90px;">🔒<br>空の広場<br>Lv.30で解放</div><div class="nxt-friends official"><div class="nxt-panel-title">Nexca公式キャラクター <span style="float:right">4/20</span></div><div class="nxt-friend-row">${friends.map(c=>`<div class="nxt-friend">${charArt(c.id,true)}<span>${safe(c.name)} Lv.${c.level}</span></div>`).join('')}</div></div><div class="nxt-collection-mini"><div class="nxt-panel-title">コレクション</div><div class="nxt-book"></div><b>${collectRate}%</b></div><div class="nxt-guide">ネクスカ公式キャラクターは参加コードやミニゲームで育つよ。現実で遊ぶほど、街もキャラも進化する。</div>`;
    D().buildings.forEach(b=>{
      const st=state.buildings[b[0]]||{level:1,rewardReady:false};
      board.insertAdjacentHTML('beforeend',`<button class="nxt-building" data-bid="${b[0]}" style="left:${b[4]}%;top:${b[5]}%" onclick="NexcaTown.tapBuilding('${b[0]}')"><div class="nxt-b-house">${buildingArt(b[0],b[3])}<span class="nxt-b-lv">Lv.${st.level}</span>${st.rewardReady?'<span class="nxt-reward">💗</span>':''}<span class="nxt-b-name">${safe(b[1])}</span></div></button>`);
    });
    Object.values(state.characters).slice(0,4).forEach((c,i)=>board.insertAdjacentHTML('beforeend',`<div class="nxt-char" style="left:${42+i*7}%;top:${68+(i%2)*8}%;animation-delay:${i*.3}s" onclick="NexcaTown.talk('${c.id}')"><div class="nxt-say">${i===0?'次はカフェに行こう！':safe(c.dialogue)}</div>${charArt(c.id,false)}</div>`));
  }
  function renderScreen(v){
    const s=$('#nxt-screen');s.classList.add('on');
    const head=t=>`<div class="nxt-screen-head"><button class="nxt-screen-back" onclick="NexcaTown.nav('town')">←</button><div class="nxt-screen-title">${t}</div></div>`;
    if(v==='chars')s.innerHTML=head('Nexca公式キャラクター')+`<div class="nxt-char-hero"><div>${charArt('neku',false)}</div><div><b>公式キャラはNexca全体で育つ</b><span>参加コード、保存、ミニゲーム、診断結果でEXPが貯まります。ジャンルごとのキャラが街・フィード・報酬演出に登場します。</span></div></div><div class="nxt-grid">${Object.values(state.characters).map(c=>`<div class="nxt-card character"><div class="nxt-card-art">${charArt(c.id,false)}</div><h3>${safe(c.name)} Lv${c.level}</h3><p>${safe(c.dialogue)}<br>${safe(c.skillDescription)}</p><div class="nxt-exp"><i style="width:${Math.min(100,c.exp/(70+c.level*25)*100)}%"></i></div><button class="nxt-play" onclick="NexcaTown.train('${c.id}')">育成する</button></div>`).join('')}</div>`;
    else if(v==='games')s.innerHTML=head('ミニゲーム広場')+`<div class="nxt-game-hero"><b>街を育てる5つのゲーム</b><span>報酬つきプレイは1日3回。古着・カフェ・イベント・運営スキルが街の成長に直結します。</span></div><div class="nxt-grid games">${D().games.map(g=>`<div class="nxt-card game-card" data-game="${g[0]}"><div class="nxt-game-icon">${g[0]==='coord'?'👗':g[0]==='order'?'☕':g[0]==='festival'?'🎪':g[0]==='manager'?'📈':'📣'}</div><h3>${g[1]}</h3><p>${g[2]} / 難易度 ${g[3]}<br>関連キャラ: ${g[4]}<br>報酬: ${g[5]}</p><button class="nxt-play" onclick="NexcaTown.startGame('${g[0]}')">プレイする</button></div>`).join('')}</div>`;
    else if(v==='shop')s.innerHTML=head('ショップ')+`<div class="nxt-grid">${D().shop.map(i=>`<div class="nxt-card"><div class="nxt-big">${i[3]}</div><h3>${i[1]}</h3><p>${i[2]}<br>にぎわい +${i[5]}</p><button class="nxt-play" onclick="NexcaTown.buy('${i[0]}')">⭐ ${i[4]}で購入</button></div>`).join('')}</div>`;
    else if(v==='collection')s.innerHTML=head('コレクション・実績')+collectionHtml();
    else if(v==='code')s.innerHTML=head('参加コードを入力')+codeHtml();
    else if(v==='cards')s.innerHTML=head('体験カード')+cardsHtml();
    else if(activeGame)s.innerHTML=head(activeGame.title)+activeGame.html;
  }
  function collectionHtml(){const rate=Math.min(100,Math.round((state.collections.length+state.experienceCards.length+state.inventory.length)/30*100));return `<div class="nxt-card"><h3>達成率 ${rate}%</h3><div class="nxt-exp"><i style="width:${rate}%"></i></div><p>キャラ、衣装、家具、店舗バッジ、イベントバッジ、体験カードを集めよう。</p></div><div class="nxt-grid" style="margin-top:10px">${['初めての古着コード','初めてのカフェコード','イベント参加','コーデ80点','10コンボ','Sランク','3日連続','7日連続'].map((x,i)=>`<div class="nxt-card"><div class="nxt-big">${state.collections[i]?'🏅':'❔'}</div><h3>${x}</h3><p>${state.collections[i]?'獲得済み':'未獲得'}</p></div>`).join('')}</div>`}
  function codeHtml(){return `<div class="nxt-game-stage"><p style="font-size:12px;color:#637980;line-height:1.7">現地で見た参加コードを入力すると、街・建物・キャラ・体験カードに反映されます。</p><input id="nxt-code" style="width:100%;padding:15px;border:0;border-radius:16px;font-size:20px;letter-spacing:4px;text-align:center;font-weight:1000;text-transform:uppercase" placeholder="CODE"><button class="nxt-play" onclick="NexcaTown.redeem()">送信する</button></div>`}
  function cardsHtml(){return state.experienceCards.length?`<div class="nxt-grid">${state.experienceCards.map(c=>`<div class="nxt-card"><div class="nxt-big">${c.genre==='cafe'?'☕':c.genre==='vintage'?'👗':'🎪'}</div><h3>${safe(c.title)}</h3><p>${safe(c.placeName)}<br>${safe(c.visitedAt)}<br>+${c.pointsEarned}pt / ${safe(c.badgeId)}</p></div>`).join('')}</div>`:'<div class="nxt-card"><h3>まだ体験カードがありません</h3><p>参加コードを入力すると、現実の体験がカードになります。</p></div>'}
  function startGame(type){
    const titles={coord:'コーデチャレンジ',order:'オーダーラッシュ',festival:'フェス準備パズル',manager:'店長シミュレーション',sns:'SNS告知バトル'};
    if(type==='coord')gameState={outfit:{},score:0};
    else if(type==='order')gameState={combo:0,served:0,score:0,order:['ホットコーヒー','静かな席'],done:[]};
    else if(type==='festival')gameState={facility:null};
    else gameState={choice:null};
    activeGame={type,title:titles[type],html:gameHtml(type)};view='game';renderScreen('game');
  }
  function gameHtml(type){
    if(type==='coord'){
      const items=[['tops','デニムジャケット','雨の日+','🧥'],['tops','白シャツ','清潔感+','👔'],['bottoms','黒スラックス','大人っぽさ+','👖'],['shoes','赤スニーカー','差し色+','👟'],['accessory','レトロ帽子','個性+','🧢'],['accessory','革バッグ','カフェ感+','👜']];
      return `<div class="nxt-game-stage visual coord runway-game"><div class="nxt-game-hud"><b>FURUGY RUNWAY</b><span>雨の日カフェコーデ</span><i id="coord-score-pill">SCORE --</i></div><div class="nxt-runway-preview"><div class="nxt-runway-bg"><span></span><span></span><span></span><div class="nxt-audience"></div><div class="nxt-catwalk"><i></i></div><div class="nxt-runway-furugy" id="coord-model">${charArt('furugy',false)}<em id="coord-label">SELECT</em></div></div><div class="nxt-style-score deluxe"><b>JUDGE BOARD</b><strong id="coord-score">--</strong><span id="coord-comment">トップス・ボトムス・シューズ・小物で完成度UP</span><div class="nxt-judge-bars"><p>テーマ <i id="judge-theme" style="--v:20%"></i></p><p>色合わせ <i id="judge-color" style="--v:20%"></i></p><p>個性 <i id="judge-unique" style="--v:20%"></i></p></div></div></div><div class="nxt-closet-title">CLOSET</div><div class="nxt-items closet">${items.map(x=>`<button class="nxt-item fashion" data-cat="${x[0]}" onclick="NexcaTown.pickCoord(this,'${x[0]}','${x[1]}')"><b>${x[3]} ${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div><button class="nxt-play runway" onclick="NexcaTown.finishGame('coord')">ランウェイへ送り出す</button></div>`;
    }
    if(type==='order'){
      const menu=['ホットコーヒー','アイスラテ','静かな席','写真映え席','チーズケーキ','抹茶ラテ'];
      return `<div class="nxt-game-stage visual order"><div class="nxt-game-hud"><b>ORDER RUSH</b><span id="order-text">ホットコーヒー + 静かな席</span><i id="order-combo">COMBO x0</i></div><div class="nxt-cafe-play"><div class="nxt-customer">${charArt('caferu',false)}<p id="order-talk">「落ち着ける席、ありますか？」</p></div><div class="nxt-counter"><span class="cup"></span><span class="seat"></span><span class="cake"></span><b id="order-score">0 pt</b></div></div><div class="nxt-items">${menu.map(x=>`<button class="nxt-item menu" onclick="NexcaTown.pickOrder(this,'${x}')">${x}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('order')">営業終了</button></div>`;
    }
    if(type==='festival')return `<div class="nxt-game-stage visual festival"><div class="nxt-game-hud"><b>FES SETUP</b><span>安全性・満足度・SNS映えを上げよう</span><i>SNS映え +?</i></div><div class="nxt-fes-wrap"><div class="nxt-fes-grid">${Array.from({length:9},(_,i)=>`<button class="nxt-cell" onclick="NexcaTown.placeCell(this)">${i===0?'入口':''}</button>`).join('')}</div><div class="nxt-fes-meter"><b>満足度</b><span style="--v:72%"></span><b>安全性</b><span style="--v:58%"></span><b>SNS映え</b><span style="--v:66%"></span></div></div><div class="nxt-items" style="margin-top:10px">${['ステージ','受付','屋台','休憩所','写真スポット','救護所'].map(x=>`<button class="nxt-item facility" onclick="NexcaTown.pickFacility('${x}')">${x}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('festival')">会場を公開</button></div>`;
    const opts=type==='manager'?['TikTokで体験動画を出す','雨の日限定クーポン','値下げだけをする','何もしない']:['週末の予定まだない人へ。1人でも行ける体験あります。','イベント開催します。ぜひお越しください。','地域活性化のための交流イベントです。','詳細はHPへ。'];
    return `<div class="nxt-game-stage visual sim"><div class="nxt-game-hud"><b>${type==='manager'?'店長シミュレーション':'SNS告知バトル'}</b><span>${type==='manager'?'課題: 予約率が低い':'お題: 高校生に刺さる投稿'}</span><i>判断力</i></div><div class="nxt-sim-board"><div class="nxt-case-card"><b>${type==='manager'?'WEEKLY ISSUE':'POST BATTLE'}</b><p>${type==='manager'?'週末は人が来るが、平日の予約率が落ちています。次の一手を選んでください。':'最初の1秒で「自分ごと」にできる告知文を選んでください。'}</p></div><div class="nxt-reaction"><span>来店</span><i style="--v:42%"></i><span>SNS</span><i style="--v:68%"></i><span>満足</span><i style="--v:55%"></i></div></div><div class="nxt-items">${opts.map((x,i)=>`<button class="nxt-choice" onclick="NexcaTown.selectChoice(this,${i})">${x}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('${type}')">結果を見る</button></div>`;
  }
  function pickCoord(el,cat,name){
    gameState.outfit=gameState.outfit||{};
    gameState.outfit[cat]=name;
    document.querySelectorAll('.nxt-item.fashion[data-cat="'+cat+'"]').forEach(x=>x.classList.remove('sel'));
    el.classList.add('sel');
    const count=Object.keys(gameState.outfit).length;
    const bonus=(gameState.outfit.tops==='デニムジャケット'?18:10)+(gameState.outfit.shoes==='赤スニーカー'?14:8)+(gameState.outfit.accessory?10:0)+(count>=3?22:0);
    gameState.score=Math.min(100,38+bonus);
    const sc=document.getElementById('coord-score'), pill=document.getElementById('coord-score-pill'), cm=document.getElementById('coord-comment'), lb=document.getElementById('coord-label'), model=document.getElementById('coord-model');
    if(sc)sc.textContent=gameState.score;
    if(pill)pill.textContent='SCORE '+gameState.score;
    if(cm)cm.textContent=count>=3?'雨の日カフェにかなり合ってる':'あと'+(3-count)+'カテゴリ選ぼう';
    if(lb)lb.textContent=count>=3?'READY':'SELECT';
    if(model)model.dataset.fit=count>=3?'good':'';
    const theme=document.getElementById('judge-theme'), color=document.getElementById('judge-color'), unique=document.getElementById('judge-unique');
    if(theme)theme.style.setProperty('--v',Math.min(100,40+(gameState.outfit.tops==='デニムジャケット'?35:12)+(gameState.outfit.accessory==='革バッグ'?15:0))+'%');
    if(color)color.style.setProperty('--v',Math.min(100,35+(gameState.outfit.shoes==='赤スニーカー'?30:10)+(gameState.outfit.bottoms?20:0))+'%');
    if(unique)unique.style.setProperty('--v',Math.min(100,30+(gameState.outfit.accessory==='レトロ帽子'?38:16)+(count>=4?18:0))+'%');
  }
  function pickOrder(el,name){
    gameState.order=gameState.order||['ホットコーヒー','静かな席'];gameState.done=gameState.done||[];
    const ok=gameState.order.includes(name)&&!gameState.done.includes(name);
    el.classList.add(ok?'ok':'bad');
    setTimeout(()=>el.classList.remove('ok','bad'),420);
    if(ok){gameState.done.push(name);gameState.combo=(gameState.combo||0)+1;gameState.score=(gameState.score||0)+120+gameState.combo*25;}else{gameState.combo=0;gameState.score=Math.max(0,(gameState.score||0)-45);}
    if(gameState.done.length>=gameState.order.length){gameState.served=(gameState.served||0)+1;gameState.done=[];const next=[['アイスラテ','写真映え席'],['チーズケーキ','抹茶ラテ'],['ホットコーヒー','静かな席']][gameState.served%3];gameState.order=next;}
    const txt=document.getElementById('order-text'), combo=document.getElementById('order-combo'), score=document.getElementById('order-score'), talk=document.getElementById('order-talk');
    if(txt)txt.textContent=gameState.order.join(' + ');
    if(combo)combo.textContent='COMBO x'+(gameState.combo||0);
    if(score)score.textContent=(gameState.score||0)+' pt';
    if(talk)talk.textContent=ok?'「ありがとう、完璧！」':'「あれ、注文と違うかも…」';
  }
  function selectChoice(el,i){document.querySelectorAll('.nxt-choice').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');gameState.choice=i}
  function pickFacility(x){gameState.facility=x}
  function placeCell(el){if(!gameState.facility)return;el.textContent=gameState.facility==='ステージ'?'🎤':gameState.facility==='受付'?'🧾':gameState.facility==='屋台'?'🍜':gameState.facility==='休憩所'?'🪑':gameState.facility==='写真スポット'?'📸':'🏥';el.classList.add('filled')}
  function finishGame(type){
    const score=type==='coord'?(gameState.score||55):type==='order'?Math.min(100,Math.round((gameState.score||0)/8)):type==='festival'?70+document.querySelectorAll('.nxt-cell.filled').length*4:type==='manager'||type==='sns'?(gameState.choice===0?92:gameState.choice===1?76:38):65+Math.floor(Math.random()*31);
    const rank=score>=90?'S':score>=75?'A':score>=60?'B':'C', genre=type==='coord'?'vintage':type==='order'?'cafe':type==='festival'?'event':'plaza';
    if(type==='coord'){runCoordShow(score,rank);return;}
    state.totalMiniGamesPlayed++;progress('playMiniGame');grantPoints(20+Math.floor(score/10),'ミニゲーム報酬');addPlayerExp(25);addBuildingExp(genre,35);addCharExp(type==='coord'?'furugy':type==='order'?'caferu':type==='festival'?'eventy':'neku',30);state.townPopularity+=Math.floor(score/10);state.collections.push(type+'-'+rank);save();reward(rank+' RANK',`スコア ${score}。${genre==='vintage'?'古着ストリート':genre==='cafe'?'カフェ通り':genre==='event'?'イベント広場':'中央広場'}EXPが増えました。`,'🎮');nav('games');
  }
  function runCoordShow(score,rank){
    const outfit=Object.values(gameState.outfit||{}).join(' / ')||'未完成コーデ';
    let ov=$('#nxt-runway-show');if(!ov){ov=document.createElement('div');ov.id='nxt-runway-show';ov.className='nxt-runway-show';document.body.appendChild(ov);}
    ov.innerHTML=`<div class="runway-lights"><i></i><i></i><i></i></div><div class="runway-stage"><div class="runway-title">FURUGY RUNWAY</div><div class="runway-crowd"></div><div class="runway-road"></div><div class="runway-star">${charArt('furugy',false)}<span>${safe(outfit)}</span></div><div class="runway-score"><b>JUDGE SCORE</b><strong>${score}</strong><em>${rank} RANK</em><p>${score>=90?'街中が振り返る伝説コーデ。':score>=75?'テーマも個性も光る、かなり良いコーデ。':score>=60?'まとまりはある。あと一手で化ける。':'まだ伸びしろあり。カテゴリをそろえよう。'}</p><button onclick="NexcaTown.completeCoordRunway(${score},'${rank}')">報酬を受け取る</button></div></div>`;
    ov.classList.add('on');
  }
  function completeCoordRunway(score,rank){
    const ov=$('#nxt-runway-show');if(ov)ov.classList.remove('on');
    state.totalMiniGamesPlayed++;progress('playMiniGame');grantPoints(20+Math.floor(score/10),'コーデチャレンジ報酬');addPlayerExp(25);addBuildingExp('vintage',35);addCharExp('furugy',42);state.townPopularity+=Math.floor(score/8);state.collections.push('coord-'+rank);save();reward(rank+' RANK',`フルギーがランウェイを歩いた！スコア ${score}。古着ストリートEXPとフルギーEXPが増えました。`,'👗');nav('games');
  }
  function claimQuest(id){const q=state.dailyQuests.find(x=>x.questId===id);if(!q||!q.isCompleted||q.isClaimed)return;q.isClaimed=true;grantPoints(q.rewardPoints,'デイリークエスト');addPlayerExp(q.rewardExp);save();reward('クエスト達成',q.title+' の報酬を受け取りました。','✅');render();}
  function claimAll(){
    let claimed=0,pts=0,exp=0;
    state.dailyQuests.forEach(q=>{if(q.isCompleted&&!q.isClaimed){q.isClaimed=true;claimed++;pts+=q.rewardPoints;exp+=q.rewardExp;}});
    if(!claimed){reward('まだ受け取れません','達成したクエストがあると一括で受け取れます。','📜');return;}
    grantPoints(pts,'デイリークエスト一括報酬');addPlayerExp(exp);save();reward('まとめて受け取り',claimed+'件のクエスト報酬を受け取りました。','🎁');render();
  }
  function loginBonus(){if(state.claimedLoginBonus===today()){reward('受け取り済み','明日はもっといい報酬が待っています。','🎁');return;}state.claimedLoginBonus=today();state.gems+=state.loginStreak%7===0?5:1;grantPoints(state.loginStreak%7===0?120:30,'ログインボーナス');save();reward('ログインボーナス',`${state.loginStreak}日連続。ポイントとジェムを獲得しました。`,'🎁');render()}
  function tapBuilding(id){const b=state.buildings[id];if(!b)return;if(b.rewardReady){b.rewardReady=false;b.lastRewardCollectedAt=new Date().toISOString();grantPoints(10+b.level*3,b.name+'報酬');addPlayerExp(8);progress('collectReward');save();reward('建物報酬',b.name+'から報酬を回収しました。','⭐');render();}else reward(b.name,'Lv'+b.level+' / EXP '+b.exp+'。ミニゲームや参加コードで育ちます。',D().buildings.find(x=>x[0]===id)?.[3]||'🏠')}
  function talk(id){const c=state.characters[id];if(!c)return;progress('talkChar');addCharExp(id,8);save();reward(c.name,c.dialogue+' EXP+8',id==='neku'?'🌟':id==='furugy'?'🧵':id==='caferu'?'☕':'🎪');render()}
  function train(id){if(state.points<30){reward('ポイント不足','育成には30pt必要です。','💤');return;}state.points-=30;if(typeof window.usePt==='function')try{window.usePt(30,'Nexca Town 育成')}catch(e){}addCharExp(id,35);save();renderScreen('chars')}
  function buy(id){const item=D().shop.find(x=>x[0]===id);if(!item)return;if(state.points<item[4]){reward('ポイント不足','ショップ購入にはポイントが必要です。','💤');return;}state.points-=item[4];state.inventory.push({itemId:id,category:item[2],genre:item[2],rarity:item[4]>170?'R':'N',obtainedAt:new Date().toISOString()});state.townPopularity+=item[5];if(typeof window.usePt==='function')try{window.usePt(item[4],item[1]+'購入')}catch(e){}save();reward('購入完了',item[1]+'を街に追加しました。','🛍️');renderScreen('shop')}
  function redeem(){
    const code=String($('#nxt-code')?.value||'').trim().toUpperCase();if(!code){reward('コード未入力','参加コードを入力してください。','⌨️');return;}
    const ev=(window.EVS||[]).find(e=>String(e.qr||e.participation_code||'').toUpperCase()===code);
    if(!ev){reward('コードが違います','コードをもう一度確認してください。','⚠️');return;}
    const key='redeem-'+code;if(localStorage.getItem(key)){reward('すでに使用済みです','この参加コードは1回だけ使えます。','✅');return;}
    localStorage.setItem(key,'1');const genre=ev.g==='vintage'||ev.genre==='vintage'?'vintage':ev.g==='cafe'||ev.genre==='cafe'?'cafe':'event';
    state.totalParticipationCodesRedeemed++;state.totalExperienceCards++;grantPoints(100,'参加コード報酬');addPlayerExp(80);addBuildingExp(genre,90);addCharExp(genre==='vintage'?'furugy':genre==='cafe'?'caferu':'eventy',70);state.townPopularity+=25;state.collections.push('code-'+genre);
    state.experienceCards.unshift({genre,title:ev.title||'Nexca体験',placeName:ev.loc||'',eventName:ev.title||'',visitedAt:today(),pointsEarned:100,expEarned:80,badgeId:(genre==='vintage'?'古着':genre==='cafe'?'カフェ':'イベント')+'初参加バッジ',createdAt:new Date().toISOString()});
    try{if(window.user&&window.sb)sb.from('participation_code_redemptions').insert({user_id:user.id,code,genre,points_awarded:100,player_exp_awarded:80,building_exp_awarded:90,character_exp_awarded:70,redeemed_at:new Date().toISOString()}).then(()=>{});}catch(e){}
    save();reward('体験カード生成',`${ev.title||'Nexca体験'} の記録が街に刻まれました。`,'💌');nav('cards');
  }
  window.NexcaTown={open,close,nav,loginBonus,claimQuest,claimAll,tapBuilding,talk,train,buy,startGame,finishGame,completeCoordRunway,pickCoord,pickOrder,selectChoice,pickFacility,placeCell,redeem};
  window.openTown=open; window.closeTown=close;
  window.addEventListener('DOMContentLoaded',()=>{load();document.querySelectorAll('[onclick="openTown()"]').forEach(card=>{card.innerHTML=card.innerHTML.replace(/<div style="font-family:[^>]+>[^<]+<\/div>/,'<div style="font-family:var(--font-en);font-size:16px;letter-spacing:1px;margin-bottom:3px;">NEXCA TOWN</div>').replace('キャラを集めて街を育てよう','まだ知らない体験が、次の自分を連れてくる。').replace('現実で遊ぶほど育つ、街づくりゲーム','まだ知らない体験が、次の自分を連れてくる。');});document.querySelectorAll('.town-hd-title').forEach(e=>e.textContent='NEXCA TOWN');});
})();
