(function(){
  'use strict';

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const data = () => window.NEXCA_TOWN_DATA || {buildings:[],characters:[],games:[],shop:[],quests:[],codes:{}};
  const today = () => new Date().toISOString().slice(0,10);
  const safe = v => String(v == null ? '' : v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let state = null;
  let view = 'town';
  let activeGame = null;
  let g = {};

  function freshState(){
    const buildings = {};
    data().buildings.forEach(b => buildings[b.id] = {
      buildingId:b.id,name:b.jp,genre:b.genre,level:b.level||1,exp:b.exp||0,visualStage:1,
      rewardReady:!!b.rewardReady,lastRewardCollectedAt:null
    });
    const characters = {};
    data().characters.forEach((c,i) => characters[c.id] = {
      id:c.id,name:c.name,type:c.type,rarity:c.rarity,level:1,exp:0,
      skillName:c.skillName,skillDescription:c.skillDescription,dialogue:c.dialogue,
      costume:'default',isMain:i===0,strongGame:c.strongGame,color:c.color
    });
    return {
      playerLevel:1,playerExp:0,points:0,gems:0,townPopularity:0,townRank:1,loginStreak:1,lastLoginDate:null,
      totalMiniGamesPlayed:0,totalParticipationCodesRedeemed:0,totalExperienceCards:0,
      buildings,characters,inventory:[],collections:[],experienceCards:[],dailyQuests:[],
      miniGamePlays:{},claimedLoginBonus:null,seenCodes:{}
    };
  }
  function load(){
    try{state=Object.assign(freshState(),JSON.parse(localStorage.getItem('nexca_town_state')||'{}'));}catch(e){state=freshState();}
    const base=freshState();
    state.buildings=Object.assign(base.buildings,state.buildings||{});
    state.characters=Object.assign(base.characters,state.characters||{});
    state.inventory=state.inventory||[];
    state.collections=state.collections||[];
    state.experienceCards=state.experienceCards||[];
    state.seenCodes=state.seenCodes||{};
    syncPoints();
    resetDaily();
    return state;
  }
  function save(){
    syncPoints();
    localStorage.setItem('nexca_town_state',JSON.stringify(state));
    try{
      localStorage.setItem('nx_town_data',JSON.stringify({nexcaTown:state,items:state.inventory,chars:Object.values(state.characters).map((c,i)=>({key:c.name,x:35+i*8,y:60+i%2*7}))}));
    }catch(e){}
    if(window.user&&window.sb){
      try{
        window.sb.from('profiles').upsert({user_id:window.user.id,town_data:{nexcaTown:state},total_points:Math.floor(window.pts||state.points||0),updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(()=>{});
      }catch(e){}
    }
  }
  function syncPoints(){
    if(typeof window.pts==='number') state.points=Math.max(state.points||0,Math.floor(window.pts));
  }
  function grantPoints(n,label){
    state.points=(state.points||0)+n;
    if(typeof window.addPt==='function') window.addPt(label||'NEXCA TOWN',n,false);
    else if(typeof window.pts==='number') window.pts+=n;
  }
  function usePoints(n,label){
    if(state.points<n) return false;
    state.points-=n;
    if(typeof window.usePt==='function'){try{window.usePt(n,label||'NEXCA TOWN');}catch(e){}}
    return true;
  }
  function resetDaily(){
    if(state.dailyDate===today() && (state.dailyQuests||[]).length===data().quests.length) return;
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    state.loginStreak=state.lastLoginDate===yesterday.toISOString().slice(0,10)?(state.loginStreak||0)+1:1;
    state.lastLoginDate=today();
    state.dailyDate=today();
    state.dailyQuests=data().quests.map(q=>({
      questId:q.id,title:q.title,targetAction:q.action,targetCount:q.target,currentCount:q.action==='openTown'?1:0,
      rewardPoints:q.rewardPoints,rewardExp:q.rewardExp,isCompleted:q.action==='openTown',isClaimed:false,date:today()
    }));
  }
  function progress(action,n=1){
    state.dailyQuests.forEach(q=>{
      if(q.targetAction===action&&!q.isClaimed){
        q.currentCount=Math.min(q.targetCount,q.currentCount+n);
        q.isCompleted=q.currentCount>=q.targetCount;
      }
    });
  }
  function expNeed(lv){return 100+lv*42;}
  function addPlayerExp(n){
    state.playerExp+=n;
    let level=false;
    while(state.playerExp>=expNeed(state.playerLevel)){
      state.playerExp-=expNeed(state.playerLevel);
      state.playerLevel++;
      state.gems+=2;
      state.townPopularity+=6;
      grantPoints(40,'NEXCA TOWN レベルアップ');
      level=true;
    }
    if(level) rewardBurst('LEVEL UP','プレイヤーLv.'+state.playerLevel+'。街に新しいにぎわいが生まれた。','level');
  }
  function addBuildingExp(id,n){
    const b=state.buildings[id]||state.buildings.plaza;
    b.exp+=n;
    let up=false;
    while(b.exp>=80+b.level*34){
      b.exp-=80+b.level*34;
      b.level++;
      b.visualStage=Math.min(4,1+Math.floor(b.level/2));
      b.rewardReady=true;
      state.townPopularity+=10;
      up=true;
    }
    if(up) rewardBurst('BUILDING LEVEL UP',b.name+' がLv.'+b.level+'に成長。報酬量も上がった。','building');
  }
  function addCharExp(id,n){
    const c=state.characters[id]||state.characters.neku;
    c.exp+=n;
    let up=false;
    while(c.exp>=70+c.level*28){
      c.exp-=70+c.level*28;
      c.level++;
      up=true;
    }
    if(up) rewardBurst('CHARACTER LEVEL UP',c.name+' がLv.'+c.level+'に成長。スキルの存在感が増した。','char');
  }
  function charForGenre(genre){return genre==='vintage'?'furugy':genre==='cafe'?'caferu':genre==='event'?'eventy':'neku';}
  function buildingForGenre(genre){return genre==='vintage'?'vintage':genre==='cafe'?'cafe':genre==='event'?'event':'plaza';}
  function rewardBurst(title,sub,type='reward'){
    let ov=$('#nxt-reward');
    if(!ov){ov=document.createElement('div');ov.id='nxt-reward';ov.className='nxt-overlay';document.body.appendChild(ov);}
    const icon=type==='level'?'LV':type==='building'?'UP':type==='char'?'EXP':'GET';
    ov.innerHTML=`<div class="nxt-reward-box premium ${safe(type)}"><div class="nxt-confetti">${Array.from({length:24},(_,i)=>`<i style="--d:${i%8};--x:${(i*37)%100}%"></i>`).join('')}</div><div class="nxt-reward-em">${icon}</div><div class="nxt-reward-title">${safe(title)}</div><div class="nxt-reward-sub">${safe(sub)}</div><button class="nxt-close" onclick="document.getElementById('nxt-reward').classList.remove('on')">受け取る</button></div>`;
    ov.classList.add('on');
  }

  function open(){load();mount();render();progress('openTown');save();}
  function close(){const ov=$('#town-ov');if(ov)ov.style.display='none';}
  function mount(){
    const ov=$('#town-ov'); if(!ov) return;
    ov.className='nx-town premium-town';
    ov.style.display='flex';
    ov.innerHTML=`<div class="nxt-shell premium-shell">
      <div class="nxt-top premium-top">
        <button class="nxt-back" onclick="NexcaTown.close()">←</button>
        <div class="nxt-title premium-title"><span class="nxt-logo-mark"><i></i><b></b><em></em></span><span class="nxt-logo-text">Nexca</span><strong>NEXCA TOWN</strong><small>現実の体験で、君の街が育つ</small></div>
        <div class="nxt-stats" id="nxt-stats"></div>
        <div class="nxt-top-actions"><button onclick="NexcaTown.loginBonus()">🎁<span>LOGIN</span></button><button onclick="NexcaTown.notice()">🔔<span>NEWS</span></button></div>
      </div>
      <main class="nxt-main premium-main"><div class="nxt-board premium-board" id="nxt-board"></div></main>
      <nav class="nxt-bottom premium-bottom" id="nxt-tabs"></nav>
      <section class="nxt-screen premium-screen" id="nxt-screen"></section>
    </div>`;
  }
  function render(){
    const need=expNeed(state.playerLevel);
    $('#nxt-stats').innerHTML=`<div class="nxt-stat-badge hero"><b>Lv.${state.playerLevel}</b><span>${state.playerExp}/${need}</span><i style="width:${Math.min(100,state.playerExp/need*100)}%"></i></div><div class="nxt-pill">pt ${Math.floor(state.points)}</div><div class="nxt-pill">💎 ${state.gems}</div><div class="nxt-pill">にぎわい ${state.townPopularity}</div><div class="nxt-pill">${state.loginStreak}日連続</div>`;
    $('#nxt-tabs').innerHTML=[
      ['town','タウン','🗺'],['chars','キャラ','☺'],['games','ミニゲーム','▶'],['shop','ショップ','袋'],['collection','実績','🏆']
    ].map(t=>`<button class="nxt-tab ${view===t[0]?'on':''}" onclick="NexcaTown.nav('${t[0]}')"><div>${t[2]}</div>${t[1]}</button>`).join('');
    view==='town'?renderTown():renderScreen(view);
  }
  function nav(v){view=v;activeGame=null;render();}

  function charArt(id,mini=false){
    const c=state?.characters?.[id]||data().characters.find(x=>x.id===id)||{};
    return `<span class="nxt-avatar ${mini?'mini':''} char-${safe(id)}" title="${safe(c.name)}"><i></i><b></b><em></em><u></u></span>`;
  }
  function buildingCard(b){
    const st=state.buildings[b.id]||{};
    return `<button class="nxt-building premium-building ${safe(b.genre)}" data-bid="${safe(b.id)}" style="left:${b.x}%;top:${b.y}%" onclick="NexcaTown.tapBuilding('${safe(b.id)}')">
      <div class="nxt-b-house"><span class="nxt-b-roof"></span><span class="nxt-b-wall"><i></i><b></b><em></em></span><span class="nxt-b-sign">${safe(b.icon)}</span><span class="nxt-b-lv">Lv.${st.level||1}</span>${st.rewardReady?'<span class="nxt-reward">GET</span>':''}<span class="nxt-b-name">${safe(b.jp)}</span><small>${safe(b.copy)}</small></div>
    </button>`;
  }
  function cityBg(){
    return `<svg class="nxt-city-art premium-city" viewBox="0 0 1100 720" aria-hidden="true">
      <defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7fdcff"/><stop offset="1" stop-color="#258bb9"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bdf28b"/><stop offset="1" stop-color="#59b95b"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe4a0"/><stop offset="1" stop-color="#c48942"/></linearGradient></defs>
      <rect width="1100" height="720" fill="url(#w)"/>
      ${Array.from({length:20},(_,i)=>`<path d="M${-100+i*70} ${130+i%5*35} C${-40+i*70} ${112+i%5*35} ${30+i*70} ${150+i%5*35} ${90+i*70} ${125+i%5*35}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="7" stroke-linecap="round"/>`).join('')}
      <g opacity=".5">${Array.from({length:26},(_,i)=>`<rect x="${36+i*42}" y="${70+(i%4)*12}" width="25" height="${46+(i%5)*9}" rx="4" fill="#7f9dac"/><rect x="${42+i*42}" y="${82+(i%4)*12}" width="5" height="5" fill="#fff3a6"/>`).join('')}</g>
      <path d="M143 207 C277 123 441 151 548 184 C705 104 929 202 958 365 C1028 469 886 633 690 604 C546 699 330 636 235 579 C76 568 24 435 82 318 C90 266 112 230 143 207Z" fill="url(#s)"/>
      <path d="M162 222 C288 157 436 181 548 207 C685 146 882 219 914 364 C970 448 842 574 676 558 C542 636 352 583 251 532 C119 531 70 424 114 326 C121 276 135 243 162 222Z" fill="url(#g)"/>
      <path d="M192 514 C296 416 420 365 530 319 C628 280 760 233 897 213" fill="none" stroke="#b97a35" stroke-width="46" stroke-linecap="round"/><path d="M192 514 C296 416 420 365 530 319 C628 280 760 233 897 213" fill="none" stroke="#f6d798" stroke-width="30" stroke-linecap="round"/>
      <path d="M330 230 C392 316 482 390 585 458 C646 498 721 540 805 592" fill="none" stroke="#b97a35" stroke-width="42" stroke-linecap="round"/><path d="M330 230 C392 316 482 390 585 458 C646 498 721 540 805 592" fill="none" stroke="#f6d798" stroke-width="27" stroke-linecap="round"/>
      <circle cx="548" cy="385" r="75" fill="#dbab62"/><circle cx="548" cy="385" r="61" fill="#ffe5a8"/><circle cx="548" cy="372" r="34" fill="#75ddff"/><circle cx="548" cy="372" r="21" fill="#2e97cf"/>
      ${Array.from({length:82},(_,i)=>`<g transform="translate(${120+(i*83)%850} ${215+(i*47)%390})"><circle r="${7+i%4}" fill="${i%2?'#3f9e54':'#65bf68'}"/><rect x="-2" y="4" width="4" height="12" fill="#8b5a2b"/></g>`).join('')}
      ${Array.from({length:52},(_,i)=>`<circle cx="${150+(i*97)%810}" cy="${245+(i*41)%350}" r="${3+i%3}" fill="${['#ff7ba4','#fff0a8','#fff','#ffc65c'][i%4]}"/>`).join('')}
    </svg>`;
  }
  function renderTown(){
    const board=$('#nxt-board'); if(!board) return;
    const screen=$('#nxt-screen'); if(screen) screen.classList.remove('on');
    const main=Object.values(state.characters).find(c=>c.isMain)||state.characters.neku;
    const cards=state.experienceCards.length;
    board.innerHTML=`${cityBg()}
      <div class="nxt-plaza premium-plaza"></div>
      <div class="nxt-quest premium-quest"><div class="nxt-panel-title">今日のクエスト <span>更新まで 12:34:56</span></div>${state.dailyQuests.slice(0,5).map((q,i)=>`<div class="nxt-q ${q.isCompleted?'done':''}"><div class="nxt-q-medal">${i+1}</div><div><div class="nxt-q-t">${safe(q.title)}</div><div class="nxt-bar"><i style="width:${Math.round(q.currentCount/q.targetCount*100)}%"></i></div><small>${q.currentCount}/${q.targetCount}</small></div><button class="nxt-claim" onclick="NexcaTown.claimQuest('${q.questId}')" ${!q.isCompleted||q.isClaimed?'disabled':''}>${q.isClaimed?'済':q.rewardPoints+'pt'}</button></div>`).join('')}<button class="nxt-claim all" onclick="NexcaTown.claimAll()">すべて受け取る</button></div>
      <div class="nxt-side premium-side"><button class="nxt-code-cta" onclick="NexcaTown.nav('code')"><b>参加コードを入力</b><span>街・建物・キャラが一気に成長</span></button><button class="nxt-side-card" onclick="NexcaTown.nav('cards')">体験カード <b>${cards}枚</b></button><button class="nxt-side-card strong" onclick="NexcaTown.nav('games')">ミニゲーム広場 <b>PLAY</b></button></div>
      <button class="nxt-game-dock premium-dock" onclick="NexcaTown.nav('games')"><span>MINI GAME PLAZA</span><b>ランウェイ・カフェ接客・フェス設計で街を育てる</b><i>PLAY</i></button>
      <div class="nxt-official-panel"><div class="nxt-panel-title">Nexca公式キャラクター</div><div class="nxt-official-row">${Object.values(state.characters).map(c=>`<button onclick="NexcaTown.nav('chars')">${charArt(c.id,true)}<span>${safe(c.name)}<small>Lv.${c.level}</small></span></button>`).join('')}</div></div>
      <div class="nxt-memory-panel" onclick="NexcaTown.nav('collection')"><b>実績</b><strong>${Math.min(100,Math.round((state.collections.length+state.inventory.length+cards)/35*100))}%</strong><span>バッジと体験カード</span></div>
      <div class="nxt-guide premium-guide">${charArt(main.id,true)}<p>${safe(main.dialogue)}<br><b>${safe(main.skillDescription)}</b></p></div>
      <div class="nxt-locked cloud-a">LOCKED<br>Lv.20</div><div class="nxt-locked cloud-b">LOCKED<br>Lv.30</div>
      <div class="nxt-town-decor tram"></div><div class="nxt-town-decor bridge"></div><div class="nxt-town-decor torii"></div><div class="nxt-town-decor build"><b>建設中</b><span>次の街区</span></div>
      ${data().buildings.map(buildingCard).join('')}
      ${Object.values(state.characters).map((c,i)=>`<button class="nxt-char premium-char" style="left:${43+i*7}%;top:${63+(i%2)*8}%" onclick="NexcaTown.talk('${c.id}')"><span class="nxt-say">${safe(i===0?'今日はどこに行く？':c.dialogue)}</span>${charArt(c.id,false)}</button>`).join('')}`;
  }

  function renderScreen(v){
    const s=$('#nxt-screen'); s.classList.add('on');
    const head=t=>`<div class="nxt-screen-head"><button class="nxt-screen-back" onclick="NexcaTown.nav('town')">←</button><div class="nxt-screen-title">${safe(t)}</div></div>`;
    if(v==='chars') s.innerHTML=head('Nexca公式キャラクター')+charsHtml();
    else if(v==='games') s.innerHTML=head('ミニゲーム広場')+gamesHtml();
    else if(v==='shop') s.innerHTML=head('ショップ')+shopHtml();
    else if(v==='collection') s.innerHTML=head('実績・コレクション')+collectionHtml();
    else if(v==='code') s.innerHTML=head('参加コードを入力')+codeHtml();
    else if(v==='cards') s.innerHTML=head('体験カード')+cardsHtml();
    else if(activeGame) s.innerHTML=head(activeGame.title)+activeGame.html;
  }
  function charsHtml(){
    return `<div class="nxt-char-hero premium-card">${charArt('neku',false)}<div><b>公式キャラクターはNexca全体で育つ</b><span>参加コード、ミニゲーム、保存行動でEXPを獲得。メイン設定したキャラはタウンと演出に登場します。</span></div></div><div class="nxt-grid">${Object.values(state.characters).map(c=>`<div class="nxt-card character premium-card"><div class="nxt-card-art">${charArt(c.id,false)}</div><h3>${safe(c.name)} <em>${safe(c.rarity)}</em> Lv.${c.level}</h3><p>${safe(c.dialogue)}<br>${safe(c.skillName)}: ${safe(c.skillDescription)}<br>得意: ${safe(c.strongGame)}</p><div class="nxt-exp"><i style="width:${Math.min(100,c.exp/(70+c.level*28)*100)}%"></i></div><button class="nxt-play" onclick="NexcaTown.train('${c.id}')">EXPをあげる</button><button class="nxt-subbtn" onclick="NexcaTown.mainChar('${c.id}')">${c.isMain?'メイン中':'メイン設定'}</button></div>`).join('')}</div>`;
  }
  function gamesHtml(){
    return `<div class="nxt-game-hero premium-card"><b>街が育つミニゲーム広場</b><span>報酬つきプレイは1日3回想定。今は遊べる形を優先し、スコアが建物EXP・キャラEXP・にぎわいに反映されます。</span></div><div class="nxt-grid games premium-games">${data().games.map(gameCard).join('')}</div>`;
  }
  function gameCard(game){
    const icon={coord:'👗',hunt:'🔎',order:'☕',layout:'🪑',festival:'🎪',booth:'🧰',manager:'📈',sns:'📣'}[game.id]||'▶';
    return `<div class="nxt-card game-card premium-game-card" data-game="${safe(game.id)}"><div class="nxt-game-icon">${icon}</div><h3>${safe(game.name)}</h3><b>${safe(game.hero)}</b><p>${safe(game.genre)} / 難易度 ${safe(game.difficulty)}<br>${safe(game.desc)}<br>報酬: ${safe(game.rewards)}<br>関連キャラ: ${safe(game.char)}</p><button class="nxt-play" onclick="NexcaTown.startGame('${safe(game.id)}')">プレイする</button></div>`;
  }
  function shopHtml(){
    return `<div class="nxt-shop-hero premium-card"><b>街の見た目を育てるショップ</b><span>購入すると、所持アイテムとにぎわいが増えます。</span></div><div class="nxt-grid">${data().shop.map(i=>`<div class="nxt-card shop premium-card"><div class="nxt-shop-icon">${safe(i.icon)}</div><h3>${safe(i.name)}</h3><p>${safe(i.category)}<br>にぎわい +${i.popularity}</p><button class="nxt-play" onclick="NexcaTown.buy('${safe(i.id)}')">${i.cost}ptで購入</button></div>`).join('')}</div>`;
  }
  function collectionHtml(){
    const rate=Math.min(100,Math.round((state.collections.length+state.experienceCards.length+state.inventory.length)/35*100));
    const badges=['初めての古着コード','初めてのカフェコード','イベント参加','コーデ80点','オーダー10コンボ','フェスSランク','3日連続ログイン','7日連続ログイン'];
    return `<div class="nxt-card premium-card collection-head"><h3>達成率 ${rate}%</h3><div class="nxt-exp"><i style="width:${rate}%"></i></div><p>キャラ図鑑、バッジ、体験カード、衣装、家具、ミニゲーム実績。</p></div><div class="nxt-grid">${badges.map((x,i)=>`<div class="nxt-card premium-card achievement ${state.collections[i]?'got':''}"><div class="nxt-big">${state.collections[i]?'🏅':'?'}</div><h3>${safe(x)}</h3><p>${state.collections[i]?'獲得済み':'未獲得。街で遊ぶと開放。'}</p></div>`).join('')}</div>`;
  }
  function codeHtml(){
    return `<div class="nxt-code-screen premium-card"><div class="nxt-code-visual">現実で遊ぶほど<br><b>街が一気に育つ</b></div><p>仮コード: <b>VINTAGE50</b> / <b>CAFE50</b> / <b>EVENT100</b></p><input id="nxt-code" placeholder="参加コード" autocomplete="off"><button class="nxt-play" onclick="NexcaTown.redeem()">コードを送信</button><small>成功するとポイント、プレイヤーEXP、建物EXP、キャラEXP、体験カード、クエスト進捗が更新されます。</small></div>`;
  }
  function cardsHtml(){
    if(!state.experienceCards.length) return `<div class="nxt-card premium-card"><h3>まだ体験カードがありません</h3><p>参加コードを入力すると、現実の体験が思い出カードになります。</p></div>`;
    return `<div class="nxt-grid cards">${state.experienceCards.map(c=>`<div class="nxt-card premium-card memory-card ${safe(c.genre)}"><div class="photo-frame">${c.genre==='vintage'?'👗':c.genre==='cafe'?'☕':'🎪'}</div><h3>${safe(c.title)}</h3><p>${safe(c.placeName)} / ${safe(c.visitedAt)}<br>+${c.pointsEarned}pt / ${safe(c.badgeId)}<br>成長: ${safe(c.buildingName)}・${safe(c.charName)}</p><textarea placeholder="メモを書く"></textarea></div>`).join('')}</div>`;
  }

  function startGame(type){
    const game=data().games.find(x=>x.id===type)||{name:'ミニゲーム'};
    g={type,score:0,combo:0,selected:{},placed:[],choice:null,timer:30};
    activeGame={type,title:game.name,html:gameHtml(type)};
    view='game';
    renderScreen('game');
  }
  function gameHtml(type){
    if(type==='coord') return coordHtml();
    if(type==='order') return orderHtml();
    if(type==='festival') return festivalHtml();
    if(type==='hunt') return simpleArcadeHtml('VINTAGE HUNT','レアタグを3つ見つけろ',['90sタグ','シルクシャツ','一点物ジャケット','量産T','破れすぎデニム','レア刺繍'],type);
    if(type==='layout') return simpleArcadeHtml('CAFE LAYOUT','映えとくつろぎを両立しろ',['窓際席','レジ','観葉植物','丸テーブル','通路ふさぎ','照明'],type);
    if(type==='booth') return simpleArcadeHtml('BOOTH MANAGER','順番と材料を切らすな',['受付整理','材料補充','写真案内','説明短縮','列放置','休憩なし'],type);
    return simHtml(type);
  }
  function coordHtml(){
    const items=[['tops','デニムジャケット','雨の日テーマ+','🧥'],['tops','白シャツ','清潔感+','👔'],['bottoms','黒スラックス','大人っぽさ+','👖'],['bottoms','ワイドデニム','古着感+','👖'],['shoes','赤スニーカー','差し色+','👟'],['shoes','革靴','カフェ感+','👞'],['accessory','レトロ帽子','個性+','🧢'],['accessory','革バッグ','まとまり+','👜']];
    return `<div class="nxt-game-stage visual coord runway-game deluxe-runway"><div class="nxt-game-hud"><b>FURUGY RUNWAY</b><span>お題: 雨の日カフェコーデ</span><i id="coord-score-pill">SCORE --</i></div><div class="nxt-runway-preview"><div class="nxt-runway-bg"><span></span><span></span><span></span><div class="nxt-audience"></div><div class="nxt-catwalk"><i></i></div><div class="nxt-runway-furugy" id="coord-model">${charArt('furugy')}<em id="coord-label">SELECT</em><div id="coord-wear" class="coord-wear"></div></div></div><div class="nxt-style-score deluxe"><b>JUDGE BOARD</b><strong id="coord-score">--</strong><span id="coord-comment">4カテゴリをそろえるとランウェイ解放</span><div class="nxt-judge-bars"><p>テーマ <i id="judge-theme" style="--v:20%"></i></p><p>色合わせ <i id="judge-color" style="--v:20%"></i></p><p>個性 <i id="judge-unique" style="--v:20%"></i></p><p>季節感 <i id="judge-season" style="--v:20%"></i></p></div></div></div><div class="nxt-closet-title">CLOSET</div><div class="nxt-items closet">${items.map(x=>`<button class="nxt-item fashion" data-cat="${x[0]}" onclick="NexcaTown.pickCoord(this,'${x[0]}','${x[1]}')"><b>${x[3]} ${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div><button class="nxt-play runway" onclick="NexcaTown.finishGame('coord')">ランウェイへ送り出す</button></div>`;
  }
  function orderHtml(){
    const menu=['ホットコーヒー','アイスラテ','静かな席','写真映え席','チーズケーキ','抹茶ラテ','友達席','窓際席'];
    return `<div class="nxt-game-stage visual order deluxe-order"><div class="nxt-game-hud"><b>ORDER RUSH</b><span id="order-text">ホットコーヒー + 静かな席</span><i id="order-combo">COMBO x0</i></div><div class="nxt-cafe-play"><div class="nxt-customer">${charArt('caferu')}<p id="order-talk">「落ち着ける席、ありますか？」</p><div class="order-timer"><i id="order-time" style="width:100%"></i></div></div><div class="nxt-counter"><span class="cup"></span><span class="seat"></span><span class="cake"></span><b id="order-score">0 pt</b></div></div><div class="nxt-items">${menu.map(x=>`<button class="nxt-item menu" onclick="NexcaTown.pickOrder(this,'${x}')">${x}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('order')">営業終了</button></div>`;
  }
  function festivalHtml(){
    return `<div class="nxt-game-stage visual festival deluxe-fes"><div class="nxt-game-hud"><b>FES SETUP</b><span>入口・安全性・映えを意識して配置</span><i id="fes-score">SCORE ?</i></div><div class="nxt-fes-wrap"><div class="nxt-fes-grid">${Array.from({length:12},(_,i)=>`<button class="nxt-cell" data-i="${i}" onclick="NexcaTown.placeCell(this)">${i===0?'入口':''}</button>`).join('')}</div><div class="nxt-fes-meter"><b>満足度</b><span id="fes-happy" style="--v:35%"></span><b>安全性</b><span id="fes-safe" style="--v:35%"></span><b>SNS映え</b><span id="fes-sns" style="--v:35%"></span><b>回遊性</b><span id="fes-flow" style="--v:35%"></span></div></div><div class="nxt-items">${['ステージ','受付','屋台','休憩所','写真スポット','救護所','案内板','体験ブース'].map(x=>`<button class="nxt-item facility" onclick="NexcaTown.pickFacility(this,'${x}')">${x}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('festival')">会場を公開</button></div>`;
  }
  function simpleArcadeHtml(title,mission,items,type){
    return `<div class="nxt-game-stage visual arcade"><div class="nxt-game-hud"><b>${safe(title)}</b><span>${safe(mission)}</span><i id="arc-score">SCORE 0</i></div><div class="nxt-arcade-field">${items.map((x,i)=>`<button class="arc-tile" onclick="NexcaTown.arcPick(this,${i},'${type}')"><span>${safe(x)}</span></button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('${type}')">結果を見る</button></div>`;
  }
  function simHtml(type){
    const opts=type==='manager'?['体験動画で不安を減らす','雨の日限定の小さな特典','値下げだけをする','何もしない']:['週末の予定まだない人へ。1人でも行ける体験あります。','イベント開催します。ぜひお越しください。','地域活性化のための交流イベントです。','詳細はホームページをご覧ください。'];
    return `<div class="nxt-game-stage visual sim"><div class="nxt-game-hud"><b>${type==='manager'?'店長シミュレーション':'SNS告知バトル'}</b><span>${type==='manager'?'予約率が低い店の一手':'高校生に刺さる投稿フック'}</span><i>TACTICS</i></div><div class="nxt-sim-board"><div class="nxt-case-card"><b>${type==='manager'?'WEEKLY ISSUE':'POST BATTLE'}</b><p>${type==='manager'?'週末は来るのに平日は弱い。値下げ以外で「行く理由」を作りたい。':'最初の1秒で自分ごとにできる告知文を選ぶ。'}</p></div><div class="nxt-reaction"><span>来店</span><i style="--v:42%"></i><span>SNS反応</span><i style="--v:68%"></i><span>不安解消</span><i style="--v:55%"></i></div></div><div class="nxt-items">${opts.map((x,i)=>`<button class="nxt-choice" onclick="NexcaTown.selectChoice(this,${i})">${safe(x)}</button>`).join('')}</div><button class="nxt-play" onclick="NexcaTown.finishGame('${type}')">結果を見る</button></div>`;
  }

  function pickCoord(el,cat,name){
    g.selected[cat]=name;
    $$('.nxt-item.fashion[data-cat="'+cat+'"]').forEach(x=>x.classList.remove('sel'));
    el.classList.add('sel');
    const count=Object.keys(g.selected).length;
    const theme=(g.selected.tops==='デニムジャケット'?30:15)+(g.selected.accessory==='革バッグ'?18:8);
    const color=(g.selected.shoes==='赤スニーカー'?32:16)+(g.selected.bottoms?18:0);
    const unique=(g.selected.accessory==='レトロ帽子'?38:16)+(g.selected.bottoms==='ワイドデニム'?14:0);
    const season=(g.selected.tops==='デニムジャケット'?30:12)+(g.selected.shoes==='革靴'?14:8);
    g.score=Math.min(100,28+Math.round((theme+color+unique+season)/4)+count*9);
    setText('coord-score',g.score); setText('coord-score-pill','SCORE '+g.score); setText('coord-comment',count>=4?'ランウェイ準備完了。フルギーの見せ場。':'あと'+(4-count)+'カテゴリで完成');
    ['theme','color','unique','season'].forEach((k,i)=>{const el=$('#judge-'+k);if(el)el.style.setProperty('--v',Math.min(100,[theme,color,unique,season][i])+'%');});
    const wear=$('#coord-wear'); if(wear) wear.textContent=Object.values(g.selected).join(' / ');
    const model=$('#coord-model'); if(model) model.dataset.fit=count>=4?'good':'';
    setText('coord-label',count>=4?'READY':'SELECT');
  }
  function pickOrder(el,name){
    g.order=g.order||['ホットコーヒー','静かな席']; g.done=g.done||[];
    const ok=g.order.includes(name)&&!g.done.includes(name);
    el.classList.add(ok?'ok':'bad'); setTimeout(()=>el.classList.remove('ok','bad'),380);
    if(ok){g.done.push(name);g.combo++;g.score+=140+g.combo*30;}else{g.combo=0;g.score=Math.max(0,g.score-60);}
    if(g.done.length>=g.order.length){g.served=(g.served||0)+1;g.done=[];g.order=[['アイスラテ','写真映え席'],['チーズケーキ','抹茶ラテ'],['友達席','窓際席'],['ホットコーヒー','静かな席']][g.served%4];}
    setText('order-text',g.order.join(' + ')); setText('order-combo','COMBO x'+g.combo); setText('order-score',g.score+' pt'); setText('order-talk',ok?'「完璧、また来たい！」':'「注文と違うかも…」');
  }
  function pickFacility(el,name){g.facility=name;$$('.facility').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');}
  function placeCell(el){
    if(!g.facility) return;
    const mark={ステージ:'🎤',受付:'🧾',屋台:'🍜',休憩所:'🪑',写真スポット:'📸',救護所:'🏥',案内板:'🪧',体験ブース:'🧪'}[g.facility]||'●';
    el.textContent=mark; el.dataset.facility=g.facility; el.classList.add('filled');
    scoreFestival();
  }
  function scoreFestival(){
    const fs=$$('.nxt-cell.filled').map(x=>x.dataset.facility);
    const happy=30+fs.filter(x=>['休憩所','屋台','体験ブース'].includes(x)).length*18;
    const safe=25+fs.filter(x=>['救護所','案内板','受付'].includes(x)).length*20;
    const sns=25+fs.filter(x=>['ステージ','写真スポット','屋台'].includes(x)).length*19;
    const flow=30+fs.filter(x=>['受付','案内板','休憩所'].includes(x)).length*18;
    [['fes-happy',happy],['fes-safe',safe],['fes-sns',sns],['fes-flow',flow]].forEach(x=>{const e=$('#'+x[0]);if(e)e.style.setProperty('--v',Math.min(100,x[1])+'%');});
    g.score=Math.min(100,Math.round((happy+safe+sns+flow)/4)); setText('fes-score','SCORE '+g.score);
  }
  function selectChoice(el,i){$$('.nxt-choice').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');g.choice=i;g.score=i===0?92:i===1?78:38;}
  function arcPick(el,i,type){el.classList.toggle('sel');g.score=$$('.arc-tile.sel').reduce((n,x,idx)=>n+([0,1,2].includes(idx)?24:-12),25);setText('arc-score','SCORE '+Math.max(0,g.score));}
  function setText(id,v){const el=$('#'+id);if(el)el.textContent=v;}
  function finishGame(type){
    if(type==='coord'){runCoordShow(g.score||54,g.score>=90?'S':g.score>=75?'A':g.score>=60?'B':'C');return;}
    const score=Math.max(30,Math.min(100,g.score||(
      type==='order'?Math.round((g.score||0)/9):
      type==='festival'?70:
      ['hunt','layout','booth'].includes(type)?65+$$('.arc-tile.sel').length*8:
      g.choice===0?92:g.choice===1?78:42
    )));
    completeGame(type,score,score>=90?'S':score>=75?'A':score>=60?'B':'C');
  }
  function completeGame(type,score,rank){
    const genre={coord:'vintage',hunt:'vintage',order:'cafe',layout:'cafe',festival:'event',booth:'event',manager:'all',sns:'all'}[type]||'all';
    state.totalMiniGamesPlayed++; progress('playMiniGame');
    grantPoints(25+Math.floor(score/8),'ミニゲーム報酬');
    addPlayerExp(28+Math.floor(score/5));
    addBuildingExp(buildingForGenre(genre),35+Math.floor(score/3));
    addCharExp(charForGenre(genre),32+Math.floor(score/4));
    state.townPopularity+=Math.floor(score/7);
    state.collections.push(type+'-'+rank+'-'+today());
    save();
    rewardBurst(rank+' RANK CLEAR','スコア '+score+'。街・建物・キャラEXPに反映された。','reward');
    nav('games');
  }
  function runCoordShow(score,rank){
    const outfit=Object.values(g.selected||{}).join(' / ')||'未完成コーデ';
    let ov=$('#nxt-runway-show'); if(!ov){ov=document.createElement('div');ov.id='nxt-runway-show';ov.className='nxt-runway-show';document.body.appendChild(ov);}
    ov.innerHTML=`<div class="runway-lights"><i></i><i></i><i></i></div><div class="runway-stage"><div class="runway-title">FURUGY RUNWAY</div><div class="runway-crowd"></div><div class="runway-road"></div><div class="runway-star">${charArt('furugy')}<span>${safe(outfit)}</span></div><div class="runway-score"><b>JUDGE SCORE</b><strong>${score}</strong><em>${rank} RANK</em><p>${score>=90?'街中が振り返る伝説コーデ。':score>=75?'テーマと個性が光る、かなり良いコーデ。':score>=60?'まとまりはある。あと一手で化ける。':'まだ伸びしろあり。カテゴリをそろえよう。'}</p><button onclick="NexcaTown.completeCoordRunway(${score},'${rank}')">報酬を受け取る</button></div></div>`;
    ov.classList.add('on');
  }
  function completeCoordRunway(score,rank){
    const ov=$('#nxt-runway-show'); if(ov) ov.classList.remove('on');
    completeGame('coord',score,rank);
  }

  function claimQuest(id){
    const q=state.dailyQuests.find(x=>x.questId===id);
    if(!q||!q.isCompleted||q.isClaimed) return;
    q.isClaimed=true; grantPoints(q.rewardPoints,'デイリークエスト'); addPlayerExp(q.rewardExp); save(); rewardBurst('QUEST CLEAR',q.title+' の報酬を受け取りました。','reward'); render();
  }
  function claimAll(){
    let pts=0,exp=0,count=0;
    state.dailyQuests.forEach(q=>{if(q.isCompleted&&!q.isClaimed){q.isClaimed=true;pts+=q.rewardPoints;exp+=q.rewardExp;count++;}});
    if(!count){rewardBurst('まだ受け取れません','達成したクエストがあると一括で受け取れます。','reward');return;}
    grantPoints(pts,'デイリークエスト一括報酬'); addPlayerExp(exp); save(); rewardBurst('まとめて受け取り',count+'件のクエスト報酬を受け取りました。','reward'); render();
  }
  function loginBonus(){
    if(state.claimedLoginBonus===today()){rewardBurst('受け取り済み','明日のログインボーナスを待ってね。','reward');return;}
    state.claimedLoginBonus=today(); state.gems+=state.loginStreak%7===0?5:1; grantPoints(state.loginStreak%7===0?120:35,'ログインボーナス'); addPlayerExp(25); save(); rewardBurst('LOGIN BONUS',state.loginStreak+'日連続。ポイントとジェムを獲得。','reward'); render();
  }
  function tapBuilding(id){
    const b=state.buildings[id]; if(!b) return;
    const meta=data().buildings.find(x=>x.id===id)||{};
    if(id==='minigame'){nav('games');return;}
    if(id==='collection'){nav('collection');return;}
    if(id==='shop'){nav('shop');return;}
    if(b.rewardReady){b.rewardReady=false;b.lastRewardCollectedAt=new Date().toISOString();grantPoints(12+b.level*4,b.name+'報酬');addPlayerExp(10);progress('collectReward');save();rewardBurst('BUILDING REWARD',b.name+'から報酬を回収しました。','reward');render();return;}
    rewardBurst(meta.jp||b.name,'Lv.'+b.level+' / EXP '+b.exp+'。'+(meta.copy||'ミニゲームや参加コードで育ちます。'),'building');
  }
  function talk(id){const c=state.characters[id]; if(!c) return; progress('talkChar'); addCharExp(id,10); save(); rewardBurst(c.name,c.dialogue+' EXP+10','char'); render();}
  function mainChar(id){Object.values(state.characters).forEach(c=>c.isMain=false);state.characters[id].isMain=true;save();renderScreen('chars');}
  function train(id){if(!usePoints(20,'キャラ育成')){rewardBurst('ポイント不足','育成には20pt必要です。ミニゲームや参加コードで増やせます。','reward');return;}addCharExp(id,38);save();renderScreen('chars');}
  function buy(id){
    const item=data().shop.find(x=>x.id===id); if(!item) return;
    if(!usePoints(item.cost,item.name+'購入')){rewardBurst('ポイント不足',item.cost+'pt必要です。','reward');return;}
    state.inventory.push({itemId:item.id,category:item.category,genre:item.category,rarity:item.cost>90?'R':'N',obtainedAt:new Date().toISOString(),name:item.name});
    state.townPopularity+=item.popularity; save(); rewardBurst('SHOP GET',item.name+'を街に追加しました。','reward'); renderScreen('shop');
  }
  function redeem(){
    const raw=String($('#nxt-code')?.value||'').trim().toUpperCase();
    if(!raw){rewardBurst('コード未入力','参加コードを入力してください。','reward');return;}
    const table=data().codes||{};
    let rec=table[raw];
    const ev=(window.EVS||[]).find(e=>String(e.qr||e.participation_code||'').toUpperCase()===raw);
    if(!rec&&ev){const genre=ev.g==='cafe'||ev.genre==='cafe'?'cafe':ev.g==='vintage'||ev.genre==='vintage'?'vintage':'event';rec={genre,title:ev.title||'Nexca体験',placeName:ev.loc||'',points:110,playerExp:80,buildingExp:95,characterExp:80,badge:'Nexca参加バッジ'};}
    if(!rec){rewardBurst('コードが違います','VINTAGE50 / CAFE50 / EVENT100 でも演出を確認できます。','reward');return;}
    if(state.seenCodes[raw]){rewardBurst('すでに使用済みです','参加コードは1回だけ使えます。','reward');return;}
    state.seenCodes[raw]=true; state.totalParticipationCodesRedeemed++; state.totalExperienceCards++;
    grantPoints(rec.points,'参加コード報酬'); addPlayerExp(rec.playerExp); addBuildingExp(buildingForGenre(rec.genre),rec.buildingExp); addCharExp(charForGenre(rec.genre),rec.characterExp); state.townPopularity+=28; progress('redeemCode'); state.collections.push('code-'+rec.genre);
    const b=state.buildings[buildingForGenre(rec.genre)], c=state.characters[charForGenre(rec.genre)];
    state.experienceCards.unshift({genre:rec.genre,title:rec.title,placeName:rec.placeName,visitedAt:today(),pointsEarned:rec.points,expEarned:rec.playerExp,badgeId:rec.badge,buildingName:b.name,charName:c.name,createdAt:new Date().toISOString()});
    try{if(window.user&&window.sb)window.sb.from('participation_code_redemptions').insert({user_id:window.user.id,code:raw,genre:rec.genre,points_awarded:rec.points,player_exp_awarded:rec.playerExp,building_exp_awarded:rec.buildingExp,character_exp_awarded:rec.characterExp,redeemed_at:new Date().toISOString()}).then(()=>{});}catch(e){}
    save(); rewardBurst('EXPERIENCE CARD',rec.title+' の思い出カードを生成しました。','level'); nav('cards');
  }
  function notice(){rewardBurst('お知らせ','NEXCA TOWNの正式版に向けて、街・キャラ・ミニゲームを強化中です。','reward');}

  window.NexcaTown={open,close,nav,notice,loginBonus,claimQuest,claimAll,tapBuilding,talk,mainChar,train,buy,startGame,finishGame,completeCoordRunway,pickCoord,pickOrder,pickFacility,placeCell,selectChoice,arcPick,redeem};
  window.openTown=open;
  window.closeTown=close;
  window.addEventListener('DOMContentLoaded',()=>{load();$$('[onclick="openTown()"]').forEach(card=>{card.innerHTML=card.innerHTML.replace('キャラを集めて街を育てよう','現実の体験で、君の街が育つ').replace('現実で遊ぶほど育つ、街づくりゲーム','まだ知らない体験が、次の自分を連れてくる。');});});
})();
