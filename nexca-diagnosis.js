(function() {
  'use strict';

  var CHARS = [
    { key: 'nexsuke', name: 'ネクスケ', type: '白紙の地図タイプ', color: '#4d9fff', glow: '#bfe5ff', icon: 'ネ' },
    { key: 'tsugiha', name: 'ツギハ', type: '自分らしさリメイクタイプ', color: '#ffb84d', glow: '#ffe0aa', icon: 'ツ' },
    { key: 'komorebi', name: 'コモレビ', type: 'ひと息チャージタイプ', color: '#55c985', glow: '#c8f4d8', icon: '木' },
    { key: 'irodori', name: 'イロドリ', type: 'ワクワク点火タイプ', color: '#ff5f8f', glow: '#ffd0de', icon: '彩' },
    { key: 'honori', name: 'ホノリ', type: '食卓あかりタイプ', color: '#ff8a45', glow: '#ffd7b8', icon: '灯' },
    { key: 'shirube', name: 'シルベ', type: '道しるべナビタイプ', color: '#7f8cff', glow: '#d7dcff', icon: '標' }
  ];
  var KEY_TO_CHAR = CHARS.reduce(function(acc, c) { acc[c.key] = c; return acc; }, {});
  var OPTION_KEYS = CHARS.map(function(c) { return c.key; });
  var AXES = [
    ['noveltySeeking', 'selfExpression', 'comfortSeeking', 'socialExcitement', 'warmConversation', 'claritySeeking'],
    ['proposer', 'individualist', 'moodReader', 'energizer', 'warmConnector', 'organizer'],
    ['growthTogether', 'senseMatching', 'emotionalSafety', 'funChemistry', 'mealBasedBonding', 'trustAndClarity'],
    ['lowBarrier', 'selfFit', 'comfort', 'memorable', 'sharedTimeValue', 'clearInfo']
  ];
  var BRAKES = ['firstStepHeavy', 'fitAnxiety', 'energyLow', 'excitementLow', 'relationshipHesitation', 'informationAnxiety'];
  var RESEARCH = [
    'activeDiscovery',
    'passiveInvitation',
    'actionGap',
    'companionDependency',
    'trustedInformationSource',
    'mealAndConversationNeed'
  ];
  var RESEARCH_QS = {
    30: 'usualPlanDecisionStyle',
    31: 'interestActionGapFrequency',
    32: 'nonParticipationReason',
    33: 'easiestCompanionType',
    34: 'trustedInformationSource'
  };

  var QUESTIONS = [
    ['急に3時間だけ自由な時間ができた。最初に考えることは？', ['何か普段と違うことができないか探す', '今の気分に合うものをじっくり選ぶ', 'まず落ち着ける過ごし方を考える', '誰かを誘って楽しい予定に変えたい', '誰かとゆっくり話せる時間にしたい', '時間・場所・お金を見て現実的に決める']],
    ['行く前は楽しみだった予定なのに、直前で気持ちが下がる時に近いのは？', ['思ったより大きな一歩に感じてきた', '自分に合わない気がしてきた', '体力や気力が残っていない気がした', '思ったより盛り上がらなそうに見えた', '相手との空気が少し不安になった', '段取りが曖昧で不安になった']],
    ['友達の提案に乗り切れない時、心の中で思っていることに近いのは？', ['それで本当に何か変わるかな', 'それ、自分っぽくないな', '今の自分には少し重いな', 'それ、ちゃんと楽しいのかな', 'ちゃんと話せる時間はあるかな', '情報が少なすぎて決めにくいな']],
    ['初めての場所に行く前、いちばん気になるのは？', ['自分でも一歩踏み出せそうな雰囲気か', 'そこに自分らしさを出せる余地があるか', '疲れすぎずに過ごせそうか', 'ちゃんと楽しい空気がありそうか', '一緒に行く人と自然に話せそうか', '行き方・料金・混み具合が分かるか']],
    ['何かに誘われた時、行くかどうかを決める最後の一押しは？', ['今の自分が少し変われそうか', '自分の好みに合っていそうか', '安心して過ごせそうか', 'その場が盛り上がりそうか', '一緒に過ごす時間がよさそうか', '情報が十分にそろっているか']],
    ['予定を立てたのに、行くのが面倒になる理由に近いのは？', ['決めた時より気持ちが弱くなった', 'なんか自分に合わない気がしてきた', '疲れて外に出る気分じゃなくなった', '思ったより楽しそうに感じなくなった', '誰かと過ごす気持ちの余裕がなくなった', '準備や移動が面倒に見えてきた']],
    ['何かを選ぶ時、つい見てしまうものは？', ['そこで新しい発見がありそうか', '雰囲気や見た目に自分の好みがあるか', '空間や人との距離感が心地よさそうか', '写真や動画から楽しさが伝わるか', '誰かと自然に会話できそうか', '詳細情報が分かりやすく整理されているか']],
    ['「今日はいい日だった」と思うのはどんな日？', ['ちょっとでも新しい自分を見つけた日', '自分らしい選択ができた日', '心が少し軽くなった日', '思い出に残る楽しいことがあった日', '誰かとあたたかい時間を過ごせた日', '予定通りに気持ちよく動けた日']],
    ['苦手な状況に一番近いのは？', ['毎日が同じように過ぎていくこと', '周りに合わせすぎて自分が薄くなること', '騒がしすぎて落ち着けないこと', '退屈で何も起きないこと', '会話が浅いまま終わること', '情報が曖昧なまま動くこと']],
    ['グループの中で自然となりやすい役割は？', ['「これやってみない？」と可能性を出す人', '少し違う視点を持ち込む人', 'みんなの温度感を見て調整する人', '場を明るくして勢いをつける人', '話しやすい空気を作る人', '候補や時間をまとめる人']],
    ['何かを始める時、あなたを止めやすいものは？', ['最初の一歩の重さ', '自分に合うか分からない不安', 'エネルギー不足', 'ワクワクしきれない感じ', '相手との距離感の不安', '判断材料の少なさ']],
    ['写真を撮るなら、残したいのは？', ['初めてできた瞬間', '自分らしいものや雰囲気', '光や空気感がきれいな場面', '笑っている瞬間や盛り上がり', '誰かと過ごしたあたたかい時間', '後で見返して思い出せる記録']],
    ['友達から言われて一番うれしいのは？', ['一緒にいると新しいことできそう', 'その選び方、君っぽい', '一緒にいると落ち着く', 'いると場が明るくなる', '話してると安心する', 'いてくれると安心して決められる']],
    ['予定を決める話し合いで、少し苦手なのは？', ['結局いつもの場所になること', 'みんなが無難な案だけを選ぶこと', '予定が詰まりすぎること', '盛り上がりどころが見えないこと', 'ちゃんと話す時間がなさそうなこと', '情報が曖昧なまま決まること']],
    ['誰かを誘う時、あなたが言いやすい言葉は？', ['ちょっと新しいことしてみない？', 'ここ、なんか雰囲気よさそう', '無理な予定じゃないし、少しだけ行こう', 'これ絶対楽しいと思う', 'ゆっくり話せそうだから行かない？', '時間と場所はこんな感じ。どう？']],
    ['恋愛や気になる相手との関係で、惹かれやすいのは？', ['一緒にいると自分の世界が広がる人', '自分の感性や好きなものを分かってくれる人', '無理をしなくても安心できる人', '一緒にいると日常が楽しくなる人', '食事や会話の時間が自然に心地いい人', '約束や言葉が誠実で分かりやすい人']],
    ['距離が縮まるきっかけになりやすいのは？', ['一緒に初めてのことをした時', '好きなものの話で深く共感した時', '沈黙しても気まずくなかった時', '一緒に笑える瞬間が多かった時', '同じ時間をゆっくり味わえた時', '相手がちゃんと予定や言葉を大事にしてくれた時']],
    ['好きな人や気になる人と出かけるなら、一番避けたいのは？', ['何も起きず、距離も変わらないこと', '自分の好きなものを分かってもらえないこと', '気を遣いすぎて疲れること', '会話や空気が盛り上がらないこと', '話したいのに落ち着く時間がないこと', '予定が曖昧で不安になること']],
    ['恋愛で冷めやすい瞬間に近いのは？', ['可能性を否定された時', '好きなものを雑に扱われた時', 'ノリやテンションを強制された時', '反応が薄くて楽しくなさそうな時', '一緒にいる時間を雑に扱われた時', '予定や言葉が曖昧な時']],
    ['相手から誘われるなら、どれが一番動きやすい？', ['ちょっとだけ行ってみない？', 'ここ、君っぽいと思った', '疲れたらすぐ帰っていいよ', 'これ絶対おもろいから行こう', 'ゆっくり話せるところ行かない？', '何時に、ここで、これしよう']],
    ['あなたの中の“止まる理由”に近いのは？', ['きっかけがないと動き出せない', '自分に合わなそうだと試す前に引く', '体力や気力が足りないと閉じる', '楽しそうに見えないと興味が消える', '人との空気が読めないと不安になる', '判断材料が足りないと決められない']],
    ['予定を保存したのに行かない時、ありがちな理由は？', ['保存した時点で少し満足してしまう', '後から「やっぱり違うかも」と感じる', '当日の自分の元気が足りない', '他にもっと楽しそうなものを探してしまう', '誰と行くか決まらず流れる', '詳細確認が面倒になって止まる']],
    ['新しい場所に入る直前、少し不安になるのは？', ['自分が浮かないか', '自分の好みに合うか', '疲れないか', 'ちゃんと楽しめるか', '一緒にいる人と自然に過ごせるか', '何をすればいいか分かるか']],
    ['周りから誤解されやすいところは？', ['迷っているだけなのに、やる気がないように見られる', 'こだわっているだけなのに、わがままに見られる', '疲れているだけなのに、ノリが悪く見られる', '楽しさを求めているだけなのに、軽く見られる', '空気を大事にしているだけなのに、受け身に見られる', '確認しているだけなのに、慎重すぎると思われる']],
    ['「この人とは合うかも」と思う瞬間は？', ['一緒にいると新しい自分が出る', '自分のこだわりを面白がってくれる', '無言でも空気が重くならない', '笑うタイミングやノリが合う', '食べたり話したりする時間が自然に心地いい', '約束や言葉がちゃんとしている']],
    ['行った後に一番後悔しやすいのは？', ['何も変わらなかったと感じる時', '自分らしくいられなかった時', '無理して疲れすぎた時', '思ったより盛り上がらなかった時', 'ちゃんと話せずに終わった時', '段取りが悪くてストレスだった時']],
    ['予定を選ぶ時、最後に背中を押す情報は？', ['初心者でも入りやすいか', '雰囲気や世界観が伝わるか', '混み具合や落ち着きやすさが分かるか', '楽しそうな写真や動画があるか', '誰と行くと良さそうか分かるか', '料金・場所・時間が明確か']],
    ['あなたに合いやすい“今日のミッション”は？', ['初めてのことを1つだけ試す', '自分っぽいものを1つ見つける', '心が落ち着く場所を1つ選ぶ', '誰かと楽しい瞬間を1つ作る', '誰かとゆっくり話す時間を作る', '候補を3つまで絞って1つ選ぶ']],
    ['失敗しにくい予定に必要なのは？', ['ハードルが低いこと', '自分に合う余地があること', '途中で休めること', '盛り上がる要素があること', '会話や食事の時間が自然に入っていること', '事前に流れが分かること']],
    ['今のあなたに一番近い言葉は？', ['正解はまだ分からないけど、何かを変えたい', 'みんなと同じより、自分にしっくりくるものを選びたい', '無理に動くより、まず整えてから進みたい', '日常に少しでも楽しい予定を入れたい', '誰かと過ごす時間を、もう少し大事にしたい', 'ちゃんと分かれば、安心して動ける']],
    ['普段、休日の予定はどう決まることが多い？', ['自分で探して決める', '友達に誘われる', '家族や周りに合わせる', 'SNSで見て決める', '食事や会話の流れで決まる', '予定を立てずに過ごすことが多い']],
    ['行きたいと思ったのに、実際に行かなかった経験はどれくらいある？', ['よくある', 'たまにある', 'あまりない', 'ほとんどない', '誰と行くかによって変わる', 'まだ分からない']],
    ['行きたいと思ったのに行かなかった時、理由に近いのは？', ['一緒に行く人がいなかった', '情報が足りなかった', 'お金や距離が気になった', '面倒になった', '誰かと自然に過ごせるか不安だった', '自分に合うか不安だった']],
    ['新しい場所や予定に行く時、誰となら動きやすい？', ['1人', '親しい友達', '恋人/気になる人', '大人数の友達', 'ゆっくり話せる相手', '誰かに誘われた時だけ']],
    ['予定を決める時、一番信用しやすい情報は？', ['公式情報', '友達の口コミ', 'Instagram', 'TikTok/ショート動画', '実際に行った人の雰囲気が分かる声', 'Googleマップや予約サイト']]
  ];

  var RESULT_TEXT = {
    nexsuke: {
      copy: 'あなたは、変わりたい気持ちはあるのに、最初の一歩だけがやたら重くなりやすいタイプです。',
      basic: 'ネクスケ型のあなたは、まだ自分の正解を決めきっていないタイプです。心の中ではずっと「今のままでいいのかな」「何かきっかけがあれば変われるかも」と感じていることがあります。最初から強い目的を持って動くより、動いた後に意味を見つけるタイプです。',
      outside: '周りからは少し迷いやすい人に見えるかもしれません。でも本当は、可能性を見ているからこそ迷っています。決断が遅いのではなく、選んだ先に何があるかを考えているタイプです。',
      friends: '友達の中では、新しい案を出す人になりやすいです。誰かに「それいいじゃん」と言われると一気に動きやすくなります。',
      romance: '恋愛では、一緒に新しいことをした時に相手の印象が変わりやすいタイプです。「この人といると、自分の世界が少し広がる」と感じた時に惹かれやすいです。',
      invitation: '「ちょっとだけ行ってみない？」重すぎない誘いが一番動きやすいです。',
      cooldown: '「どうせ無理」「意味なくない？」と可能性を否定された時。',
      decision: '直感では気になっているのに、最後の決定を先延ばしにしやすいです。保存だけして満足することもあります。',
      manual: ['大きな挑戦より、小さな一歩の方が動きやすい', '強く押されすぎると引きやすい', '「試してみるだけ」でハードルが下がる', '可能性を否定されると止まりやすい', '誰かに軽く背中を押されると動きやすい'],
      yodomi: '「また今度でいいか」「今じゃなくてもいいか」「もう少し調べてからでいいか」と思った時、あなたの中のヨドミが出やすいです。',
      recover: '予定を人生を変える一歩にしようとしなくて大丈夫です。まずは15分だけ試す、1件だけ保存する、誰かに送る。小さく始めるほど、あなたは動きやすくなります。',
      good: '初めて感がある、ハードルが低い、行った後に少し気持ちが変わるもの。',
      bad: '準備が多すぎるもの、常連感が強すぎるもの、目的意識が強すぎるもの。',
      match: 'シルベ型。あなたの可能性を、現実の予定に落としてくれるタイプです。',
      caution: 'イロドリ型。勢いはもらえるけど、急かされすぎると疲れることがあります。',
      story: 'ネクスケは、誰もまだ歩いていない白紙の地図から生まれた。誰かが新しい体験に踏み出すたびに、地図の線が少しだけ濃くなる。Nexca Townで育てると、白紙の地図に隠された“最初の道”が少しずつ解放されます。',
      today: '気になるものを1つだけ保存して、誰かに送る。送った時点で、もう半分動いています。',
      share: '私はネクスケ型。まだ知らない体験で、次の自分を見つけるタイプ。',
      prefs: ['低ハードル', 'はじめて', '友達と', '気軽']
    },
    tsugiha: {
      copy: 'あなたは、みんなと同じ選択をしていると、少しずつ自分が薄くなる感覚を持ちやすいタイプです。',
      basic: 'ツギハ型のあなたは、「自分に合うかどうか」をかなり大事にするタイプです。流行っているから、みんなが行っているから、便利だから、という理由だけでは心が動きにくいことがあります。',
      outside: '周りからは、こだわりがある人に見られやすいです。それはわがままではなく、自分の感覚を雑に扱いたくないだけです。',
      friends: '友達の中では、予定に少し個性を足したり、別の視点を持ち込むことがあります。',
      romance: '恋愛では、見た目やノリだけより、その人のこだわりやセンスに惹かれやすいタイプです。',
      invitation: '「ここ、君っぽいと思った」自分の感性を見てくれている誘いに弱いです。',
      cooldown: '自分の好きなものを軽く扱われた時。雑にまとめられると、一気に距離を取りたくなります。',
      decision: '人気順より雰囲気を見ます。写真、言葉、空気感で判断しやすいです。',
      manual: ['「流行ってる」より「似合いそう」が刺さる', '雑に扱われると心が閉じる', '自分らしさを見てくれる人に弱い', '量産感が強い場所は苦手', '一部でも好きになれる要素があると動きやすい'],
      yodomi: '「どうせ自分には合わない」「なんか違う」と、試す前に切ってしまう時に出やすいです。',
      recover: '完璧に合う場所を探さなくて大丈夫です。色・音・雰囲気・言葉のどれか1つが気になれば、それは行く理由になります。',
      good: '個性がある、背景がある、自分なりの楽しみ方ができるもの。',
      bad: '量産感が強いもの、映えるだけで中身が薄いもの、みんな同じ楽しみ方を求められるもの。',
      match: 'コモレビ型。あなたの感性を急かさず、自然に受け止めてくれるタイプです。',
      caution: 'シルベ型。整理してくれるのは助かるけど、正しさで詰められると息苦しく感じることがあります。',
      story: 'ツギハは、忘れられた布、ほどけた糸、古いタグの中から生まれた。終わったものを、明日の形へ仕立て直す存在。参加コードを入力すると、羽に新しい布の記憶が縫い込まれていきます。',
      today: '“全部好き”じゃなくていい。気になる色、音、雰囲気が1つでもある場所を選んでみる。',
      share: '私はツギハ型。昨日の自分を、明日の形に仕立てるタイプ。',
      prefs: ['古着', 'おしゃれ', '感性', '自分らしさ']
    },
    komorebi: {
      copy: 'あなたは、予定の楽しさよりも“その場で自分が消耗しないか”を無意識に見ているタイプです。',
      basic: 'コモレビ型のあなたは、刺激よりも心地よさを大切にするタイプです。自分の気分や空気の変化に敏感だからこそ、合う場所に行った時の回復力が大きいタイプです。',
      outside: '周りからは、落ち着いている人、やさしい人、空気を読める人に見られやすいです。',
      friends: '友達の中では、みんなの疲れ具合や空気を見ているタイプです。',
      romance: '恋愛では、ドキドキよりも安心できるかどうかをかなり見ています。沈黙が気まずくない人に惹かれやすいです。',
      invitation: '「疲れたらすぐ帰っていいよ」逃げ道を作ってくれる誘いに安心します。',
      cooldown: 'ノリを強制された時。無理にテンションを上げさせられると、しんどくなりやすいです。',
      decision: '距離、混み具合、座れるか、静かに過ごせるかを見がちです。',
      manual: ['無理に盛り上げなくていい', '逃げ道があると安心する', '静かな時間を軽く見ないでほしい', '人混みや騒がしさで消耗しやすい', '短時間の予定なら動きやすい'],
      yodomi: '「今日は無理」「外に出るだけで疲れる」と、全部閉じたくなる時に出やすいです。',
      recover: '予定を小さくしてください。楽しむためではなく、整えるために行く。そう考えると、動き出しやすくなります。',
      good: '落ち着ける、話しやすい、長居できる、自分のペースで楽しめるもの。',
      bad: '大人数、騒がしい、ノリを強要される、休む余白がないもの。',
      match: 'ツギハ型。静かに感性を共有できる相性です。',
      caution: 'イロドリ型。楽しい刺激をくれる一方で、ペースが速すぎると疲れやすいです。',
      story: 'コモレビは、誰かが深く息をついた窓辺に差し込んだ光から生まれた。カフェや落ち着ける場所の参加コードを入力すると、胸の小さな窓に少しずつ光が戻ります。',
      today: '近くで、短時間で、座れる場所を1つ選ぶ。それだけで十分です。',
      share: '私はコモレビ型。ひと息つきながら、次の自分へ進むタイプ。',
      prefs: ['カフェ', '屋内', '落ち着く', '短時間']
    },
    irodori: {
      copy: 'あなたは、予定そのものよりも“その場が動き出す感じ”に心が反応するタイプです。',
      basic: 'イロドリ型のあなたは、面白そうな空気を感じると一気に動けるタイプです。正しさや効率より、「楽しそう」「盛り上がりそう」「今しかなさそう」に反応します。',
      outside: '周りからは、明るい人、誘いやすい人、場を動かしてくれる人に見られやすいです。',
      friends: '友達の中では、予定に勢いをつける人です。誰かが迷っている時に、空気を変えることがあります。',
      romance: '恋愛では、一緒にいて日常が少し楽しくなる人に惹かれやすいです。',
      invitation: '「これ絶対おもろいから行こう」楽しい未来が見える誘いに弱いです。',
      cooldown: '反応が薄い時。自分だけが盛り上げている感じになると、少し疲れやすいです。',
      decision: '写真や動画の雰囲気にかなり左右されます。「誰と行くか」で楽しさが大きく変わるタイプです。',
      manual: ['楽しい未来が見えると動きやすい', '反応が薄いと冷めやすい', '誰かと共有できる予定に強い', '退屈そうな説明だと興味を失いやすい', 'ミッションがあると一気に動ける'],
      yodomi: '「なんかつまらなそう」「別に今日じゃなくていい」と感じた時に出やすいです。',
      recover: '予定にミッションを足してください。ただ行くのではなく、「写真を1枚撮る」みたいに、面白さを作ると動きやすくなります。',
      good: 'その場の熱がある、誰かと共有できる、写真や動画に残したくなる、話のネタになるもの。',
      bad: '静かすぎる、変化が少ない、何を楽しめばいいか分かりにくいもの。',
      match: 'ネクスケ型。あなたの勢いが、相手の一歩を引き出すことがあります。',
      caution: 'コモレビ型。相手のペースを見ないと疲れさせてしまうことがあります。',
      story: 'イロドリは、何も起きない一日に落ちた“最初の色”から生まれた。誰かが退屈な日常を動かすたびに、旗の白い部分が少しだけ震えます。',
      today: '気になる予定を1つ、友達に送ってみる。返信が来た瞬間に、日常が少し動き出します。',
      share: '私はイロドリ型。日常にワクワクを灯すタイプ。',
      prefs: ['イベント・体験', '友達と', 'ワクワク', 'ミッション']
    },
    honori: {
      copy: 'あなたは、派手な予定よりも“誰と、どんな空気で過ごしたか”を大切にするタイプです。',
      basic: 'ホノリ型のあなたは、場所そのものよりも、その時間に流れていた空気や会話をよく覚えているタイプです。どこに行ったかより、誰と何を話したか。細かいあたたかさを自然に受け取る力があります。',
      outside: '周りからは、話しやすい人、あたたかい人、気を張らずに一緒にいられる人に見られやすいです。',
      friends: '友達との関係では、最後にご飯を食べながら話す時間で満足感が高まりやすいです。',
      romance: '恋愛では、強いドキドキよりも「一緒にご飯を食べていて落ち着くか」をかなり見ています。',
      invitation: '「ゆっくり話せるところ行かない？」食事や会話の時間が自然に想像できる誘いに弱いです。',
      cooldown: '一緒にいる時間を雑に扱われた時。会話を急がれたり、ずっとスマホを見られたりすると、心が離れやすいです。',
      decision: '場所の派手さより、誰と行くか、どんな会話ができそうかを重視しがちです。',
      manual: ['食事や会話の時間を大事にする', '場所よりも空気を覚えている', '急かされると心が閉じやすい', '相手の小さな言葉に反応しやすい', '一緒に食べる時間で距離が縮まりやすい'],
      yodomi: '「ちゃんと話せないなら行かなくてもいいか」「気まずくなりそうだからやめよう」と感じた時に出やすいです。',
      recover: '完璧に盛り上がる予定を作らなくて大丈夫です。短い食事、軽い会話、帰り道の一言。それだけでも関係は少し進みます。',
      good: 'ランチ・ディナー、落ち着いて話せる場所、気になる人との食事、友達と今日のことを話せる時間。',
      bad: '会話する余白がない予定、食事や休憩が雑な予定、ずっと急かされる予定。',
      match: 'コモレビ型。落ち着いた空気を一緒に大切にできる相性です。',
      caution: 'イロドリ型。楽しい刺激をくれる一方で、勢いが強すぎると自分のペースを失いやすいです。',
      story: 'ホノリは、食卓の湯気とやさしい灯りから生まれた。ランチや夜ご飯の来店コードを入力すると、灯りに“言葉のかけら”が戻っていきます。',
      today: '誰かとゆっくり話せる時間を1つ作る。短いご飯でも、関係が少し近づくことがあります。',
      share: '私はホノリ型。ひと皿の時間に、会話の灯りをともすタイプ。',
      prefs: ['ランチ・ディナー', '話す', 'デート', '屋内']
    },
    shirube: {
      copy: 'あなたは、勢いで動けないのではなく、納得できる道が見えないと動きたくないタイプです。',
      basic: 'シルベ型のあなたは、情報を整理してから動きたいタイプです。場所、時間、料金、雰囲気、行き方、誰と行くか。判断材料がそろうと安心して動けます。',
      outside: '周りからは、しっかりしている人、頼れる人、考えてから動く人に見られやすいです。',
      friends: '友達の中では、予定を成立させる人です。時間、場所、料金、移動を整理して、みんなが動ける形にすることがあります。',
      romance: '恋愛では、勢いだけで好きになるより、相手の誠実さや安心できる行動を見て惹かれやすいです。',
      invitation: '「何時に、ここで、これしよう」具体的な誘いが一番安心します。',
      cooldown: '予定や言葉が曖昧な時。「たぶん」「そのうち」が多い相手には疲れやすいです。',
      decision: '詳細ページをちゃんと読むタイプです。口コミ、地図、料金、時間を見てから判断したくなります。',
      manual: ['情報があると安心して動ける', '曖昧な誘いは苦手', '誠実さや具体性に弱い', '予定の流れが見えると楽しめる', '調べすぎて疲れることがある'],
      yodomi: '「もう少し調べてから」「失敗したら嫌だな」と、調べ続けて止まる時に出やすいです。',
      recover: '情報収集に制限時間をつけてください。場所・時間・料金の3つがそろったら決める、くらいで十分です。',
      good: '情報が整理されている、予約や料金が分かりやすい、当日の流れが想像できるもの。',
      bad: '情報が雑、場所や料金が分からない、その場ノリが強すぎる、不確定要素が多いもの。',
      match: 'ネクスケ型。あなたが道を作ることで、相手が一歩踏み出しやすくなります。',
      caution: 'ツギハ型。感性を大事にする相手なので、正しさや効率だけで進めるとすれ違うことがあります。',
      story: 'シルベは、誰かが迷ったあとに残した小さな道しるべから生まれた記録者。参加コードや体験カードが増えるほど、記録帳に失われたページの手がかりが戻ります。',
      today: '気になる候補を3つまでに絞る。その中で一番ハードルが低いものを選んでみる。',
      share: '私はシルベ型。選んだ道を、未来につなげるタイプ。',
      prefs: ['予約しやすい', '情報明確', '地図あり', '安心']
    }
  };

  var INTROS = [
    ['ネクスケ', '白紙の地図を持つ、Nexcaの主人公。まだ何者でもないから、どこへでも行ける。'],
    ['ツギハ', '忘れられた布やほどけた糸から生まれた、リメイクの精霊。'],
    ['コモレビ', '窓辺に差し込む光と、誰かのひと息から生まれた存在。'],
    ['イロドリ', '何も起きない一日に落ちた、最初の色から生まれた存在。'],
    ['ホノリ', '食卓の湯気とやさしい灯りから生まれた存在。'],
    ['シルベ', '誰かが迷ったあとに残した、小さな道しるべから生まれた記録者。'],
    ['ヨドミ', '止まれば傷つかない、とささやく停滞の影。倒す敵ではなく、動けなくなる理由を教えてくれる存在。']
  ];

  var state = { started: false, index: 0, answers: [], scores: null, latestResult: null };

  function $(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }
  function zero(keys) { return keys.reduce(function(o, k) { o[k] = 0; return o; }, {}); }
  function freshScores() {
    return {
      characterScores: zero(OPTION_KEYS),
      behaviorScores: zero(['noveltySeeking', 'selfExpression', 'comfortSeeking', 'socialExcitement', 'warmConversation', 'claritySeeking']),
      brakeScores: zero(BRAKES),
      relationshipScores: zero(['proposer', 'individualist', 'moodReader', 'energizer', 'warmConnector', 'organizer']),
      romanceScores: zero(['growthTogether', 'senseMatching', 'emotionalSafety', 'funChemistry', 'mealBasedBonding', 'trustAndClarity']),
      experienceScores: zero(['lowBarrier', 'selfFit', 'comfort', 'memorable', 'sharedTimeValue', 'clearInfo']),
      researchScores: zero(['activeDiscovery', 'passiveInvitation', 'actionGap', 'companionDependency', 'trustedInformationSource', 'mealAndConversationNeed', 'relationshipComfort', 'sharedExperienceMotivation'])
    };
  }
  function addScore(scores, qIndex, optionIndex) {
    var charKey = OPTION_KEYS[optionIndex];
    scores.characterScores[charKey] += 1;
    AXES.forEach(function(axisSet, axisGroupIndex) {
      var target = ['behaviorScores', 'relationshipScores', 'romanceScores', 'experienceScores'][axisGroupIndex];
      scores[target][axisSet[optionIndex]] += 1;
    });
    if ([1, 2, 5, 10, 20, 21, 22, 23, 25, 32].indexOf(qIndex) >= 0) {
      scores.brakeScores[BRAKES[optionIndex]] += 1;
    }
    if (qIndex >= 30) {
      scores.researchScores[RESEARCH[Math.min(optionIndex, RESEARCH.length - 1)]] += 1;
    }
    if (charKey === 'honori') {
      scores.researchScores.mealAndConversationNeed += 1;
      scores.researchScores.relationshipComfort += 1;
      scores.researchScores.sharedExperienceMotivation += 1;
    }
  }
  function recompute() {
    state.scores = freshScores();
    state.answers.forEach(function(answer, qIndex) {
      if (typeof answer === 'number') addScore(state.scores, qIndex, answer);
    });
  }
  function mainEl() { return $('diag') || $('diagnosis') || document.querySelector('[data-screen="diag"]'); }

  function boot() {
    var root = mainEl();
    if (!root) return;
    root.classList.add('nxdiag-screen');
    renderStart();
  }

  function shell(inner) {
    var root = mainEl();
    if (!root) return;
    root.innerHTML = '<div class="nxdiag" id="nxdiag-root">' + inner + '</div>';
  }

  function renderStart() {
    var chars = CHARS.map(function(c) {
      return '<div class="nxdiag-mini-char" style="--c:' + c.color + '"><div class="nxdiag-char-orb">' + esc(c.icon) + '</div><b>' + esc(c.name) + '</b><span>' + esc(c.type.replace('タイプ', '')) + '</span></div>';
    }).join('');
    var intros = INTROS.map(function(x) { return '<div class="nxdiag-intro"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }).join('');
    shell(
      '<div class="nxdiag-start">' +
        '<div class="nxdiag-brand">Nexca</div>' +
        '<h1>Nexcaキャラ診断</h1>' +
        '<p class="nxdiag-sub">まだ知らない体験が、次の自分を連れてくる</p>' +
        '<div class="nxdiag-meta"><span>35問</span><span>約5〜7分</span><span>自己理解診断</span></div>' +
        '<p class="nxdiag-lead">この診断は、あなたの予定の決め方、友達との関わり方、恋愛での距離感、動き出せなくなる理由をもとに、Nexcaの6キャラの中から近いタイプを見つける自己理解診断です。</p>' +
        '<p class="nxdiag-note">心理学や行動科学で扱われる意思決定の傾向、人との距離感、刺激への反応、安心感、不確実な状況への向き合い方などの考え方を参考にしています。医療診断・正式な性格検査ではなく、まだ知らない体験へ一歩踏み出すためのヒントとして楽しんでください。</p>' +
        '<div class="nxdiag-char-grid">' + chars + '</div>' +
        '<label class="nxdiag-consent"><input id="nxdiag-consent" type="checkbox" onchange="NexcaDiagnosis.toggleConsent(this.checked)"> <span>診断結果や回答データは、個人が特定されない形で、Nexcaの改善や研究・分析に利用される場合があります。</span></label>' +
        '<button class="nxdiag-primary" id="nxdiag-start-btn" disabled onclick="NexcaDiagnosis.start()">診断をはじめる</button>' +
        '<details class="nxdiag-intros"><summary>公式キャラを少し見る</summary><div>' + intros + '</div></details>' +
      '</div>'
    );
  }

  function toggleConsent(ok) {
    var btn = $('nxdiag-start-btn');
    if (btn) btn.disabled = !ok;
  }

  function start() {
    state.started = true;
    state.index = 0;
    state.answers = [];
    state.scores = freshScores();
    recordEvent('start_diagnosis', {});
    renderQuestion();
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var pct = Math.round((state.index / QUESTIONS.length) * 100);
    var options = q[1].map(function(opt, i) {
      var c = CHARS[i];
      var selected = state.answers[state.index] === i ? ' is-selected' : '';
      return '<button class="nxdiag-option' + selected + '" style="--c:' + c.color + '" onclick="NexcaDiagnosis.answer(' + i + ')"><span>' + String.fromCharCode(65 + i) + '</span><b>' + esc(opt) + '</b></button>';
    }).join('');
    shell(
      '<div class="nxdiag-question-wrap">' +
        '<div class="nxdiag-qtop"><button class="nxdiag-back" onclick="NexcaDiagnosis.back()">戻る</button><div><b>' + (state.index + 1) + '/35</b><span>あなたの中の輪郭を読み取り中</span></div></div>' +
        '<div class="nxdiag-progress"><i style="width:' + pct + '%"></i></div>' +
        '<div class="nxdiag-question-card">' +
          '<div class="nxdiag-qno">QUESTION ' + String(state.index + 1).padStart(2, '0') + '</div>' +
          '<h2>' + esc(q[0]) + '</h2>' +
          '<div class="nxdiag-options">' + options + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function answer(optionIndex) {
    state.answers[state.index] = optionIndex;
    recompute();
    recordEvent('answer_diagnosis_question', { question: state.index + 1, answer: String.fromCharCode(65 + optionIndex) });
    var buttons = document.querySelectorAll('.nxdiag-option');
    buttons.forEach(function(btn, i) { btn.classList.toggle('is-selected', i === optionIndex); });
    setTimeout(function() {
      state.index += 1;
      if (state.index >= QUESTIONS.length) {
        showLoading();
      } else if ([10, 20, 30].indexOf(state.index) >= 0) {
        showMilestone(state.index);
      } else {
        renderQuestion();
      }
    }, 260);
  }

  function back() {
    if (!state.started || state.index <= 0) {
      renderStart();
      return;
    }
    state.index -= 1;
    renderQuestion();
  }

  function showMilestone(n) {
    var messages = {
      10: '少しずつ、あなたの中のキャラが見えてきました',
      20: '行動のクセと、人との距離感を読み解いています',
      30: '最後に、あなたが動き出す条件を確かめます'
    };
    shell(
      '<div class="nxdiag-mid">' +
        '<div class="nxdiag-mid-orbs">' + CHARS.map(function(c) { return '<i style="--c:' + c.color + '"></i>'; }).join('') + '</div>' +
        '<h2>' + esc(messages[n]) + '</h2>' +
        '<p>' + n + '/35 まで進みました。もう少しで、あなたの体験タイプが見えてきます。</p>' +
        '<button class="nxdiag-primary" onclick="NexcaDiagnosis.renderQuestion()">続ける</button>' +
      '</div>'
    );
  }

  function showLoading() {
    shell(
      '<div class="nxdiag-loading">' +
        '<div class="nxdiag-light-ring">' + CHARS.map(function(c) { return '<i style="--c:' + c.color + '"></i>'; }).join('') + '<em></em></div>' +
        '<h2>診断結果を生成中...</h2>' +
        '<p>ネクスケ、ツギハ、コモレビ、イロドリ、ホノリ、シルベの光が順番に灯っています。</p>' +
        '<p class="nxdiag-yodomi-line">あなたの中のヨドミも読み解いています</p>' +
      '</div>'
    );
    setTimeout(showResult, 2100);
  }

  function resultKey() {
    var scores = state.scores.characterScores;
    var max = Math.max.apply(null, OPTION_KEYS.map(function(k) { return scores[k]; }));
    var tied = OPTION_KEYS.filter(function(k) { return scores[k] === max; });
    if (tied.length === 1) return tied[0];
    for (var i = state.answers.length - 1; i >= 0; i--) {
      var key = OPTION_KEYS[state.answers[i]];
      if (tied.indexOf(key) >= 0) return key;
    }
    var brakeTop = topKey(state.scores.brakeScores);
    var consistency = {
      firstStepHeavy: 'nexsuke',
      fitAnxiety: 'tsugiha',
      energyLow: 'komorebi',
      excitementLow: 'irodori',
      relationshipHesitation: 'honori',
      informationAnxiety: 'shirube'
    };
    return tied.indexOf(consistency[brakeTop]) >= 0 ? consistency[brakeTop] : 'nexsuke';
  }

  function topKey(obj) {
    return Object.keys(obj).sort(function(a, b) { return obj[b] - obj[a]; })[0];
  }

  function showResult() {
    var key = resultKey();
    var char = KEY_TO_CHAR[key];
    var text = RESULT_TEXT[key];
    state.latestResult = key;
    saveResult(key);
    recordEvent('complete_diagnosis', { result_character: key });
    try { if (window.addPt) window.addPt('診断完了', 15, false, 'diag_final_v1'); } catch (e) {}
    var scoreBars = CHARS.map(function(c) {
      var score = state.scores.characterScores[c.key] || 0;
      var pct = Math.max(8, Math.round((score / QUESTIONS.length) * 100));
      return '<div class="nxdiag-score-row"><span>' + esc(c.name) + '</span><div><i style="width:' + pct + '%;background:' + c.color + '"></i></div><b>' + score + '</b></div>';
    }).join('');
    var sections = [
      ['基本性格', text.basic],
      ['周りから見たあなた', text.outside],
      ['友達関係でのあなた', text.friends],
      ['恋愛でのあなた', text.romance],
      ['刺さる誘われ方', text.invitation],
      ['冷めやすい瞬間', text.cooldown],
      ['予定を決める時のクセ', text.decision],
      ['あなたの取扱説明書', '<ul>' + text.manual.map(function(x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'],
      ['あなたの中のヨドミ', text.yodomi],
      ['ヨドミから戻る方法', text.recover],
      ['合う過ごし方', text.good],
      ['合わない過ごし方', text.bad],
      ['相性の良いタイプ', text.match],
      ['注意が必要なタイプ', text.caution],
      ['誕生秘話：物語のかけら', text.story],
      ['今日の一歩', text.today]
    ].map(function(sec) { return '<section class="nxdiag-result-section"><h3>' + esc(sec[0]) + '</h3><div>' + sec[1] + '</div></section>'; }).join('');
    var shareCard =
      '<div class="nxdiag-share-card" style="--c:' + char.color + '">' +
        '<span>Nexcaキャラ診断</span><h3>' + esc(char.name) + '型</h3><b>' + esc(char.type) + '</b><p>' + esc(text.copy) + '</p><small>' + esc(text.share) + '</small>' +
      '</div>';
    shell(
      '<div class="nxdiag-result" style="--c:' + char.color + ';--g:' + char.glow + '">' +
        '<div class="nxdiag-result-hero">' +
          '<div class="nxdiag-result-badge">RESULT</div>' +
          '<div class="nxdiag-result-orb">' + esc(char.icon) + '</div>' +
          '<h1>' + esc(char.name) + '型</h1>' +
          '<h2>' + esc(char.type) + '</h2>' +
          '<p>' + esc(text.copy) + '</p>' +
        '</div>' +
        '<section class="nxdiag-score-card"><h3>6キャラのスコア内訳</h3>' + scoreBars + '</section>' +
        sections +
        '<section class="nxdiag-result-section nxdiag-yodomi"><h3>ヨドミについて</h3><div>ヨドミは診断結果キャラではありません。あなたの中の行動ブレーキ、迷い、停滞、「また今度でいいか」という気持ちを映す影です。倒す敵ではなく、動けなくなる理由を教えてくれる存在です。</div></section>' +
        '<section class="nxdiag-result-section"><h3>ガチャ・Nexca Town連動</h3><div>この結果は、次のガチャ条件やNexca Townのキャラ育成に使えるよう保存されます。' + esc(char.name) + 'に合う条件：' + text.prefs.map(function(p) { return '<span class="nxdiag-chip">' + esc(p) + '</span>'; }).join('') + '</div></section>' +
        '<section class="nxdiag-result-section"><h3>SNS共有カード</h3>' + shareCard + '</section>' +
        '<div class="nxdiag-actions"><button onclick="NexcaDiagnosis.share()">結果を共有する</button><button onclick="NexcaDiagnosis.goGacha()">ガチャへ進む</button><button onclick="NexcaDiagnosis.goTown()">Nexca Townで続きを見る</button><button onclick="NexcaDiagnosis.retry()">もう一度診断する</button></div>' +
      '</div>'
    );
  }

  function researchSummary(key) {
    var answers = state.answers;
    function label(q) {
      var opt = answers[q];
      return opt == null ? null : QUESTIONS[q][1][opt];
    }
    return {
      result_character: key,
      main_brake_type: topKey(state.scores.brakeScores),
      invitation_style: label(19) || label(14),
      group_role: label(9),
      romance_style: label(15),
      decision_style: label(26),
      preferred_experience_condition: label(28),
      usual_plan_decision_style: label(30),
      interest_action_gap_frequency: label(31),
      non_participation_reason: label(32),
      easiest_companion_type: label(33),
      trusted_information_source: label(34),
      meal_and_conversation_need: state.scores.researchScores.mealAndConversationNeed,
      relationship_comfort: state.scores.researchScores.relationshipComfort,
      shared_experience_motivation: state.scores.researchScores.sharedExperienceMotivation
    };
  }

  function profileMeta() {
    var age = window.age || localStorage.getItem('nx_age') || localStorage.getItem('nexca_age_group') || null;
    var region = localStorage.getItem('nx_region') || localStorage.getItem('nexca_region') || null;
    try {
      var p = JSON.parse(localStorage.getItem('nexca_profile') || '{}');
      age = age || p.age_group || p.age;
      region = region || p.region || p.area;
    } catch (e) {}
    return { age_group: age, region: region };
  }

  function saveResult(key) {
    var meta = profileMeta();
    var answers = state.answers.map(function(opt, idx) {
      return { question_no: idx + 1, answer: String.fromCharCode(65 + opt), text: QUESTIONS[idx][1][opt], character: OPTION_KEYS[opt] };
    });
    var payload = {
      user_id: window.user && window.user.id ? window.user.id : null,
      age_group: meta.age_group,
      region: meta.region,
      result_character: key,
      character_scores: state.scores.characterScores,
      behavior_scores: state.scores.behaviorScores,
      brake_scores: state.scores.brakeScores,
      relationship_scores: state.scores.relationshipScores,
      romance_scores: state.scores.romanceScores,
      experience_scores: state.scores.experienceScores,
      research_scores: state.scores.researchScores,
      answers: answers,
      created_at: new Date().toISOString()
    };
    var summary = Object.assign({
      user_id: payload.user_id,
      age_group: payload.age_group,
      region: payload.region,
      created_at: payload.created_at
    }, researchSummary(key));
    try {
      localStorage.setItem('nexca_diagnosis_latest_v1', JSON.stringify(payload));
      var all = JSON.parse(localStorage.getItem('nexca_diagnosis_results_v1') || '[]');
      all.unshift(payload);
      localStorage.setItem('nexca_diagnosis_results_v1', JSON.stringify(all.slice(0, 20)));
      localStorage.setItem('nexca_gacha_initial_v1', JSON.stringify({ result_character: key, character_name: KEY_TO_CHAR[key].name, prefs: RESULT_TEXT[key].prefs, created_at: payload.created_at }));
      localStorage.setItem('nexca_town_focus_character', key);
    } catch (e) {}
    if (window.sb && window.user && window.user.id) {
      window.sb.from('diagnosis_results').insert(payload).then(function() {}).catch(function() {});
      window.sb.from('diagnosis_research_summary').insert(summary).then(function() {}).catch(function() {});
    }
  }

  function recordEvent(type, metadata) {
    var meta = { event_type: type, source: 'nexca_character_diagnosis', metadata: metadata || {}, created_at: new Date().toISOString() };
    if (window.user && window.user.id) meta.user_id = window.user.id;
    try {
      var events = JSON.parse(localStorage.getItem('nexca_user_behavior_events_v1') || '[]');
      events.unshift(meta);
      localStorage.setItem('nexca_user_behavior_events_v1', JSON.stringify(events.slice(0, 100)));
    } catch (e) {}
    if (window.sb && window.user && window.user.id) {
      window.sb.from('user_behavior_events').insert(meta).then(function() {}).catch(function() {});
    }
  }

  function share() {
    var key = state.latestResult || resultKey();
    var char = KEY_TO_CHAR[key];
    var text = '私は' + char.name + '型。まだ知らない体験が、次の自分を連れてくる。#Nexcaキャラ診断';
    recordEvent('share_diagnosis_result', { result_character: key });
    if (navigator.share) {
      navigator.share({ title: 'Nexcaキャラ診断', text: text, url: location.href }).catch(function() {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + '\n' + location.href).then(function() {
        if (window.toast) window.toast('診断結果をコピーしました');
      });
    }
  }

  function goGacha() {
    var key = state.latestResult || resultKey();
    recordEvent('click_gacha_from_diagnosis', { result_character: key, prefs: RESULT_TEXT[key].prefs });
    try { localStorage.setItem('nexca_gacha_initial_v1', JSON.stringify({ result_character: key, prefs: RESULT_TEXT[key].prefs, created_at: new Date().toISOString() })); } catch (e) {}
    if (window.goTab) {
      var nav = document.querySelectorAll('.nb')[3];
      window.goTab('points', nav);
      if (window.toast) window.toast('結果キャラをガチャ条件に保存しました');
    }
  }

  function goTown() {
    var key = state.latestResult || resultKey();
    recordEvent('click_town_from_diagnosis', { result_character: key });
    try { localStorage.setItem('nexca_town_focus_character', key); } catch (e) {}
    if (window.openTown) window.openTown();
    else if (window.goTab) window.goTab('mypage', document.querySelectorAll('.nb')[4]);
  }

  function retry() {
    renderStart();
  }

  window.NexcaDiagnosis = {
    boot: boot,
    toggleConsent: toggleConsent,
    start: start,
    renderQuestion: renderQuestion,
    answer: answer,
    back: back,
    share: share,
    goGacha: goGacha,
    goTown: goTown,
    retry: retry
  };
  window.startDiag = start;
  window.diagBack = back;
  window.selQ = answer;
  window.retryDiag = retry;
  window.shareDiag = share;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
