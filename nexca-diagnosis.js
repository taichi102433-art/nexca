(function() {
  'use strict';

  var appBase = location.pathname.indexOf('/nexca/') >= 0 ? '/nexca/' : '';
  function charImage(key) { return appBase + 'assets/characters/' + key + '.png'; }
  var CHAR_ORDER = ['nexsuke', 'tsugiha', 'komorebi', 'irodori', 'honori', 'shirube'];
  var CHARS = {
    nexsuke: { name: 'ネクスケ', type: '白紙の地図タイプ', color: '#8FC7E8', bg: '#f2f8fb', image: charImage('nexsuke'), short: 'はじめの一歩', food: 'おにぎり', place: '知らない道の入口', time: '朝、まだ予定が決まっていない時間', personality: '気になるものは多いけど、最初の一歩だけ少し重い', weak: '最初から「無理」と決めつけられること', phrase: 'ちょっとだけ行ってみよ', move: 'めちゃくちゃ迷ったあと、急に一番知らない道を選ぶ', close: '急に「こっち行ってみない？」と言い出す' },
    tsugiha: { name: 'ツギハ', type: '自分らしさリメイクタイプ', color: '#9B6A4B', bg: '#fbf3ec', image: charImage('tsugiha'), short: 'らしさをつくる', food: '焼き芋', place: '古着屋、雑貨屋、少しクセのある店', time: '夕方の買い物帰り', personality: 'こだわり強め。人の“その人っぽさ”を見つけるのが得意', weak: '「みんな同じでいいじゃん」と言われること', phrase: 'それ、君っぽくできるよ', move: '人の服を見て、勝手に“第2形態”を想像している', close: '似合う色や服を勝手に考え始める' },
    komorebi: { name: 'コモレビ', type: 'ひと息チャージタイプ', color: '#A7C88A', bg: '#f5faef', image: charImage('komorebi'), short: 'ひとやすみ上手', food: 'プリン', place: '窓辺の席、静かなカフェ', time: '午後のひと息つける時間', personality: '落ち着いていて、空気の変化に敏感', weak: '急かされること、ずっとテンション高めでいること', phrase: '少し休んだら、また行けるよ', move: '集合して5分でも、誰かが疲れてそうなら休憩を提案する', close: '疲れている時に、そっと休憩をすすめてくる' },
    irodori: { name: 'イロドリ', type: 'ワクワク点火タイプ', color: '#F26A3D', bg: '#fff1eb', image: charImage('irodori'), short: 'ワクワク点火', food: 'ポップコーン', place: 'イベント会場、にぎやかな通り、写真を撮りたくなる場所', time: '予定が急に動き出す瞬間', personality: '明るくて勢いがある。退屈な日を面白くしたがる', weak: '何も起きない空気、反応が薄いこと', phrase: 'それ、今日やったら面白くない？', move: '思いつきで企画を始めて、段取りはだいたいシルベを見る', close: '変な企画に巻き込んでくる' },
    honori: { name: 'ホノリ', type: '食卓あかりタイプ', color: '#F0A43A', bg: '#fff6e6', image: charImage('honori'), short: 'ぬくもりごはん', food: 'オムライス', place: '夜ご飯をゆっくり食べられる店', time: '食べながら少し本音が出る時間', personality: 'あたたかくて、人との距離感に敏感', weak: '一緒にいる時間を雑にされること', phrase: 'ちゃんと、あったかいうちに話そ', move: 'ご飯の話になると、急にちょっと名言っぽいことを言う', close: '「ちゃんとご飯食べた？」と聞いてくる' },
    shirube: { name: 'シルベ', type: '道しるべナビタイプ', color: '#5D8FAE', bg: '#eef6fa', image: charImage('shirube'), short: 'やさしい案内役', food: 'サンドイッチ', place: '駅、地図のある場所、案内板の近く', time: '集合前に予定がきれいに決まった瞬間', personality: '落ち着いていて、予定を整えるのが得意', weak: '場所も時間も決まっていない曖昧な誘い', phrase: '道が見えたら、ちゃんと進める', move: '集合時間を決めただけで、なぜか少し達成感を出す', close: '集合時間とルートを勝手にまとめてくれる' },
    yodomi: { name: 'ヨドミ', type: '行動ブレーキ', color: '#7C6A8E', bg: '#f5f0f8', image: charImage('yodomi'), short: '迷いの影', food: '冷めたポテト', place: '部屋のすみ、予定を保存したままの画面', time: '「また今度でいいか」と思う瞬間', personality: '止めたがるけど、本当は少し怖がり', weak: '小さくても実際に動かれること', phrase: '今日はやめとけば？', move: '保存ボタンを押した瞬間に「もう行った気分じゃん」と言う', close: '最初は止めるけど、最後はこっそり見守っている' }
  };

  function c(text, scoreCharacter, researchKey) {
    return { text: text, scoreCharacter: scoreCharacter, researchKey: researchKey };
  }
  var QUESTIONS = [
    { id: 'Q1', line: 'シルベ「まずは、予定の決め方から見てみるよ。」', q: '休みの日、予定を決める時に近いのは？', choices: [c('なんとなく気になる方に動く','nexsuke','spontaneous_interest'),c('雰囲気が自分に合うか見る','tsugiha','self_fit'),c('疲れないかを先に考える','komorebi','energy_check'),c('誰かと盛り上がれるかで決める','irodori','social_excitement'),c('ゆっくり話せるかを大事にする','honori','warm_conversation'),c('場所・時間・料金を見て決める','shirube','info_first')] },
    { id: 'Q2', line: 'ネクスケ「まだ決まってない時間って、ちょっとワクワクするよね。」', q: '3時間だけ自由になったら？', choices: [c('落ち着ける場所に行く','komorebi','comfort_first'),c('ちゃんと調べてから動く','shirube','plan_first'),c('初めての場所に行ってみる','nexsuke','new_place'),c('誰かとご飯か会話の時間にする','honori','meal_conversation'),c('自分っぽい場所を探す','tsugiha','self_expression'),c('楽しそうな予定に変える','irodori','fun_conversion')] },
    { id: 'Q3', line: 'ヨドミ「保存しただけで満足する時、あるよね。」', q: '気になる予定を見つけたあと、よくあるのは？', choices: [c('保存して終わることが多い','nexsuke','save_action_gap'),c('自分に合うか考えすぎる','tsugiha','fit_anxiety'),c('当日の元気次第になる','komorebi','energy_dependency'),c('友達に送って反応を見る','irodori','friend_reaction'),c('誰と行くかで決まる','honori','companion_dependency'),c('詳細を見てから決める','shirube','detail_check')] },
    { id: 'Q4', line: 'シルベ「ここはかなり大事。何があれば動ける？」', q: '行く決め手になりやすいのは？', choices: [c('料金や場所が分かりやすい','shirube','clear_info'),c('写真や動画で楽しさが伝わる','irodori','visual_fun'),c('一緒に話せる時間がありそう','honori','shared_time'),c('自分の好みに合いそう','tsugiha','self_fit'),c('ハードルが低そう','nexsuke','low_barrier'),c('落ち着いて過ごせそう','komorebi','comfort')] },
    { id: 'Q5', line: 'イロドリ「予定って、誰かの一言で急に動くことあるよね。」', q: '誘われた時、一番動きやすい言葉は？', choices: [c('「疲れたらすぐ帰っていいよ」','komorebi','escape_option'),c('「ここ、君っぽいと思った」','tsugiha','personalized_invite'),c('「ちょっとだけ行ってみない？」','nexsuke','small_step_invite'),c('「ゆっくり話せるところ行こう」','honori','conversation_invite'),c('「これ絶対おもろい」','irodori','fun_invite'),c('「何時にここ集合ね」','shirube','specific_invite')] },
    { id: 'Q6', line: 'ホノリ「誰と過ごすかで、同じ場所でも全然違うよね。」', q: '一緒に出かけるなら大事なのは？', choices: [c('気を遣いすぎないこと','komorebi','low_pressure'),c('好きなものを分かってくれること','tsugiha','taste_understanding'),c('新しいことに乗ってくれること','nexsuke','new_challenge_partner'),c('会話が自然に続くこと','honori','natural_conversation'),c('場を明るくしてくれること','irodori','positive_energy'),c('約束や時間を守ってくれること','shirube','trust_clarity')] },
    { id: 'Q7', line: 'コモレビ「無理に合わせすぎると、あとで疲れるよね。」', q: 'グループで疲れやすい瞬間は？', choices: [c('予定が曖昧なまま進む','shirube','unclear_plan_stress'),c('ノリが強すぎる','komorebi','high_tension_fatigue'),c('自分の好みを無視される','tsugiha','taste_ignored'),c('何も起きず退屈なまま終わる','irodori','boredom_stress'),c('本当は行きたいのに言い出せない','nexsuke','first_step_hesitation'),c('ちゃんと話せずに終わる','honori','conversation_lack')] },
    { id: 'Q8', line: 'イロドリ「友達といる時の役割って、けっこう出るよね。」', q: '友達の中でなりがちな役割は？', choices: [c('候補をまとめる','shirube','organizer_role'),c('空気を見て調整する','komorebi','mood_reader'),c('その人らしい案を出す','tsugiha','personalizer'),c('盛り上げる','irodori','energizer'),c('話しやすい空気を作る','honori','warm_connector'),c('新しい案を出す','nexsuke','idea_starter')] },
    { id: 'Q9', line: 'ツギハ「“分かってくれてる”って、けっこう嬉しいよね。」', q: '友達にされると嬉しいのは？', choices: [c('自分に合いそうな場所を選んでくれる','tsugiha','fit_recommendation'),c('無理しない予定にしてくれる','komorebi','comfortable_plan'),c('新しい場所に誘ってくれる','nexsuke','new_invitation'),c('ちゃんと話す時間を作ってくれる','honori','conversation_time'),c('楽しい企画にしてくれる','irodori','fun_plan'),c('段取りを整えてくれる','shirube','organized_plan')] },
    { id: 'Q10', line: 'ヨドミ「人が絡むと、急に面倒になる時あるよね。」', q: '人と出かける前に不安になりやすいのは？', choices: [c('会話が続くか','honori','conversation_anxiety'),c('自分が浮かないか','tsugiha','self_fit_anxiety'),c('疲れすぎないか','komorebi','energy_anxiety'),c('楽しい空気になるか','irodori','fun_anxiety'),c('行くまでの流れが分かるか','shirube','process_anxiety'),c('そもそも一歩踏み出せるか','nexsuke','first_step_anxiety')] },
    { id: 'Q11', line: 'ネクスケ「動ける時って、何か小さいきっかけがあるんだよね。」', q: '外に出るきっかけになりやすいのは？', choices: [c('近くで行けそう','nexsuke','nearby_trigger'),c('写真や動画が楽しそう','irodori','visual_trigger'),c('雰囲気が自分に合いそう','tsugiha','fit_trigger'),c('ゆっくりできそう','komorebi','comfort_trigger'),c('誰かと話せそう','honori','conversation_trigger'),c('詳細が分かりやすい','shirube','info_trigger')] },
    { id: 'Q12', line: 'シルベ「予定が実行されるかどうかは、ここで決まるかも。」', q: '行動に移しやすい予定は？', choices: [c('時間が短め','komorebi','short_duration'),c('予約や料金が分かる','shirube','clear_cost_booking'),c('初めてでも入りやすい','nexsuke','beginner_friendly'),c('友達とネタにできる','irodori','shareable_fun'),c('自分っぽさを出せる','tsugiha','self_expression_chance'),c('食事や会話が入っている','honori','meal_conversation_included')] },
    { id: 'Q13', line: 'イロドリ「“行く理由”があると、急に動ける。」', q: '予定にあると嬉しいものは？', choices: [c('ちょっとしたミッション','irodori','mission_preference'),c('似合うものを探せる時間','tsugiha','style_discovery'),c('休憩できる場所','komorebi','rest_space'),c('ご飯や会話の時間','honori','warm_time'),c('迷わない案内','shirube','navigation_need'),c('新しい発見','nexsuke','discovery_need')] },
    { id: 'Q14', line: 'ホノリ「予定って、詰め込みすぎると味がしなくなるよね。」', q: 'いい予定だと思うのは？', choices: [c('新しいことが1つある','nexsuke','new_element'),c('その人らしさが出る','tsugiha','identity_expression'),c('余白がある','komorebi','plan_margin'),c('笑える瞬間がある','irodori','laughter_moment'),c('ゆっくり話せる','honori','talk_time'),c('流れが分かりやすい','shirube','clear_flow')] },
    { id: 'Q15', line: 'ヨドミ「ここ、正直に答えた方が当たるよ。」', q: '予定をやめたくなる直前の気持ちは？', choices: [c('なんか面倒になった','nexsuke','motivation_drop'),c('自分に合わない気がした','tsugiha','fit_doubt'),c('疲れていた','komorebi','tiredness'),c('思ったより楽しそうじゃなかった','irodori','fun_doubt'),c('誰と行くか決まらなかった','honori','companion_gap'),c('情報が足りなかった','shirube','information_gap')] },
    { id: 'Q16', line: 'ヨドミ「行かなかった理由って、だいたい小さい顔してるんだよ。」', q: '行きたいのに行かなかった理由で多いのは？', choices: [c('一緒に行く人がいなかった','honori','no_companion'),c('行き方や料金が分からなかった','shirube','unclear_info'),c('当日になって元気がなかった','komorebi','low_energy'),c('自分に合うか不安だった','tsugiha','self_fit_uncertain'),c('保存して満足した','nexsuke','saved_only'),c('楽しさが想像できなかった','irodori','low_imagination')] },
    { id: 'Q17', line: 'シルベ「“面倒”を分解すると、けっこうヒントになる。」', q: '面倒に感じやすいのは？', choices: [c('調べること','shirube','search_friction'),c('誘うこと','honori','invite_friction'),c('移動すること','komorebi','movement_friction'),c('決めること','nexsuke','decision_friction'),c('自分に合うか見極めること','tsugiha','evaluation_friction'),c('楽しそうか判断すること','irodori','fun_judgement_friction')] },
    { id: 'Q18', line: 'コモレビ「疲れてる時の予定って、別物に見えるよね。」', q: '疲れている時でも行けそうなのは？', choices: [c('近くで短時間','nexsuke','near_short'),c('座れて落ち着ける','komorebi','seat_rest'),c('食事しながら話せる','honori','meal_talk_low_energy'),c('行き方が簡単','shirube','easy_access'),c('友達が楽しませてくれる','irodori','friend_energy'),c('自分の好きに合っている','tsugiha','fit_even_tired')] },
    { id: 'Q19', line: 'ツギハ「“なんか違う”の中身を見てみよう。」', q: '予定に冷める瞬間は？', choices: [c('量産感が強い','tsugiha','generic_dislike'),c('騒がしすぎる','komorebi','noise_dislike'),c('退屈そう','irodori','boredom_dislike'),c('会話する余白がない','honori','no_conversation_space'),c('情報が雑','shirube','poor_information'),c('ハードルが高そう','nexsuke','high_barrier')] },
    { id: 'Q20', line: 'ヨドミ「止まる理由が分かれば、戻り方も分かるかも。」', q: '自分の中のブレーキに近いのは？', choices: [c('最初の一歩が重い','nexsuke','first_step_heavy'),c('しっくり来ないと動けない','tsugiha','fit_required'),c('疲れるのが怖い','komorebi','fear_of_fatigue'),c('楽しくなさそうだと冷める','irodori','fun_required'),c('相手との空気が不安','honori','relationship_anxiety'),c('情報不足だと決められない','shirube','info_required')] },
    { id: 'Q21', line: 'イロドリ「どんな予定に心が動くか、ここから見えてくるよ。」', q: '一番テンションが上がるのは？', choices: [c('初めて行く場所','nexsuke','first_visit'),c('自分らしいものを見つける','tsugiha','self_discovery'),c('落ち着いて過ごす','komorebi','calm_experience'),c('みんなで盛り上がる','irodori','group_fun'),c('ご飯を食べながら話す','honori','meal_talk'),c('予定通りに気持ちよく動く','shirube','smooth_plan')] },
    { id: 'Q22', line: 'ホノリ「食べる時間って、ただの食事じゃないことあるよね。」', q: 'ご飯やカフェで嬉しいのは？', choices: [c('新しい店を知れる','nexsuke','new_food_place'),c('雰囲気が自分に合う','tsugiha','food_vibe_fit'),c('落ち着ける席がある','komorebi','comfortable_seat'),c('写真やネタになる','irodori','food_shareable'),c('ゆっくり話せる','honori','food_conversation'),c('料金やメニューが分かりやすい','shirube','clear_menu_price')] },
    { id: 'Q23', line: 'ツギハ「買い物って、その人が出るよね。」', q: '買い物や街歩きで好きなのは？', choices: [c('偶然の発見','nexsuke','shopping_discovery'),c('自分に似合うもの探し','tsugiha','fit_item_search'),c('疲れたら休めること','komorebi','shopping_rest'),c('友達とネタにできること','irodori','shopping_fun'),c('誰かに似合うものを選ぶこと','honori','choose_for_someone'),c('店やルートが分かりやすいこと','shirube','shopping_clarity')] },
    { id: 'Q24', line: 'ネクスケ「体験って、やる前はちょっと怖いけどね。」', q: '体験系で行きやすいのは？', choices: [c('初心者歓迎','nexsuke','beginner_welcome'),c('自分の作品や個性が出る','tsugiha','creative_expression'),c('無理なく参加できる','komorebi','low_stress_participation'),c('友達と盛り上がれる','irodori','participation_fun'),c('会話しながらできる','honori','participation_conversation'),c('流れや料金が明確','shirube','participation_clarity')] },
    { id: 'Q25', line: 'イロドリ「ガチャで出たらやりたいの、どれ？」', q: 'グループガチャで惹かれるのは？', choices: [c('完全おまかせ','nexsuke','gacha_omakase'),c('インスタ映え','tsugiha','gacha_visual'),c('王道','shirube','gacha_standard'),c('YouTube企画','irodori','gacha_youtube'),c('爆食','honori','gacha_food'),c('ゆるく話す','komorebi','gacha_relax')] },
    { id: 'Q26', line: 'ホノリ「距離感って、近ければいいわけじゃないよね。」', q: '人と仲良くなる時に大事なのは？', choices: [c('一緒に新しいことをする','nexsuke','bond_new_experience'),c('好きなものを分かり合う','tsugiha','bond_shared_taste'),c('無理せず一緒にいられる','komorebi','bond_comfort'),c('一緒に笑える','irodori','bond_laughter'),c('ゆっくり話せる','honori','bond_conversation'),c('約束や言葉がちゃんとしている','shirube','bond_reliability')] },
    { id: 'Q27', line: 'コモレビ「恋愛でも友達でも、無理は続かないよ。」', q: '一緒にいて安心する人は？', choices: [c('行動力をくれる人','nexsuke','partner_action'),c('自分の感性を否定しない人','tsugiha','partner_accept_taste'),c('沈黙が気まずくない人','komorebi','partner_silence_comfort'),c('笑うタイミングが合う人','irodori','partner_laughter'),c('食事や会話が自然な人','honori','partner_meal_talk'),c('誠実で分かりやすい人','shirube','partner_reliable')] },
    { id: 'Q28', line: 'ヨドミ「距離を詰めすぎると、逆に引く時あるよね。」', q: '距離を置きたくなるのは？', choices: [c('可能性をすぐ否定される','nexsuke','denied_possibility'),c('好きなものを雑に扱われる','tsugiha','disrespected_taste'),c('テンションを強制される','komorebi','forced_energy'),c('反応が薄すぎる','irodori','low_reaction'),c('一緒の時間を雑にされる','honori','time_disrespected'),c('約束や予定が曖昧','shirube','unclear_commitment')] },
    { id: 'Q29', line: 'イロドリ「“また行きたい”って思う瞬間、けっこう重要。」', q: 'また一緒に行きたいと思うのは？', choices: [c('新しい発見があった時','nexsuke','return_discovery'),c('自分らしくいられた時','tsugiha','return_self'),c('無理せず楽だった時','komorebi','return_comfort'),c('笑える瞬間が多かった時','irodori','return_fun'),c('会話が残った時','honori','return_conversation'),c('スムーズで安心だった時','shirube','return_smooth')] },
    { id: 'Q30', line: 'ホノリ「誰かとの時間って、最後の余韻で決まることあるよね。」', q: '帰り道に残ると嬉しいのは？', choices: [c('「行ってよかった」感','nexsuke','after_good_step'),c('「自分っぽかった」感','tsugiha','after_self_fit'),c('「疲れすぎなかった」感','komorebi','after_not_tired'),c('「楽しかった」感','irodori','after_fun'),c('「ちゃんと話せた」感','honori','after_connected'),c('「無駄がなかった」感','shirube','after_smooth')] },
    { id: 'Q31', line: 'シルベ「ここからは、Nexcaを良くするための質問だよ。」', q: '普段、行き先を探す時に一番使うのは？', choices: [c('Instagram','irodori','source_instagram'),c('TikTok・ショート動画','irodori','source_short_video'),c('Googleマップ','shirube','source_google_maps'),c('友達の口コミ','honori','source_friends'),c('公式サイト・公式情報','shirube','source_official'),c('なんとなく歩いて決める','nexsuke','source_walk')] },
    { id: 'Q32', line: 'ネクスケ「行きたいと、実際に行くの間には壁があるよね。」', q: '行きたいと思っても行かないことは？', choices: [c('よくある','nexsuke','gap_often'),c('たまにある','tsugiha','gap_sometimes'),c('誰と行くかによる','honori','gap_companion'),c('情報があれば行く','shirube','gap_information'),c('元気があれば行く','komorebi','gap_energy'),c('楽しそうなら行く','irodori','gap_fun')] },
    { id: 'Q33', line: 'イロドリ「動画で見たら、行きたくなることある？」', q: '行く気持ちが上がる情報は？', choices: [c('短い動画で雰囲気が分かる','irodori','content_short_video'),c('写真がきれい','tsugiha','content_photo'),c('料金・場所・時間が分かる','shirube','content_details'),c('実際に行った人の声','honori','content_reviews'),c('初めてでも入りやすい説明','nexsuke','content_beginner'),c('混み具合や落ち着き','komorebi','content_comfort')] },
    { id: 'Q34', line: 'ホノリ「誰と行くか、けっこう本音が出るよ。」', q: '一番動きやすい相手は？', choices: [c('1人でも行ける','nexsuke','companion_alone'),c('親しい友達','irodori','companion_friend'),c('恋人・気になる人','honori','companion_romance'),c('家族','komorebi','companion_family'),c('クラス・サークル','irodori','companion_group'),c('誰かが計画してくれたら行く','shirube','companion_planner')] },
    { id: 'Q35', line: 'ヨドミ「最後。君が本当に動く条件、教えて。」', q: 'Nexcaに一番あったら使いたいのは？', choices: [c('条件に合う場所を動画で見られる','irodori','nexca_video_feed'),c('ガチャで予定を決めてくれる','nexsuke','nexca_gacha'),c('友達とできる企画が出る','irodori','nexca_group_fun'),c('詳細情報がきれいにまとまっている','shirube','nexca_detail_info'),c('行った人の声が見られる','honori','nexca_user_voice'),c('落ち着ける場所を探しやすい','komorebi','nexca_comfort_search')] }
  ];

  var RESULT_TEXT = {
    nexsuke: { copy: '行きたい気持ちはある。でも、最初の一歩だけがやたら重い人。', basic: 'ネクスケ型のあなたは、「何かしたい」という気持ちはあるのに、動き出す直前で止まりやすいタイプです。\nやる気がないわけではありません。\nむしろ、可能性を感じるからこそ迷います。\n保存したり、調べたり、誰かに送ろうとしたりするところまでは行くのに、最後の一歩で「まあ今度でいいか」となりやすいかもしれません。\nでも、一度外に出ると、思っていたより楽しめることが多いタイプでもあります。', friends: '友達に軽く背中を押されると動きやすいです。\n強く誘われるより、「ちょっとだけ行こう」が合っています。\n勢いで連れ出されるのは苦手だけど、軽く誘われると意外と動けます。', romance: '一緒にいると自分の世界が広がる人に惹かれやすいです。\nただし、自分から踏み出すまでに時間がかかります。\n気になっているのに、理由を探して先延ばしにすることもあります。', decision: '気になるものは見つけられます。\nでも、最後の決定が少し苦手です。\n「行きたい」と「実際に行く」の間に小さな壁があります。', yodomi: '「保存したし、もういいか」\n「失敗したら面倒だし、今度でいいか」\nこの声が出たらヨドミです。', recover: '大きく変わろうとしなくていいです。\n15分だけ、1件だけ、近くだけ。\n小さく動くほど、あなたは強いです。', fit: '初めての場所、短時間の予定、ハードルが低い体験、完全おまかせガチャ。', today: '気になる予定を1つだけ誰かに送る。', gacha: ['完全おまかせ','遊び','体験','短時間','初めてでも入りやすい'] },
    tsugiha: { copy: 'みんなと同じより、「これ自分っぽい」で動く人。', basic: 'ツギハ型のあなたは、流行っているかより、自分にしっくりくるかを大事にするタイプです。\n人気だから、便利だから、みんなが行くから、だけでは心が動きません。\n写真、色、雰囲気、言葉、店の空気。\nそういう細かいものから「ここ好きかも」を感じ取ります。\n逆に、量産感が強かったり、雑におすすめされると一気に冷めやすいです。', friends: '友達の“その人っぽさ”に気づくのが得意です。\n似合う色や雰囲気を勝手に考えていることがあります。\nでも、それを押しつけたいわけではなく、その人がしっくりくるものを一緒に探したいタイプです。', romance: '自分の好きなものを雑に扱わない人に惹かれます。\n感性を分かってくれる人に弱いです。\n逆に、「それ何がいいの？」と雑に言われると、一気に距離を取りたくなります。', decision: '写真や雰囲気をかなり見ます。\n説明が雑な場所より、世界観やこだわりが伝わる場所の方が動きやすいです。', yodomi: '「なんか違う」\n「自分には合わなそう」\nそう思って、試す前に切ってしまう時があります。', recover: '全部がしっくり来なくても、1つだけ気になる要素があれば十分です。\n色、空気、言葉、写真。\n小さな“好き”を拾ってください。', fit: '古着、買い物、雰囲気のある店、インスタ映え、友達プロデュース系。', today: '「これ自分っぽいかも」と思うものを1つ保存する。', gacha: ['買い物','インスタ映え','古着','自分らしさ','プロデュース系'] },
    komorebi: { copy: '楽しみたいけど、消耗する予定はちゃんと避けたい人。', basic: 'コモレビ型のあなたは、刺激よりも心地よさを大事にするタイプです。\n楽しい予定でも、人が多すぎたり、音が大きすぎたり、ずっとテンションを上げ続ける必要があると疲れやすいです。\nでも、それはノリが悪いわけではありません。\n自分の体力や空気の変化に敏感なだけです。\n落ち着ける場所、座れる時間、無理しなくていい相手がいると、自然に動けます。', friends: '周りの疲れや空気を見ています。\n誰かが無理していると気づきやすいタイプです。\n自分から強く場を動かすより、場の温度を整えることが得意です。', romance: '沈黙が気まずくない人に安心します。\n強いドキドキより、一緒にいて楽かどうかを見ています。\n安心できる相手には、ゆっくり深く心を開きます。', decision: '座れるか、混みすぎていないか、休めるかを見ています。\n予定が詰まりすぎていると、行く前から疲れることがあります。', yodomi: '「今日は外出るだけでしんどい」\n「人と会うの無理かも」\nそういう時にヨドミが出やすいです。', recover: '予定を小さくしてください。\n短時間、近場、座れる場所。\n楽しむためではなく、整えるために出てもいいです。', fit: 'カフェ・スイーツ、静かな会話、短時間プラン、屋内、王道。', today: '近くで座れる場所を1つ探す。', gacha: ['話す','カフェ・スイーツ','屋内','短時間','王道'] },
    irodori: { copy: '予定は“行く場所”じゃなくて、“事件にできるか”で見ている人。', basic: 'イロドリ型のあなたは、何かが起きそうな空気に反応するタイプです。\nただ行くだけ、ただ見るだけ、ただ食べるだけだと少し物足りません。\n友達と笑える、写真が残る、あとで話せる、変な企画になる。\nそういう要素があると一気に動けます。\n逆に、説明が静かすぎたり、盛り上がるイメージがない予定には冷めやすいです。', friends: '空気を動かす人です。\n誰かが迷っていると、「やろうや」と言いたくなります。\nただし、相手の温度を見ずに走りすぎると、少し疲れさせることもあります。', romance: '一緒に笑える人に惹かれます。\n日常が少し面白くなる相手に弱いです。\n何でもない時間を一緒にネタにできる人とは相性がいいです。', decision: '写真、動画、タイトル、企画感に反応します。\n「これやったらおもろそう」が一番強い行動理由になります。', yodomi: '「なんか普通すぎる」\n「別に今日じゃなくていい」\nそう感じると動かなくなります。', recover: '予定にミッションを足してください。\n写真、MVP、タイトル、勝負。\n“ただ行く”を“企画”にすると動けます。', fit: 'イベント・体験、YouTube企画、ボケ、友達とのガチャ、投稿ミッション。', today: '友達に「これ企画にしたらおもろくない？」と送る。', gacha: ['YouTube企画','ボケ','イベント・体験','友達','投稿ミッション'] },
    honori: { copy: 'どこに行ったかより、誰と何を話したかを覚えている人。', basic: 'ホノリ型のあなたは、派手な予定よりも、一緒に過ごした時間の空気を大事にするタイプです。\nご飯を食べながら出た一言、帰り際の雰囲気、相手の表情。\nそういう小さいものをよく覚えています。\nランチや夜ご飯は、あなたにとってただの食事ではありません。\n相手との距離が少し近づいたり、言えなかったことが少し言える時間です。', friends: '最後にご飯を食べながら話す時間で、満足度が上がりやすいです。\n友達の小さな変化にも気づきやすいです。\n「最近なんかあった？」みたいな会話を自然に大事にします。', romance: '一緒に食べていて落ち着く人に惹かれます。\n派手なデートより、自然に話せる食事の時間が大事です。\nスマホばかり見られたり、時間を雑に扱われると冷めやすいです。', decision: '場所そのものより、「誰とどんな時間になるか」を見ています。\nご飯、会話、帰り道の余韻がある予定に満足しやすいです。', yodomi: '「ちゃんと話せないなら行かなくていいか」\n「気まずくなりそう」\nそう思うと止まりやすいです。', recover: '完璧に盛り上げなくていいです。\n短いご飯、軽い会話、帰り道の一言。\nそれだけで十分進みます。', fit: 'ランチ・ディナー、話す、気になる人、恋人、家族、爆食ではなく爆満足プラン。', today: '誰かとゆっくり話せるご飯の時間を1つ作る。', gacha: ['ランチ・ディナー','話す','爆食','恋人','気になる人','家族'] },
    shirube: { copy: 'ノリで動けないんじゃなくて、道が見えればちゃんと動ける人。', basic: 'シルベ型のあなたは、情報が整理されると安心して動けるタイプです。\n場所、時間、料金、行き方、予約、混み具合。\nそういう判断材料があると、予定を現実にできます。\n慎重すぎるわけではありません。\nむしろ、みんなの「行きたい」を実際に行ける形にする力があります。\nただし、曖昧な誘いや、勢いだけの予定には疲れやすいです。', friends: '候補をまとめたり、時間を見たり、ルートを確認したりする役になりやすいです。\nあなたがいると予定が成立しやすいです。\nただし、全部を自分が背負いすぎると疲れます。', romance: '誠実で、言葉や約束がちゃんとしている人に惹かれます。\n曖昧な態度が続くと冷めやすいです。\nちゃんと予定を決めてくれる人には安心します。', decision: '詳細情報をかなり見ます。\n料金、場所、時間、移動、予約が分かると安心します。\n逆に情報が少ないと、気になっていても行動が止まりやすいです。', yodomi: '「もう少し調べてから」\n「失敗したら嫌だな」\nそう思って、調べ続けて止まる時があります。', recover: '情報収集に制限をつけてください。\n場所・時間・料金の3つが分かれば、もう動いて大丈夫です。', fit: '王道、詳細情報が分かりやすい予定、予約しやすい店、移動が簡単なプラン。', today: '候補を3つまでに絞って、一番行きやすいものを選ぶ。', gacha: ['王道','詳細情報','移動しやすい','予約しやすい','条件整理'] }
  };

  var MILESTONES = {
    5: { char: 'nexsuke', title: 'ネクスケの地図に、最初の線が浮かびました。', text: '少しずつ、あなたの動き出し方が見えてきたよ。' },
    10: { char: 'shirube', title: 'シルベが、あなたの予定の決め方を整理しています。', text: 'どんな条件なら動けるか、かなり分かってきました。' },
    15: { char: 'yodomi', title: 'ヨドミが、あなたが止まりやすい理由をのぞいています。', text: '行きたいのに行けない理由、ちゃんと見えてきたね。' },
    20: { char: 'komorebi', title: 'コモレビが、あなたが安心できる条件を見つけています。', text: '無理なく楽しめる場所のヒントが集まってきました。' },
    25: { char: 'irodori', title: 'イロドリが、あなたのワクワクする瞬間を探しています。', text: 'どんな予定ならテンションが上がるか、もう少しで分かります。' },
    30: { char: 'honori', title: 'ホノリが、人との距離感をそっと読み取っています。', text: '誰と、どんな時間を過ごしたいのかが見えてきました。' },
    35: { char: 'shirube', title: '6つの光が集まっています。', text: 'あなたに近いNexcaキャラを見つけています。' }
  };

  var state = { index: 0, answers: [], scores: null, latestResult: null, syncing: false };

  function $(id) { return document.getElementById(id); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function(s) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]; }); }
  function zero(keys) { return keys.reduce(function(o, k) { o[k] = 0; return o; }, {}); }
  function freshScores() { return { character_scores: zero(CHAR_ORDER), core_scores: zero(CHAR_ORDER), recent_scores: zero(CHAR_ORDER), research_scores: {} }; }
  function mainEl() { return $('diag') || $('diagnosis') || document.querySelector('[data-screen="diag"]'); }
  function shell(inner) {
    var root = mainEl();
    if (!root) return;
    root.classList.add('nxdiag-screen');
    root.innerHTML = '<div class="nxdiag" id="nxdiag-root">' + inner + '</div>';
  }
  function logoHtml() {
    return '<div class="nxdiag-logo"><span class="logo-nex">Nex</span><span class="logo-ca">ca</span></div>';
  }
  function headerHtml(title, showBack) {
    return '<div class="nxdiag-header">' +
      '<div>' + logoHtml() + '<span class="nxdiag-age-pill">' + esc(window.age || localStorage.getItem('nx_age') || '高校生') + '</span></div>' +
      '<div class="nxdiag-header-center">' + esc(title || '') + '</div>' +
      '<button class="nxdiag-cond" type="button" onclick="window.openAgeMod&&openAgeMod()">条件</button>' +
      (showBack ? '<button class="nxdiag-floating-back" type="button" onclick="NexcaDiagnosis.back()">戻る</button>' : '') +
    '</div>';
  }
  function charOrb(key, extraClass) {
    var ch = CHARS[key];
    return '<div class="nxdiag-char ' + (extraClass || '') + '" style="--c:' + ch.color + ';--bg:' + ch.bg + '"><img src="' + ch.image + '" alt="' + esc(ch.name) + '" onerror="this.parentNode.classList.add(\'is-missing\');this.remove();"><span>' + esc(ch.name) + '</span></div>';
  }
  function boot() {
    syncLocalResults();
    renderStart();
  }
  function renderStart() {
    var cards = CHAR_ORDER.map(function(k) {
      var ch = CHARS[k];
      return '<div class="nxdiag-mini" style="--c:' + ch.color + ';--bg:' + ch.bg + '">' + charOrb(k) + '<b>' + ch.name + '</b><span>' + ch.short + '</span></div>';
    }).join('');
    shell('<div class="nxdiag-start">' +
      headerHtml('', false) +
      '<div class="nxdiag-hero-visual"><div class="nxdiag-mapline"></div><img src="' + CHARS.nexsuke.image + '" alt="ネクスケ"><img src="' + CHARS.irodori.image + '" alt="イロドリ"><img src="' + CHARS.honori.image + '" alt="ホノリ"><img src="' + CHARS.shirube.image + '" alt="シルベ"><img src="' + CHARS.yodomi.image + '" alt="ヨドミ"></div>' +
      '<h1>Nexcaキャラ診断</h1>' +
      '<p class="nxdiag-sub">まだ知らない体験が、次の自分を連れてくる。</p>' +
      '<p class="nxdiag-lead">35問で、あなたの「動き出し方」「人との距離感」「予定の決め方」を読み解きます。</p>' +
      '<div class="nxdiag-meta"><span>35問</span><span>1問ずつ</span><span>約5分</span></div>' +
      '<div class="nxdiag-char-grid">' + cards + '</div>' +
      '<button class="nxdiag-primary" onclick="NexcaDiagnosis.start()">診断をはじめる</button>' +
      '<p class="nxdiag-small">※結果はあなたを決めつけるものではなく、自己理解のヒントです。</p>' +
    '</div>');
  }
  function start() {
    state.index = 0;
    state.answers = [];
    state.scores = freshScores();
    recordEvent('start_diagnosis', {});
    renderQuestion();
  }
  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var pct = Math.round((state.index / QUESTIONS.length) * 100);
    var lineKey = lineCharacter(q.line);
    var options = q.choices.map(function(choice, i) {
      return '<button class="nxdiag-option" onclick="NexcaDiagnosis.answer(' + i + ')"><span>' + (i + 1) + '</span><b>' + esc(choice.text) + '</b><em>›</em></button>';
    }).join('');
    shell('<div class="nxdiag-question-wrap">' +
      headerHtml('診断中', true) +
      '<div class="nxdiag-qtop"><div><b>' + (state.index + 1) + ' / 35</b><span>あなたのNexcaタイプを読み取り中</span></div></div>' +
      '<div class="nxdiag-progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="nxdiag-question-card">' +
        '<div class="nxdiag-line">' + charOrb(lineKey, 'small') + '<p>' + esc(q.line) + '</p></div>' +
        '<div class="nxdiag-qno">' + q.id + '</div><h2>' + esc(q.q) + '</h2><div class="nxdiag-options">' + options + '</div>' +
      '</div>' +
    '</div>');
  }
  function lineCharacter(line) {
    var name = line.split('「')[0];
    var found = Object.keys(CHARS).find(function(k) { return CHARS[k].name === name; });
    return found || 'nexsuke';
  }
  function answer(optionIndex) {
    var q = QUESTIONS[state.index];
    var selected = q.choices[optionIndex];
    state.answers[state.index] = { questionId: q.id, selectedText: selected.text, scoreCharacter: selected.scoreCharacter, researchKey: selected.researchKey };
    recompute();
    recordEvent('answer_diagnosis_question', state.answers[state.index]);
    document.querySelectorAll('.nxdiag-option').forEach(function(btn, i) { btn.classList.toggle('is-selected', i === optionIndex); });
    setTimeout(function() {
      var completed = state.index + 1;
      state.index += 1;
      if (completed === 35) return showMilestone(35, true);
      if (MILESTONES[completed]) return showMilestone(completed, false);
      renderQuestion();
    }, 220);
  }
  function back() {
    if (state.index <= 0) return renderStart();
    state.index -= 1;
    renderQuestion();
  }
  function recompute() {
    state.scores = freshScores();
    state.answers.forEach(function(a, i) {
      if (!a) return;
      state.scores.character_scores[a.scoreCharacter] += 1;
      if (i < 30) state.scores.core_scores[a.scoreCharacter] += 1;
      if (i >= Math.max(0, state.answers.length - 10)) state.scores.recent_scores[a.scoreCharacter] += 1;
      state.scores.research_scores[a.researchKey] = (state.scores.research_scores[a.researchKey] || 0) + 1;
    });
  }
  function showMilestone(n, finalStep) {
    var m = MILESTONES[n], ch = CHARS[m.char];
    shell('<div class="nxdiag-mid" style="--c:' + ch.color + ';--bg:' + ch.bg + '">' +
      charOrb(m.char, 'big') + '<h2>' + esc(m.title) + '</h2><p>' + esc(m.text) + '</p>' +
      '<button class="nxdiag-primary" onclick="' + (finalStep ? 'NexcaDiagnosis.showLoading()' : 'NexcaDiagnosis.renderQuestion()') + '">' + (finalStep ? '結果を見る' : '続ける') + '</button>' +
      '<button class="nxdiag-skip" onclick="' + (finalStep ? 'NexcaDiagnosis.showLoading()' : 'NexcaDiagnosis.renderQuestion()') + '">スキップ</button>' +
    '</div>');
  }
  function showLoading() {
    var lights = CHAR_ORDER.map(function(k) { var ch = CHARS[k]; return '<i style="--c:' + ch.color + '"><img src="' + ch.image + '" alt="' + esc(ch.name) + '"></i>'; }).join('');
    shell('<div class="nxdiag-loading">' +
      '<div class="nxdiag-lamp">' + lights + '<em><img src="' + CHARS.yodomi.image + '" alt="ヨドミ"></em></div>' +
      '<h2>あなたに近いNexcaキャラを見つけています。</h2>' +
      '<p>あなたの中のヨドミも読み解いています</p>' +
    '</div>');
    setTimeout(showResult, 1600);
  }
  function resultKey() {
    recompute();
    var scores = state.scores.character_scores;
    var max = Math.max.apply(null, CHAR_ORDER.map(function(k) { return scores[k]; }));
    var tied = CHAR_ORDER.filter(function(k) { return scores[k] === max; });
    if (tied.length === 1) return tied[0];
    var coreMax = Math.max.apply(null, tied.map(function(k) { return state.scores.core_scores[k]; }));
    tied = tied.filter(function(k) { return state.scores.core_scores[k] === coreMax; });
    if (tied.length === 1) return tied[0];
    var recentCounts = zero(CHAR_ORDER);
    state.answers.slice(-10).forEach(function(a) { if (a) recentCounts[a.scoreCharacter] += 1; });
    var recentMax = Math.max.apply(null, tied.map(function(k) { return recentCounts[k]; }));
    tied = tied.filter(function(k) { return recentCounts[k] === recentMax; });
    return CHAR_ORDER.find(function(k) { return tied.indexOf(k) >= 0; }) || 'nexsuke';
  }
  function percentFor(key) {
    var max = Math.max(1, Math.max.apply(null, CHAR_ORDER.map(function(k) { return state.scores.character_scores[k]; })));
    return Math.round((state.scores.character_scores[key] / max) * 100);
  }
  function showResult() {
    var key = resultKey(), ch = CHARS[key], txt = RESULT_TEXT[key];
    state.latestResult = key;
    saveResult(key);
    recordEvent('complete_diagnosis', { result_character: key });
    try { if (window.addPt) window.addPt('診断完了', 15, false, 'diag_final_v2'); } catch (e) {}
    var bars = CHAR_ORDER.map(function(k) {
      var c = CHARS[k], pct = percentFor(k);
      return '<div class="nxdiag-score-row ' + (k === key ? 'top' : '') + '"><span><img src="' + c.image + '" alt="' + esc(c.name) + '"><em>' + c.name + 'との近さ</em></span><div><i style="width:' + pct + '%"></i></div><b>' + pct + '%</b></div>';
    }).join('');
    var profile = profileHtml(key);
    var cards = [
      card('基本性格', txt.basic, true),
      card('友達関係', txt.friends, false),
      card('恋愛・距離感', txt.romance, false),
      card('予定の決め方', txt.decision, false),
      card('あなたの中のヨドミ', txt.yodomi, true, 'yodomi'),
      card('ヨドミから戻る方法', txt.recover, false),
      card('合う過ごし方', txt.fit, false),
      card('今日の一歩', txt.today, true),
      card('キャラプロフィール', profile, false, 'profile')
    ].join('');
    var shareCard = '<div class="nxdiag-share-card" style="--c:' + ch.color + ';--bg:' + ch.bg + '">' + logoHtml() + '<img src="' + ch.image + '" alt="' + esc(ch.name) + '"><span>Nexcaキャラ診断</span><b>私は<br>' + ch.name + '型</b><em>' + ch.type + '</em><p>' + txt.copy + '</p><small>#Nexcaキャラ診断<br>あなたも診断してみる？</small></div>';
    shell('<div class="nxdiag-result" style="--c:' + ch.color + ';--bg:' + ch.bg + '">' +
      headerHtml('診断結果', false) +
      '<div class="nxdiag-result-hero">' + charOrb(key, 'result') + '<p class="nxdiag-result-kicker">あなたの診断結果</p><h1>' + ch.name + '型</h1><h2>' + ch.type + '</h2><p class="nxdiag-result-copy">' + esc(txt.copy) + '</p></div>' +
      '<section class="nxdiag-score-card"><h3>キャラとの近さ</h3><p>点数ではなく、今の回答傾向として近いキャラを表示しています。</p>' + bars + '</section>' +
      cards +
      '<section class="nxdiag-result-section"><h3>共有カード</h3>' + shareCard + '</section>' +
      '<div class="nxdiag-actions"><button onclick="NexcaDiagnosis.goGacha()">ガチャへ進む</button><button onclick="NexcaDiagnosis.goTown()">Nexca Townで続きを見る</button><button onclick="NexcaDiagnosis.share()">SNS共有</button><button onclick="NexcaDiagnosis.retry()">もう一度診断する</button></div>' +
    '</div>');
  }
  function card(title, body, open, extra) {
    var yodomi = extra === 'yodomi' ? charOrb('yodomi', 'yodomi-card') : '';
    return '<details class="nxdiag-result-section ' + (extra || '') + '" ' + (open ? 'open' : '') + '><summary><span class="nxdiag-sec-mark"></span>' + esc(title) + '</summary><div>' + yodomi + (extra === 'profile' ? body : esc(body).replace(/\n/g, '<br>')) + '</div></details>';
  }
  function profileHtml(key) {
    var p = CHARS[key];
    var rows = [['性格', p.personality], ['好きな食べ物', p.food], ['好きな場所', p.place], ['好きな時間', p.time], ['苦手なこと', p.weak], ['口ぐせ', p.phrase], ['名物ムーブ', p.move], ['仲良くなると', p.close]];
    return rows.map(function(r) { return '<dl><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></dl>'; }).join('');
  }
  function summaryFor(key) {
    function answerAt(num) { return state.answers[num - 1] || {}; }
    return {
      result_character: key,
      top_action_gap_reason: firstResearch([15, 16, 17, 20]),
      top_decision_style: firstResearch([1, 2, 4, 5]),
      top_companion_type: firstResearch([6, 26, 27, 34]),
      top_content_trigger: firstResearch([31, 33, 35]),
      top_gacha_preference: firstResearch([25, 35]),
      top_non_participation_reason: firstResearch([16, 17, 20]),
      top_relationship_style: firstResearch([26, 27, 28, 29, 30]),
      invitation_style: answerAt(5).researchKey || null
    };
  }
  function firstResearch(nums) {
    var found = nums.map(function(n) { return state.answers[n - 1]; }).filter(Boolean);
    return found.length ? found[0].researchKey : null;
  }
  function saveResult(key) {
    var payload = {
      user_id: window.user && window.user.id ? window.user.id : null,
      result_character: key,
      answers: state.answers,
      character_scores: state.scores.character_scores,
      research_scores: state.scores.research_scores,
      created_at: new Date().toISOString()
    };
    var summary = Object.assign({ user_id: payload.user_id, created_at: payload.created_at }, summaryFor(key));
    try {
      localStorage.setItem('nexca_diagnosis_latest_v2', JSON.stringify(payload));
      var pending = JSON.parse(localStorage.getItem('nexca_diagnosis_pending_sync_v2') || '[]');
      pending.unshift({ result: payload, summary: summary });
      localStorage.setItem('nexca_diagnosis_pending_sync_v2', JSON.stringify(pending.slice(0, 20)));
      localStorage.setItem('nexca_gacha_initial_v2', JSON.stringify({ result_character: key, recommended: RESULT_TEXT[key].gacha, created_at: payload.created_at }));
      localStorage.setItem('nexca_town_focus_character', key);
    } catch (e) {}
    trySaveSupabase(payload, summary, false);
  }
  function trySaveSupabase(payload, summary, removePending) {
    if (!window.sb || !window.user || !window.user.id) return Promise.resolve(false);
    payload.user_id = window.user.id;
    summary.user_id = window.user.id;
    return Promise.all([
      window.sb.from('diagnosis_results').insert(payload),
      window.sb.from('diagnosis_research_summary').insert(summary)
    ]).then(function() {
      if (removePending) localStorage.removeItem('nexca_diagnosis_pending_sync_v2');
      return true;
    }).catch(function(err) {
      try { console.warn('diagnosis save failed', err); } catch (e) {}
      return false;
    });
  }
  function syncLocalResults() {
    if (state.syncing || !window.sb || !window.user || !window.user.id) return;
    state.syncing = true;
    var pending = [];
    try { pending = JSON.parse(localStorage.getItem('nexca_diagnosis_pending_sync_v2') || '[]'); } catch (e) {}
    if (!pending.length) { state.syncing = false; return; }
    Promise.all(pending.map(function(item) { return trySaveSupabase(item.result, item.summary, false); })).then(function(results) {
      if (results.every(Boolean)) localStorage.removeItem('nexca_diagnosis_pending_sync_v2');
      state.syncing = false;
    }).catch(function() { state.syncing = false; });
  }
  function recordEvent(type, metadata) {
    var evt = { event_type: type, source: 'nexca_character_diagnosis', metadata: metadata || {}, created_at: new Date().toISOString() };
    if (window.user && window.user.id) evt.user_id = window.user.id;
    try {
      var events = JSON.parse(localStorage.getItem('nexca_user_behavior_events_v2') || '[]');
      events.unshift(evt);
      localStorage.setItem('nexca_user_behavior_events_v2', JSON.stringify(events.slice(0, 100)));
    } catch (e) {}
    if (window.sb && window.user && window.user.id) window.sb.from('user_behavior_events').insert(evt).then(function() {}).catch(function() {});
  }
  function share() {
    var key = state.latestResult || resultKey();
    var text = '私は' + CHARS[key].name + '型でした。\nまだ知らない体験が、次の自分を連れてくる。\n#Nexcaキャラ診断';
    recordEvent('share_diagnosis_result', { result_character: key });
    if (navigator.share) navigator.share({ title: 'Nexcaキャラ診断', text: text, url: location.href }).catch(function() {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + '\n' + location.href).then(function() { if (window.toast) window.toast('診断結果をコピーしました'); });
  }
  function goGacha() {
    var key = state.latestResult || resultKey();
    recordEvent('click_gacha_from_diagnosis', { result_character: key, recommended: RESULT_TEXT[key].gacha });
    try { localStorage.setItem('nexca_gacha_initial_v2', JSON.stringify({ result_character: key, recommended: RESULT_TEXT[key].gacha, created_at: new Date().toISOString() })); } catch (e) {}
    if (window.goTab) window.goTab('points', document.querySelectorAll('.nb')[3]);
    if (window.toast) window.toast('診断結果をガチャ条件に保存しました');
  }
  function goTown() {
    var key = state.latestResult || resultKey();
    recordEvent('click_town_from_diagnosis', { result_character: key });
    try { localStorage.setItem('nexca_town_focus_character', key); } catch (e) {}
    if (window.openTown) window.openTown();
    else if (window.goTab) window.goTab('mypage', document.querySelectorAll('.nb')[4]);
  }
  function retry() { renderStart(); }

  window.NexcaDiagnosis = { boot: boot, start: start, answer: answer, back: back, renderQuestion: renderQuestion, showLoading: showLoading, share: share, goGacha: goGacha, goTown: goTown, retry: retry };
  window.startDiag = start;
  window.diagBack = back;
  window.selQ = answer;
  window.retryDiag = retry;
  window.shareDiag = share;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
