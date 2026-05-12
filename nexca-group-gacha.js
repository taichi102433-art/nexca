(function(){
  'use strict';

  var appBase = location.pathname.indexOf('/nexca/') >= 0 ? '/nexca/' : '';
  function imgPath(key){ return appBase + 'assets/characters/' + key + '.png'; }
  function $(sel,root){ return (root||document).querySelector(sel); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function uniq(arr){ return Array.from(new Set((arr||[]).filter(Boolean))); }
  function nowIso(){ return new Date().toISOString(); }

  var CHARACTERS = {
    nexsuke:{name:'ネクスケ',image:imgPath('nexsuke'),role:'最初の一歩',color:'#8FC7E8'},
    tsugiha:{name:'ツギハ',image:imgPath('tsugiha'),role:'自分らしさ',color:'#B56A45'},
    komorebi:{name:'コモレビ',image:imgPath('komorebi'),role:'ひと息',color:'#A7C88A'},
    irodori:{name:'イロドリ',image:imgPath('irodori'),role:'ワクワク',color:'#FF8A4C'},
    honori:{name:'ホノリ',image:imgPath('honori'),role:'食卓の灯り',color:'#F0A43A'},
    shirube:{name:'シルベ',image:imgPath('shirube'),role:'道しるべ',color:'#5D8FAE'},
    yodomi:{name:'ヨドミ',image:imgPath('yodomi'),role:'迷い',color:'#7C6A8E'}
  };

  var safetyText = '周りの人やお店の迷惑にならない範囲で楽しもう。撮影禁止の場所では撮らず、知らない人を勝手に写さないでください。無理な大食い、危険行為、店員さんへの無茶振りは禁止です。公園や屋外ではゴミを必ず持ち帰ってください。';
  var stampMission = 'この企画をやったら、①このガチャ結果のスクショ ②実際に撮った写真 をInstagramのストーリーまたは投稿に載せて、Nexca公式をメンション！確認できた人には、限定LINEスタンプをプレゼント。';
  var noListingNote = '今は条件に合うNexca掲載先が少ないため、場所タイプでプランを作りました。掲載先が増えると、ここに具体的な店名やイベント名が入ります。';
  var placeTypes = ['公園','映画館','夜景が見える場所','川沿い・海沿い','商店街','駅周辺','屋内で休める場所','買い物できるエリア','写真を撮りやすい場所','食べ歩きしやすいエリア','静かに話せる場所','大人数でも集まりやすい場所','季節を感じる場所','ベンチや座れる場所','雨でも過ごしやすい場所','初心者でも入りやすい体験場所','軽食を買いやすいエリア','歩きやすい通り','休憩しやすい屋内スポット'];

  var state = {
    step:0,
    result:null,
    conditions:{
      count:'2人',
      relationship:'友達',
      situation:'遊び',
      style:'王道',
      startTime:'13:00',
      endTime:'17:00',
      budget:'〜2,000円',
      area:'本通・紙屋町周辺',
      indoorOutdoor:'どちらでも',
      movement:'徒歩'
    }
  };

  var steps = [
    {key:'count',title:'今日は何人で出かける？',hint:'人数で、街のにぎやかさとプランの詰め方が変わります。',char:'nexsuke',line:'今日はどこへ行く？',options:['1人','2人','3人','4人','5人以上']},
    {key:'relationship',title:'誰と行く？',hint:'相手に合わせて、言葉の温度と予定の余白を調整します。',char:'honori',line:'無理なく楽しめる予定にしよう。',skip:function(){return state.conditions.count==='1人';},options:['友達','恋人','気になる人','家族','クラス・サークル']},
    {key:'situation',title:'今日はどんな感じにしたい？',hint:'検索ではなく、今日の過ごし方をキャラたちが組み立てます。',char:'irodori',line:'このあと、ちょっと面白くなるよ。',options:['遊び','デート','観光','話す','買い物','体験','季節']},
    {key:'style',title:'どんなノリで決める？',hint:'選んだノリで、門が開く時の演出とプランの味が変わります。',char:'yodomi',line:'まだ決めるの？家でもよくない？',options:['王道','インスタ映え','爆食','YouTube企画','完全おまかせ']},
    {key:'time',title:'時間はどれくらい？',hint:'開始と終了を決めると、詰め込みすぎない日程表にします。',char:'shirube',line:'条件を整えていくね。',type:'time'},
    {key:'budget',title:'予算は？',hint:'爆食でも無理な大食いは出しません。満足度と安全を優先します。',char:'honori',line:'ちゃんと満たされる予定にしよう。',options:['無料','〜500円','〜1,000円','〜2,000円','〜3,000円','〜5,000円','〜10,000円','気にしない']},
    {key:'area',title:'どのエリア？',hint:'掲載先がない時は、勝手な店名を出さず場所タイプで作ります。',char:'shirube',line:'場所の候補を安全に整えるね。',options:['現在地周辺','広島駅周辺','本通・紙屋町周辺','八丁堀・袋町周辺','横川周辺','廿日市・宮島方面','福山方面','その他'],extraOptions:['西広島周辺','宇品・皆実町周辺','アルパーク周辺','呉方面','東広島・西条方面','尾道方面','三原方面','広島県内その他','県外']},
    {key:'indoorOutdoor',title:'屋内・屋外は？',hint:'雨の日や暑い日は、屋内寄りにすると動きやすくなります。',char:'komorebi',line:'休憩できる余白も入れておくね。',options:['どちらでも','屋内','屋外']},
    {key:'movement',title:'移動方法は？',hint:'移動距離が不自然にならないように、最後にシルベがまとめます。',char:'shirube',line:'道が見えたら、ちゃんと進める。',options:['徒歩','自転車','電車・バス','車','なんでもOK']}
  ];

  var titleSets = {
    'YouTube企画':[
      '古着屋3店舗で友達を本気プロデュースしたら、どこまで垢抜けるのか','普通の友達を“雑誌の表紙っぽく”撮ったら、本当に雰囲気出るのか','友達のセンスだけで夜ご飯を決めたら、満足するのか絶望するのか','1000円だけで最高の放課後は作れるのか','右左ルーレットだけで休日を決めたら、本当に楽しくなるのか','友達を“謎に売れそうな人”にしたら、どこまでそれっぽくなるのか','友達のインスタアイコンを本気で撮ったら、採用されるのか','この人、休日うまそう選手権','5人で1人を“今日の主人公”にしたら、どんな写真になるのか','友達の“人生変わりそうな500円アイテム”を探したら、何を選ぶのか','全員の“今日の二つ名”を決めたら、誰が一番しっくりくるのか','友達の“未来の職業”を勝手に決めて写真を撮ったら、意外と当たるのか','カフェ3店舗で“会話しやすい席”を探したら、どこが一番強いのか','初対面っぽい友達を“昔からの親友写真”にできるのか','その日を“存在しないYouTube番組”にしたら、誰の番組が一番見たいのか','30分だけ寄り道プラン','友達の“弱点”を逆に武器っぽく撮ったら、どこまでかっこよくなるのか','食べる前に味を予想したら、誰が一番当てられるのか','一番常連っぽい人を撮ったら、誰が一番その街に馴染むのか','存在しないブランド広告を作ったら、どこまで本物っぽくなるのか','友達のご飯の好みだけで店を選んだら、どれだけ当てられるのか','30分で“この人っぽい写真”を撮れるのか','全員ちょっとだけ有名人っぽく撮ったら、誰が一番それっぽいのか','今日の予定を“架空のニュース”にしたら、どんな見出しになるのか','帰りたくない理由を1枚の写真で作れるのか','相手に似合うスイーツを選んだら、本当に当たるのか','チーム対抗サムネ作成バトル','1人だけ世界観が違う集合写真を撮ったら、誰が一番浮けるのか','この街に引っ越してきた人にすすめる1時間を作れるのか','Nexcaガチャだけで“今日の思い出”は作れるのか'
    ],
    '王道':[
      '外しにくい2時間おでかけプラン','初めてでも行きやすいカフェ休憩プラン','ランチから始める王道プラン','夜ご飯だけで満足する短めプラン','買い物して休憩する王道プラン','家族で無理なく出かけるプラン','30分だけ寄り道プラン','恋人向けゆっくり休日プラン','友達と軽く遊ぶ放課後プラン','迷ったらこれプラン','広島駅周辺の短時間プラン','本通・紙屋町の歩きやすい王道プラン','八丁堀・袋町の雰囲気重視プラン','横川周辺のゆるめ寄り道プラン','宮島・廿日市方面の観光王道プラン','福山方面の半日王道プラン','尾道方面の写真と休憩プラン','雨の日でも使える屋内王道プラン','暑い日・寒い日の無理しないプラン','1人でも気軽に動ける王道プラン','3人友達のちょうどいい遊びプラン','4人で外しにくいご飯プラン','5人以上の移動少なめグループプラン','体験初心者向けプラン','季節を少し感じる王道プラン','予定が決まらない時のシルベ救済プラン','友達と話すだけの日プラン','家族でご飯中心プラン','恋人と夜ご飯中心プラン','帰り道にちょうどいい寄り道'
    ],
    'インスタ映え':[
      '今日のベスト1枚を撮るプラン','季節っぽい写真を1枚だけ残すプラン','雑誌表紙風フォトプラン','友達のプロフィール写真更新プラン','カフェの窓辺で休日っぽい1枚プラン','川沿いで帰りたくない写真プラン','夜景で存在しない映画タイトルをつけるプラン','古着・買い物エリアで自分っぽい写真プラン','公園で青春っぽい1枚プラン','商店街でレトロ風写真プラン','駅周辺で旅っぽい写真プラン','季節カラー縛り写真プラン','1人だけ世界観違う写真プラン','休日上級者っぽい写真プラン','料理・スイーツ広告風写真プラン','架空ブランド広告プラン','3枚で今日を説明するプラン','友達の“その人っぽい”写真プラン','恋人と自然体写真プラン','気になる人と顔出ししなくても残せる写真プラン','家族の今日の1枚プラン','チーム対抗ベスト写真プラン','今日のジャケット写真プラン','MVのワンシーン風プラン','公園で花見写真プラン','夏の夕方写真プラン','秋色コーデ写真プラン','冬のあったか写真プラン','尾道・宮島方面向け観光写真プラン','Nexcaストーリー投稿用写真プラン'
    ],
    '爆食':[
      '今日の一口MVP決定戦','1000円満足ご飯プラン','友達の好みだけで夜ご飯を決めるプラン','シェア飯ドラフト','食べる前に味予想プラン','相手に似合うスイーツ選び','カフェ・スイーツ食べ比べ風プラン','ランチ満足度100点プラン','夜ご飯だけで満足する短めプラン','友達に食べてほしい一品選び','家族でご飯中心プラン','恋人とゆっくり夜ご飯プラン','気になる人と軽く食べる寄り道プラン','春のたまご焼き縛り花見','夏の冷たいものMVP','秋の温かい食べ物探し','冬のあったかご飯プラン','食べ歩きしやすいエリアで一口MVP','500円以内の軽食満足チャレンジ','ホノリの爆満足プラン'
    ]
  };

  function styleCharacters(style){
    if(style==='王道') return ['shirube','komorebi','honori'];
    if(style==='インスタ映え') return ['tsugiha','irodori','komorebi'];
    if(style==='爆食') return ['honori','shirube','irodori'];
    if(style==='YouTube企画') return ['irodori','tsugiha','shirube','yodomi'];
    return ['nexsuke','tsugiha','komorebi','irodori','honori','shirube'];
  }

  function styleLines(style){
    if(style==='王道') return ['シルベ「外しにくい流れで組んでみるね。」','コモレビ「休憩できる時間も入れておくね。」','ホノリ「ご飯や会話の余白も大事だよ。」'];
    if(style==='インスタ映え') return ['ツギハ「今日の雰囲気、ちゃんと選ぼう。」','イロドリ「写真に残したくなる瞬間を探してるよ。」'];
    if(style==='爆食') return ['ホノリ「無理に食べるんじゃなくて、ちゃんと満たされに行こう。」','シルベ「予算と時間も見ておくね。」'];
    if(style==='YouTube企画') return ['イロドリ「今日を企画に変えるよ。」','ツギハ「変化が見えるミッションにしよう。」','シルベ「危なくないルールに整えておくね。」','ヨドミ「普通に帰れば？」','イロドリ「いや、ガチャ回したから行くよ。」'];
    return ['ネクスケ「最初の一歩を選んでるよ。」','ツギハ「その人らしさも見てる。」','コモレビ「無理のない時間にするね。」','イロドリ「少しだけワクワクを足すよ。」','ホノリ「ご飯や会話の余白も見てる。」','シルベ「最後に予定として整えるね。」'];
  }

  function makeTemplates(style,titles){
    return titles.map(function(title,i){
      var indoor = style==='インスタ映え' ? 'どちらでも' : style==='爆食' ? '屋内' : 'どちらでも';
      var chars = styleCharacters(style).slice(0,3);
      return {
        template_id:'group_' + style.replace(/[^\w一-龠ぁ-んァ-ン]/g,'') + '_' + String(i+1).padStart(2,'0'),
        title:title,
        style:style,
        subtype: style==='YouTube企画' ? '企画系' : style,
        target_people:['1人','2人','3人','4人','5人以上'],
        target_relationships:['友達','恋人','気になる人','家族','クラス・サークル','1人時間'],
        target_situations: style==='爆食' ? ['話す','遊び','季節'] : style==='インスタ映え' ? ['観光','買い物','季節','遊び'] : style==='YouTube企画' ? ['遊び','買い物','体験'] : ['遊び','話す','観光','デート','体験','季節'],
        best_genres: style==='爆食' ? ['cafe'] : style==='インスタ映え' ? ['furugiya','cafe','event'] : style==='YouTube企画' ? ['furugiya','event','cafe'] : ['cafe','event','furugiya'],
        place_types: defaultPlaces(style,title),
        season: seasonKey(),
        time_required: i%4===0 ? '30分〜1時間' : i%4===1 ? '1〜2時間' : i%4===2 ? '2〜4時間' : '4時間以上',
        budget_level: style==='爆食' ? '〜2,000円' : title.indexOf('500円')>=0 ? '〜500円' : title.indexOf('1000円')>=0 ? '〜1,000円' : '〜2,000円',
        indoor_outdoor: indoor,
        movement_type:'徒歩',
        theme: defaultTheme(style,title),
        reason: defaultReason(style),
        schedule_blocks: [],
        rules: defaultRules(style),
        photo_mission: defaultPhotos(style,title),
        ending: defaultEnding(style),
        safety_note:safetyText,
        characters:chars,
        story_card_text:title
      };
    });
  }

  function defaultPlaces(style,title){
    if(style==='爆食') return ['食べ歩きしやすいエリア','軽食を買いやすいエリア','静かに話せる場所'];
    if(style==='インスタ映え') return ['写真を撮りやすい場所','川沿い・海沿い','商店街','季節を感じる場所'];
    if(style==='YouTube企画') return ['買い物できるエリア','商店街','駅周辺','公園'];
    if(title.indexOf('雨')>=0) return ['雨でも過ごしやすい場所','屋内で休める場所'];
    return ['駅周辺','歩きやすい通り','屋内で休める場所','ベンチや座れる場所'];
  }
  function defaultTheme(style,title){
    if(style==='YouTube企画') return '今日をひとつの企画にして、最後にオチまで作る。';
    if(style==='インスタ映え') return '写真に残したくなる瞬間を1つ決めて、雰囲気ごと楽しむ。';
    if(style==='爆食') return '無理に食べすぎず、今日の一口MVPを決める爆満足プラン。';
    return '移動少なめで、休憩と会話の余白まで入れた外しにくい流れ。';
  }
  function defaultReason(style){
    if(style==='YouTube企画') return '人数とノリから、危なくない範囲で企画感が出るプランを選びました。';
    if(style==='インスタ映え') return '写真テーマと投稿しやすさを優先しつつ、無理な移動を避けました。';
    if(style==='爆食') return '食事と会話の満足度を上げながら、無理な大食いにならないように整えました。';
    return '初めてでも使いやすく、時間・予算・移動が破綻しにくい王道寄りで組みました。';
  }
  function defaultRules(style){
    if(style==='YouTube企画') return ['知らない人を巻き込まない','店内や公共の場で騒がない','最後に今日のタイトルを1つ決める'];
    if(style==='インスタ映え') return ['顔出ししない写真でもOK','撮影禁止の場所では撮らない','ベスト1枚に一言タイトルをつける'];
    if(style==='爆食') return ['無理に食べきらない','1人1つ今日の一口MVPを決める','予算を先に決めてから選ぶ'];
    return ['移動は短めにする','途中で休憩を入れる','最後に次行きたい候補を1つだけ保存する'];
  }
  function defaultPhotos(style,title){
    if(style==='YouTube企画') return ['企画タイトルっぽいサムネ風写真','今日のオチが分かる1枚'];
    if(style==='インスタ映え') return ['今日のベスト1枚','季節や光が分かる引きの写真'];
    if(style==='爆食') return ['今日の一口MVP','食べる前の期待値写真'];
    return ['集合前後の1枚','帰り道にちょうどいい1枚'];
  }
  function defaultEnding(style){
    if(style==='YouTube企画') return '最後に「今日の動画タイトル」を全員で決める。';
    if(style==='インスタ映え') return 'ベスト写真に一言タイトルをつける。';
    if(style==='爆食') return '今日の一口MVPを発表して終わる。';
    return '次に行きたい場所を1つだけ決めて、気持ちよく解散。';
  }

  var TEMPLATES = makeTemplates('王道',titleSets['王道'])
    .concat(makeTemplates('インスタ映え',titleSets['インスタ映え']))
    .concat(makeTemplates('爆食',titleSets['爆食']))
    .concat(makeTemplates('YouTube企画',titleSets['YouTube企画']));

  function seasonKey(){
    var m = new Date().getMonth()+1;
    if(m>=3 && m<=5) return '春';
    if(m>=6 && m<=8) return '夏';
    if(m>=9 && m<=11) return '秋';
    return '冬';
  }

  function currentStep(){
    var s = steps[state.step];
    if(s && s.skip && s.skip()){
      state.conditions.relationship = '1人時間';
      state.step += 1;
      return currentStep();
    }
    return s || steps[steps.length-1];
  }
  function visibleStepCount(){ return steps.filter(function(s){return !(s.skip && s.skip());}).length; }
  function visibleIndex(){
    var idx = 0;
    for(var i=0;i<=state.step;i++){
      if(!(steps[i].skip && steps[i].skip())) idx++;
    }
    return idx;
  }
  function crowdClass(){
    var c = state.conditions.count;
    if(c==='1人') return 'is-solo';
    if(c==='2人') return 'is-pair';
    if(c==='3人') return 'is-trio';
    if(c==='4人') return 'is-group';
    return 'is-festival';
  }
  function townLevelClass(){
    var lv = getTownLevel();
    if(lv>=13) return 'is-level-legend';
    if(lv>=8) return 'is-level-high';
    if(lv>=4) return 'is-level-mid';
    return 'is-level-low';
  }
  function getTownLevel(){
    try{
      var keys = ['nexcaTownProfile','nexca_town_profile','nexcaTownData','townData'];
      for(var i=0;i<keys.length;i++){
        var raw = localStorage.getItem(keys[i]);
        if(!raw) continue;
        var parsed = JSON.parse(raw);
        var lv = parsed.playerLevel || parsed.level || parsed.townRank || parsed.rank;
        if(Number(lv)>0) return Number(lv);
      }
    }catch(e){}
    return 1;
  }

  function boot(){
    var card = $('.gg-card');
    if(!card) return;
    card.id = 'group-gacha-card';
    card.classList.add('nxgg-host');
    card.innerHTML = [
      '<div class="nxgg '+crowdClass()+' '+townLevelClass()+'">',
        '<div class="nxgg-hero">',
          '<div><div class="nxgg-kicker">Nexca Group Gacha</div><div class="nxgg-title">キャラたちが、今日の予定を組み立てる</div><div class="nxgg-sub">条件を選んで、ネクスカタウンの門をひらこう。</div></div>',
          '<div class="nxgg-party"><img src="'+CHARACTERS.nexsuke.image+'" alt=""><img src="'+CHARACTERS.irodori.image+'" alt=""><img src="'+CHARACTERS.shirube.image+'" alt=""></div>',
        '</div>',
        '<div class="nxgg-progress" id="nxgg-progress"></div>',
        '<div id="nxgg-step"></div>',
        '<div class="nxgg-result" id="gg-result"></div>',
      '</div>'
    ].join('');
    state.step = Math.min(state.step, steps.length-1);
    renderStep();
    recordEvent('start_group_gacha',{source:'group_gacha'});
  }

  function renderProgress(){
    var total = visibleStepCount(), cur = visibleIndex(), h = '';
    for(var i=1;i<=total;i++) h += '<div class="nxgg-dot '+(i<=cur?'on':'')+'"></div>';
    var el = $('#nxgg-progress');
    if(el) el.innerHTML = h;
  }

  function renderStep(){
    var root = $('#nxgg-step');
    if(!root) return;
    var s = currentStep();
    renderProgress();
    var total = visibleStepCount(), cur = visibleIndex();
    var optionsHtml = '';
    if(s.type === 'time'){
      optionsHtml = '<div class="nxgg-time-row"><input type="time" id="nxgg-start-time" value="'+esc(state.conditions.startTime)+'"><span>から</span><input type="time" id="nxgg-end-time" value="'+esc(state.conditions.endTime)+'"></div>';
    }else{
      var opts = s.options || [];
      optionsHtml = '<div class="nxgg-options '+(opts.length<=4?'two':'')+'">' + opts.map(function(o){
        return '<button class="nxgg-option '+(state.conditions[s.key]===o?'is-selected':'')+'" type="button" data-key="'+esc(s.key)+'" data-value="'+esc(o)+'">'+esc(o)+'</button>';
      }).join('') + '</div>';
      if(s.key==='area' && state.conditions.area==='その他'){
        optionsHtml += '<div class="nxgg-summary" style="margin:14px 0 8px;"><span class="nxgg-tag">その他エリア</span></div><div class="nxgg-options">' + s.extraOptions.map(function(o){
          return '<button class="nxgg-option '+(state.conditions.areaDetail===o?'is-selected':'')+'" type="button" data-key="areaDetail" data-value="'+esc(o)+'">'+esc(o)+'</button>';
        }).join('') + '</div>';
      }
    }
    root.innerHTML = [
      '<div class="nxgg-card">',
        '<div class="nxgg-step-meta"><span class="nxgg-step-no">STEP '+cur+'</span><span class="nxgg-step-count">'+cur+' / '+total+'</span></div>',
        '<div class="nxgg-question">'+esc(s.title)+'</div>',
        '<div class="nxgg-hint">'+esc(s.hint)+'</div>',
        optionsHtml,
        '<div class="nxgg-summary">'+summaryTags().map(function(t){return '<span class="nxgg-tag">'+esc(t)+'</span>';}).join('')+'</div>',
        '<div class="nxgg-peek"><div class="nxgg-bubble">'+esc(s.line)+'</div><img src="'+CHARACTERS[s.char].image+'" alt="'+esc(CHARACTERS[s.char].name)+'"></div>',
        '<div class="nxgg-nav">',
          '<button class="nxgg-back" type="button" id="nxgg-back">'+(cur===1?'リセット':'戻る')+'</button>',
          '<button class="'+(cur===total?'nxgg-open-gate':'nxgg-next')+'" type="button" id="nxgg-next">'+(cur===total?'ネクスカタウンの門をひらく':'次へ')+'</button>',
        '</div>',
      '</div>'
    ].join('');
    $all('.nxgg-option',root).forEach(function(btn){
      btn.addEventListener('click',function(){
        var key = btn.getAttribute('data-key'), value = btn.getAttribute('data-value');
        state.conditions[key] = value;
        if(key==='count' && value==='1人') state.conditions.relationship = '1人時間';
        if(key==='count' && value!=='1人' && state.conditions.relationship==='1人時間') state.conditions.relationship = '友達';
        if(key==='area' && value!=='その他') delete state.conditions.areaDetail;
        recordEvent('select_gacha_condition',{key:key,value:value});
        renderStep();
      });
    });
    var st = $('#nxgg-start-time'), et = $('#nxgg-end-time');
    if(st) st.addEventListener('change',function(){ state.conditions.startTime = this.value || '13:00'; recordEvent('select_gacha_condition',{key:'startTime',value:this.value}); });
    if(et) et.addEventListener('change',function(){ state.conditions.endTime = this.value || '17:00'; recordEvent('select_gacha_condition',{key:'endTime',value:this.value}); });
    $('#nxgg-back').addEventListener('click',function(){ if(cur===1){ resetGacha(); } else { goBack(); } });
    $('#nxgg-next').addEventListener('click',function(){ if(cur===total){ openGate(); } else { goNext(); } });
  }

  function summaryTags(){
    var c = state.conditions;
    return [c.count,c.count==='1人'?'1人時間':c.relationship,c.situation,c.style,c.budget,c.areaDetail||c.area,c.indoorOutdoor,c.movement].filter(Boolean).slice(0,8);
  }
  function resetGacha(){
    state.step = 0;
    state.result = null;
    var res = $('#gg-result');
    if(res){ res.style.display='none'; res.innerHTML=''; }
    renderStep();
  }
  function goBack(){
    state.step = Math.max(0,state.step-1);
    while(steps[state.step] && steps[state.step].skip && steps[state.step].skip()) state.step = Math.max(0,state.step-1);
    renderStep();
  }
  function goNext(){
    state.step = Math.min(steps.length-1,state.step+1);
    renderStep();
  }

  function openGate(){
    var overlay = ensureOverlay();
    overlay.className = 'nxgg-overlay on style-' + slug(state.conditions.style) + ' ' + crowdClass() + ' ' + townLevelClass();
    overlay.innerHTML = gateHtml();
    recordEvent('open_town_gate',{conditions:state.conditions});
    setTimeout(function(){ overlay.classList.add('is-open'); },680);
    setTimeout(function(){
      var result = generateResult();
      state.result = result;
      renderResult(result);
      overlay.classList.remove('on');
      recordEvent('complete_group_gacha',{title:result.title,style:result.style,mode:result.placeMode});
    },3550);
  }
  function ensureOverlay(){
    var el = $('#nxgg-overlay');
    if(!el){
      el = document.createElement('div');
      el.id = 'nxgg-overlay';
      document.body.appendChild(el);
    }
    return el;
  }
  function gateHtml(){
    var chars = styleCharacters(state.conditions.style);
    var lines = styleLines(state.conditions.style);
    return [
      '<div class="nxgg-gate">',
        '<div class="nxgg-town-silhouette"></div>',
        '<div class="nxgg-gate-title">ネクスカタウンの門が開く</div>',
        '<div class="nxgg-gate-arch"><div class="nxgg-gate-light"></div></div>',
        '<div class="nxgg-gate-chars">'+chars.map(function(k,i){return '<img style="animation-delay:'+(.08*i)+'s" src="'+CHARACTERS[k].image+'" alt="'+esc(CHARACTERS[k].name)+'">';}).join('')+'</div>',
        '<div class="nxgg-gate-tags">'+summaryTags().slice(0,6).map(function(t){return '<span>'+esc(t)+'</span>';}).join('')+'</div>',
        '<div class="nxgg-gate-lines">'+lines.slice(0,5).map(function(l){return '<div>'+esc(l)+'</div>';}).join('')+'</div>',
        '<div class="nxgg-gate-status">今日のイベントを組み立てています…</div>',
      '</div>'
    ].join('');
  }
  function slug(v){ return String(v||'').replace(/[^\w-]/g,''); }

  function generateResult(){
    var ctx = Object.assign({},state.conditions);
    if(ctx.area==='その他' && ctx.areaDetail) ctx.area = ctx.areaDetail;
    var listings = rankListings(ctx).slice(0,3);
    var template = chooseTemplate(ctx);
    var placeMode = listings.length ? 'listing' : (template.place_types && template.place_types.length ? 'place_type' : 'mission');
    var places = listings.length ? listings.map(function(l){return {kind:'listing',id:l.id,title:l.title,category:l.category||l.genre,area:l.area||l.loc||ctx.area};}) : choosePlaceTypes(template,ctx).map(function(p){return {kind:'place_type',title:ctx.area + 'の' + p};});
    var schedule = buildSchedule(ctx,template,places);
    var mainChars = styleCharacters(ctx.style);
    var title = adaptTitleForRelationship(template.title,ctx);
    var result = {
      id:'gg_'+Date.now(),
      conditions:ctx,
      templateId:template.template_id,
      title:title,
      style:ctx.style,
      theme:template.theme,
      reason:buildReason(ctx,template,placeMode,listings),
      placeMode:placeMode,
      places:places,
      schedule:schedule,
      rules:template.rules,
      photos:template.photo_mission,
      ending:template.ending,
      budget:budgetText(ctx),
      safety:safetyText,
      mission:stampMission,
      matchedListingIds:listings.map(function(l){return l.id;}),
      characters:mainChars,
      storyCardData:{title:title,tags:[ctx.count,ctx.count==='1人'?'1人時間':ctx.relationship,ctx.area,ctx.style].filter(Boolean),character:storyCharacter(ctx.style)}
    };
    saveLocalResult(result,false);
    return result;
  }

  function chooseTemplate(ctx){
    if(ctx.style==='完全おまかせ') return makeOmakaseTemplate(ctx);
    var list = TEMPLATES.filter(function(t){ return t.style===ctx.style; });
    var scored = list.map(function(t){
      var score = 0;
      if(t.target_situations.indexOf(ctx.situation)>=0) score += 12;
      if(t.target_relationships.indexOf(ctx.relationship)>=0) score += 8;
      if(t.budget_level===ctx.budget) score += 6;
      if(ctx.indoorOutdoor==='どちらでも' || t.indoor_outdoor===ctx.indoorOutdoor || t.indoor_outdoor==='どちらでも') score += 4;
      if(t.title.indexOf(ctx.area.replace('周辺',''))>=0) score += 5;
      if(ctx.count==='1人' && t.title.indexOf('1人')>=0) score += 8;
      if(ctx.count==='5人以上' && (t.title.indexOf('5人')>=0 || t.title.indexOf('チーム')>=0)) score += 8;
      return {t:t,score:score + Math.random()*4};
    }).sort(function(a,b){return b.score-a.score;});
    return scored[0].t;
  }
  function makeOmakaseTemplate(ctx){
    var baseTitle = ctx.count==='1人' ? 'ひとりでもできる小さな一歩プラン' : ctx.relationship==='気になる人' ? '30分だけ寄り道できるちょうどいいプラン' : '迷った日の完全おまかせプラン';
    return {
      template_id:'group_omakase_logic',
      title:baseTitle,
      style:'完全おまかせ',
      subtype:'logic',
      target_people:['1人','2人','3人','4人','5人以上'],
      target_relationships:['友達','恋人','気になる人','家族','クラス・サークル','1人時間'],
      target_situations:['遊び','話す','観光','買い物','体験','季節'],
      best_genres:['cafe','event','furugiya'],
      place_types: ctx.indoorOutdoor==='屋内' ? ['屋内で休める場所','軽食を買いやすいエリア'] : ['歩きやすい通り','ベンチや座れる場所','写真を撮りやすい場所'],
      season:seasonKey(),
      time_required:'1〜2時間',
      budget_level:ctx.budget,
      indoor_outdoor:ctx.indoorOutdoor,
      movement_type:ctx.movement,
      theme:'食事か休憩を1つ入れて、最後に小さな写真ミッションで締める。',
      reason:'条件から破綻しにくい流れを優先しつつ、少しだけワクワクを足しました。',
      rules:['移動は少なめにする','休憩か軽食を必ず入れる','最後に今日の一言タイトルを決める'],
      photo_mission:['今日を一言で表す1枚','次に行きたい場所が分かる1枚'],
      ending:'今日のMVPを1つ決めて、次の候補を保存する。',
      safety_note:safetyText,
      characters:['nexsuke','shirube'],
      story_card_text:baseTitle
    };
  }
  function adaptTitleForRelationship(title,ctx){
    if(ctx.relationship!=='気になる人') return title;
    return title.replace(/恋人/g,'一緒に行く人').replace(/距離/g,'時間').replace(/デート/g,'寄り道').replace(/好きな人/g,'相手');
  }
  function choosePlaceTypes(template,ctx){
    var list = (template.place_types||placeTypes).slice();
    if(ctx.indoorOutdoor==='屋内') list = list.filter(function(p){return /屋内|映画|買い物|軽食|休憩|雨/.test(p);});
    if(ctx.indoorOutdoor==='屋外') list = list.filter(function(p){return /公園|川沿い|海沿い|商店街|駅周辺|写真|季節|歩き/.test(p);});
    if(!list.length) list = template.place_types || placeTypes;
    return uniq(list).slice(0,3);
  }
  function buildReason(ctx,template,mode,listings){
    var rel = ctx.count==='1人' ? '1人でも動きやすいこと' : ctx.relationship + 'で過ごしやすいこと';
    var base = rel + '、' + ctx.area + '、' + ctx.budget + '、' + ctx.style + 'の条件から、' + template.reason;
    if(mode==='listing') base += ' 条件に合うNexca掲載先を優先して組み込みました。';
    else base += ' ' + noListingNote;
    return base;
  }
  function budgetText(ctx){
    if(ctx.budget==='気にしない') return '高額前提にしすぎず、当日の気分で調整。';
    return ctx.budget + 'を目安に、無理なく楽しめる範囲。';
  }
  function timeMinutes(t){ var p=String(t||'00:00').split(':'); return (Number(p[0])||0)*60+(Number(p[1])||0); }
  function fmtTime(min){ min=(min+1440)%1440; var h=Math.floor(min/60), m=min%60; return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); }
  function buildSchedule(ctx,template,places){
    var start = timeMinutes(ctx.startTime||'13:00'), end = timeMinutes(ctx.endTime||'17:00');
    if(end<=start) end = start + 120;
    var span = Math.max(45,end-start);
    var rows = [];
    rows.push({time:fmtTime(start),text:'集合。今日のタイトルだけ先に仮で決める。'});
    var p1 = places[0] ? places[0].title : ctx.area + 'の' + (template.place_types[0]||'歩きやすい通り');
    var p2 = places[1] ? places[1].title : ctx.area + 'の' + (template.place_types[1]||'休憩しやすい屋内スポット');
    rows.push({time:fmtTime(start + Math.round(span*.22)),text:p1 + 'へ。' + firstAction(ctx,template)});
    if(span>=90) rows.push({time:fmtTime(start + Math.round(span*.5)),text:p2 + 'で休憩・会話・軽食のどれかを入れる。'});
    if(span>=150 && places[2]) rows.push({time:fmtTime(start + Math.round(span*.72)),text:places[2].title + 'で写真ミッションを1つだけやる。'});
    else rows.push({time:fmtTime(start + Math.round(span*.72)),text:'今日のベスト写真を1枚だけ撮る。'});
    rows.push({time:fmtTime(end),text:template.ending});
    return rows;
  }
  function firstAction(ctx,template){
    if(ctx.style==='YouTube企画') return '企画のルールを確認して、迷惑にならない範囲でミッション開始。';
    if(ctx.style==='インスタ映え') return '光・背景・立ち位置を見て、まず1枚撮る。';
    if(ctx.style==='爆食') return '無理せず、今日の一口MVP候補を探す。';
    if(ctx.relationship==='気になる人') return '短めに寄って、軽く話せる余白を作る。';
    return '無理なく始めて、途中で予定を変えてもOK。';
  }
  function storyCharacter(style){
    if(style==='王道') return 'shirube';
    if(style==='インスタ映え') return 'irodori';
    if(style==='爆食') return 'honori';
    if(style==='YouTube企画') return 'irodori';
    return 'nexsuke';
  }

  function getPublishedListings(){
    var raw = [];
    try{
      if(window.NexcaOps && typeof window.NexcaOps.getListings==='function') raw = raw.concat(window.NexcaOps.getListings()||[]);
      if(window.NexcaOps && Array.isArray(window.NexcaOps.listings)) raw = raw.concat(window.NexcaOps.listings);
      ['nexca_listings','nexca_listings_v1','nx_listings','listings'].forEach(function(k){
        try{ var v = JSON.parse(localStorage.getItem(k)||'[]'); if(Array.isArray(v)) raw = raw.concat(v); }catch(e){}
      });
      if(Array.isArray(window.EVS)) raw = raw.concat(window.EVS.filter(function(e){return e.status==='published';}).map(function(e){return {
        id:e.id,title:e.title,category:e.genre||e.g,genre:e.genre||e.g,area:e.area||e.loc,address:e.loc,price_text:e.fee||e.priceText,tags:e.tags||[],media_url:e.video_url||e.videoUrl,participation_code:e.participation_code,status:e.status
      };}));
    }catch(e){}
    var seen = {};
    return raw.filter(function(l){
      if(!l || !l.id || seen[l.id]) return false;
      seen[l.id]=true;
      var status = l.listing_status || l.status;
      if(status !== 'published') return false;
      if(l.is_archived || l.hidden) return false;
      if(l.publish_at && new Date(l.publish_at) > new Date()) return false;
      if(l.end_date && new Date(l.end_date) < new Date()) return false;
      return true;
    });
  }
  function rankListings(ctx){
    var list = getPublishedListings();
    return list.map(function(l){ return {listing:l,score:scoreListing(l,ctx)}; })
      .filter(function(x){return x.score>18;})
      .sort(function(a,b){return b.score-a.score;})
      .map(function(x){return x.listing;});
  }
  function scoreListing(l,ctx){
    var score = 0;
    var text = JSON.stringify(l).toLowerCase();
    var tags = Array.isArray(l.tags) ? l.tags.join(' ') : String(l.tags||'');
    var area = l.area_group || l.area || l.address || '';
    if(area && String(area).indexOf(ctx.area)>=0) score += 30;
    if(String(ctx.area).indexOf(area)>=0 && area) score += 18;
    if(matchBudget(l.price_range || l.price_text || l.priceText,ctx.budget)) score += 20;
    if(matchArray(l.recommended_relationships,ctx.relationship) || tags.indexOf(ctx.relationship)>=0) score += 20;
    if(matchArray(l.recommended_situations,ctx.situation) || tags.indexOf(ctx.situation)>=0) score += 20;
    if(matchArray(l.recommended_styles,ctx.style) || tags.indexOf(ctx.style)>=0) score += 15;
    if(!l.indoor_outdoor || ctx.indoorOutdoor==='どちらでも' || l.indoor_outdoor===ctx.indoorOutdoor) score += 10;
    if(matchArray(l.recommended_time_of_day,timeBand(ctx.startTime))) score += 10;
    if(matchArray(l.movement_suitability,ctx.movement) || /駅近|徒歩/.test(text)) score += 10;
    if(l.media_url || l.video_url || l.videoUrl || l.mediaType==='video') score += 5;
    if(l.gacha_priority || l.is_recommended || l.recommended) score += 5;
    if(l.participation_code || l.has_participation_code) score += 5;
    if(ctx.style==='インスタ映え' && (l.photo_friendly || /写真|映え|フォト/.test(text))) score += 10;
    if((ctx.situation==='話す' || ctx.relationship==='気になる人') && (l.conversation_friendly || /会話|落ち着|静か/.test(text))) score += 10;
    if(ctx.count==='5人以上' && (l.group_friendly || /団体|大人数|グループ/.test(text))) score += 10;
    return score;
  }
  function matchArray(v,w){
    if(!v) return false;
    if(Array.isArray(v)) return v.indexOf(w)>=0 || v.join(' ').indexOf(w)>=0;
    return String(v).indexOf(w)>=0;
  }
  function matchBudget(v,budget){
    if(!v || budget==='気にしない') return true;
    return String(v).indexOf(budget)>=0 || String(v).indexOf(budget.replace('〜',''))>=0 || /無料/.test(String(v)) && budget==='無料';
  }
  function timeBand(t){
    var h = Math.floor(timeMinutes(t)/60);
    if(h<10) return '朝';
    if(h<12) return '午前';
    if(h<15) return '昼';
    if(h<18) return '午後';
    if(h<21) return '夕方';
    return '夜';
  }

  function renderResult(result){
    var el = $('#gg-result');
    if(!el) return;
    el.style.display = 'block';
    var main = result.characters[0] || 'nexsuke';
    var tags = [result.conditions.count,result.conditions.count==='1人'?'1人時間':result.conditions.relationship,result.conditions.area,result.conditions.style,result.conditions.budget];
    el.innerHTML = [
      '<div class="nxgg-unlock">',
        '<div class="nxgg-unlock-kicker">今日のイベント解放！</div>',
        '<div class="nxgg-unlock-title">'+esc(result.title)+'</div>',
        '<div class="nxgg-summary" style="justify-content:center;margin-top:14px;">'+tags.map(function(t){return '<span class="nxgg-tag">'+esc(t)+'</span>';}).join('')+'</div>',
        '<img class="nxgg-result-char" src="'+CHARACTERS[main].image+'" alt="'+esc(CHARACTERS[main].name)+'">',
      '</div>',
      section('今日のテーマ',result.theme),
      section('なぜこのプラン？',result.reason),
      section(result.placeMode==='listing'?'Nexca掲載先':'場所タイプ',placeHtml(result)),
      scheduleSection(result.schedule),
      listSection('ルール',result.rules),
      listSection('撮る写真',result.photos),
      section('オチ',result.ending),
      section('予算目安',result.budget),
      section('注意事項',result.safety),
      section('Nexca投稿ミッション',result.mission),
      '<div class="nxgg-actions"><button class="primary" type="button" id="nxgg-story-btn">ストーリー用カード作成</button><button type="button" id="nxgg-save-btn">保存</button><button type="button" id="nxgg-share-btn">共有</button><button type="button" id="nxgg-again-btn">もう一度回す</button></div>',
      '<div class="nxgg-story-wrap" id="nxgg-story-wrap">'+storyCard(result)+'</div>'
    ].join('');
    $('#nxgg-story-btn').addEventListener('click',function(){ showStoryCard(); });
    $('#nxgg-save-btn').addEventListener('click',function(){ saveResult(); });
    $('#nxgg-share-btn').addEventListener('click',function(){ shareResult(); });
    $('#nxgg-again-btn').addEventListener('click',function(){ resetGacha(); });
    el.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function section(title,body){ return '<div class="nxgg-section"><h4>'+esc(title)+'</h4><p>'+body+'</p></div>'; }
  function listSection(title,items){ return '<div class="nxgg-section"><h4>'+esc(title)+'</h4><ul>'+items.map(function(i){return '<li>'+esc(i)+'</li>';}).join('')+'</ul></div>'; }
  function scheduleSection(rows){
    return '<div class="nxgg-section"><h4>日程表</h4><div class="nxgg-schedule">'+rows.map(function(r){return '<div class="nxgg-schedule-row"><div class="nxgg-schedule-time">'+esc(r.time)+'</div><p>'+esc(r.text)+'</p></div>';}).join('')+'</div></div>';
  }
  function placeHtml(result){
    var h = result.places.map(function(p){
      if(p.kind==='listing') return '<p><strong>Nexca掲載中：</strong>'+esc(p.title)+' <span class="nxgg-note">('+esc(p.area||'')+')</span></p>';
      return '<p>'+esc(p.title)+'</p>';
    }).join('');
    if(result.placeMode!=='listing') h += '<p class="nxgg-note">'+esc(noListingNote)+'</p>';
    return h;
  }
  function storyCard(result){
    var c = result.storyCardData.character || 'nexsuke';
    var tags = result.storyCardData.tags.join(' / ');
    return [
      '<div class="nxgg-story-card" id="nxgg-story-card">',
        '<div class="nxgg-story-brand">Nexca Group Gacha</div>',
        '<div class="nxgg-story-label">今日の企画</div>',
        '<div class="nxgg-story-title">'+esc(result.title)+'</div>',
        '<div class="nxgg-story-tags">'+esc(tags)+'</div>',
        '<div class="nxgg-story-hash">#Nexcaガチャ</div>',
        '<div class="nxgg-story-stamp">Nexca公式をメンションで限定LINEスタンプ</div>',
        '<img class="nxgg-story-char" src="'+CHARACTERS[c].image+'" alt="'+esc(CHARACTERS[c].name)+'">',
      '</div>'
    ].join('');
  }
  function showStoryCard(){
    var wrap = $('#nxgg-story-wrap');
    if(wrap){ wrap.classList.add('on'); wrap.scrollIntoView({behavior:'smooth',block:'center'}); }
    recordEvent('create_story_card',{title:state.result && state.result.title});
  }
  function saveResult(){
    if(!state.result) return;
    saveLocalResult(state.result,true);
    saveSupabaseResult(state.result);
    recordEvent('save_gacha_result',{title:state.result.title});
    if(window.toast) window.toast('ガチャ結果を保存しました');
  }
  function saveLocalResult(result,markSaved){
    try{
      var list = JSON.parse(localStorage.getItem('nexca_group_gacha_results')||'[]');
      var exists = list.some(function(x){return x.id===result.id;});
      if(!exists) list.unshift(toSaveRow(result,markSaved));
      else list = list.map(function(x){return x.id===result.id?toSaveRow(result,markSaved):x;});
      localStorage.setItem('nexca_group_gacha_results',JSON.stringify(list.slice(0,50)));
    }catch(e){}
  }
  function toSaveRow(result){
    return {
      id:result.id,
      user_id:window.user && window.user.id,
      selected_conditions:result.conditions,
      result_template_id:result.templateId,
      result_title:result.title,
      result_style:result.style,
      result_place_mode:result.placeMode,
      matched_listing_ids:result.matchedListingIds,
      generated_schedule:result.schedule,
      story_card_data:result.storyCardData,
      created_at:nowIso()
    };
  }
  async function saveSupabaseResult(result){
    try{
      if(!window.sb || !window.user) return;
      await window.sb.from('gacha_results').insert(toSaveRow(result));
    }catch(e){ console.warn('gacha result save skipped',e); }
  }
  function shareResult(){
    if(!state.result) return;
    var text = 'Nexca Group Gachaで「'+state.result.title+'」が解放されました。\n#Nexcaガチャ';
    recordEvent('share_gacha_result',{title:state.result.title});
    if(navigator.share) navigator.share({title:'Nexca Group Gacha',text:text,url:location.href}).catch(function(){});
    else if(navigator.clipboard) navigator.clipboard.writeText(text + '\n' + location.href).then(function(){ if(window.toast) window.toast('共有文をコピーしました'); });
  }
  function recordEvent(type,metadata){
    try{
      var item = {event_type:type,source:'group_gacha',metadata:metadata||{},created_at:nowIso(),user_id:window.user && window.user.id};
      var list = JSON.parse(localStorage.getItem('nexca_behavior_events')||'[]');
      list.unshift(item);
      localStorage.setItem('nexca_behavior_events',JSON.stringify(list.slice(0,100)));
      if(window.sb && window.user){
        window.sb.from('user_behavior_events').insert(item).then(function(){}).catch(function(){});
      }
    }catch(e){}
  }

  window.NexcaGroupGacha = {
    boot:boot,
    openGate:openGate,
    generateResult:generateResult,
    characters:CHARACTERS,
    templates:TEMPLATES,
    getPublishedListings:getPublishedListings
  };
  window.drawGroupGacha = openGate;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',function(){ setTimeout(boot,60); });
  }else{
    setTimeout(boot,60);
  }
  window.addEventListener('load',function(){ setTimeout(boot,140); });
})();
