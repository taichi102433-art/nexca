window.NEXCA_TOWN_DATA = {
  buildings: [
    { id: 'home', name: 'MY HOME', jp: '自分の家', genre: 'home', icon: '家', x: 20, y: 66, level: 2, exp: 35, rewardReady: true, copy: 'キャラと家具を整える拠点' },
    { id: 'plaza', name: 'QUEST PLAZA', jp: '中央広場', genre: 'all', icon: '泉', x: 50, y: 54, level: 3, exp: 48, rewardReady: true, copy: '今日のクエスト掲示板' },
    { id: 'vintage', name: 'VINTAGE STREET', jp: '古着ストリート', genre: 'vintage', icon: '服', x: 30, y: 40, level: 4, exp: 62, rewardReady: true, copy: '掘り出し物とランウェイの通り' },
    { id: 'cafe', name: 'CAFE LANE', jp: 'カフェ通り', genre: 'cafe', icon: '珈', x: 70, y: 41, level: 3, exp: 50, rewardReady: true, copy: '外席とラテの香りがある通り' },
    { id: 'event', name: 'EXPERIENCE PARK', jp: 'イベント・体験広場', genre: 'event', icon: '祭', x: 52, y: 30, level: 3, exp: 57, rewardReady: true, copy: 'ステージと体験ブースの広場' },
    { id: 'minigame', name: 'GAME PLAZA', jp: 'ミニゲーム広場', genre: 'game', icon: '遊', x: 33, y: 61, level: 2, exp: 20, rewardReady: false, copy: '街を育てる遊び場' },
    { id: 'collection', name: 'MEMORY MUSEUM', jp: 'コレクション館', genre: 'collection', icon: '録', x: 57, y: 70, level: 2, exp: 24, rewardReady: false, copy: '体験カードとバッジの館' },
    { id: 'shop', name: 'TOWN SHOP', jp: 'ショップ', genre: 'shop', icon: '店', x: 75, y: 63, level: 2, exp: 18, rewardReady: false, copy: '街の装飾と衣装を買える' },
    { id: 'station', name: 'TRAM STOP', jp: '電停', genre: 'all', icon: '電', x: 23, y: 78, level: 1, exp: 12, rewardReady: false, copy: '現実のおでかけへつながる' },
    { id: 'build', name: 'COMING SOON', jp: '建設中エリア', genre: 'locked', icon: '工', x: 63, y: 79, level: 1, exp: 0, rewardReady: false, copy: '次の施設を準備中' }
  ],
  characters: [
    { id: 'neku', name: 'ネクちゃん', type: 'guide', rarity: 'SSR', skillName: '街の案内人', skillDescription: '全ジャンルEXP +3%', dialogue: '今日はどこに行く？', strongGame: '全部', color: '#ff6f93' },
    { id: 'furugy', name: 'フルギー', type: 'vintage', rarity: 'SR', skillName: '古着レーダー', skillDescription: '古着ミニゲームスコア +5%', dialogue: 'いい古着、発掘しに行こう！', strongGame: 'コーデチャレンジ', color: '#4f8f68' },
    { id: 'caferu', name: 'カフェル', type: 'cafe', rarity: 'SR', skillName: 'ほっと一息', skillDescription: 'カフェ報酬 +5%', dialogue: '今日の一杯、探しに行こう！', strongGame: 'オーダーラッシュ', color: '#b56f3a' },
    { id: 'eventy', name: 'イベンティ', type: 'event', rarity: 'SR', skillName: 'ワクワク設計', skillDescription: 'イベント・体験EXP +5%', dialogue: '週末のワクワクを探そう！', strongGame: 'フェス準備パズル', color: '#4d8de8' }
  ],
  games: [
    { id: 'coord', name: 'コーデチャレンジ', genre: '古着', hero: 'フルギーをランウェイへ', desc: 'お題に合う服を選び、テーマ・色・個性で採点。', difficulty: '★★', rewards: 'points / vintageExp / costumeMaterial', char: 'フルギー' },
    { id: 'hunt', name: 'ヴィンテージハント', genre: '古着', hero: 'ラックから一点物を発掘', desc: '棚の中から高レア古着を見つける探索ゲーム。', difficulty: '★★', rewards: 'vintageItem / vintageExp', char: 'フルギー' },
    { id: 'order', name: 'オーダーラッシュ', genre: 'カフェ', hero: '注文をさばいてコンボ', desc: '注文、席、スイーツを素早く合わせる接客ゲーム。', difficulty: '★★', rewards: 'points / cafeExp / furnitureMaterial', char: 'カフェル' },
    { id: 'layout', name: 'カフェレイアウトマスター', genre: 'カフェ', hero: '小さな店を最高の空間へ', desc: '映え、回転率、くつろぎを配置で調整。', difficulty: '★★★', rewards: 'cafeExp / decorationItem', char: 'カフェル' },
    { id: 'festival', name: 'フェス準備パズル', genre: 'イベント・体験', hero: '会場を組んで満足度UP', desc: 'ステージや救護所を置いて安全性とSNS映えを両立。', difficulty: '★★★', rewards: 'eventExp / stageMaterial', char: 'イベンティ' },
    { id: 'booth', name: '体験ブースマネージャー', genre: 'イベント・体験', hero: '材料と順番を管理', desc: 'ワークショップの混雑と満足度をコントロール。', difficulty: '★★★', rewards: 'eventExp / popularity', char: 'イベンティ' },
    { id: 'manager', name: '店長シミュレーション', genre: '学び', hero: '店の課題をゲームで解く', desc: '課題に対して施策を選び、数値の変化を見る。', difficulty: '★★', rewards: 'knowledgeExp / points', char: 'ネクちゃん' },
    { id: 'sns', name: 'SNS告知バトル', genre: '学び', hero: '刺さる一言を選べ', desc: 'ターゲット別に投稿フックを選ぶマーケゲーム。', difficulty: '★★', rewards: 'creativityExp / points', char: 'ネクちゃん' }
  ],
  shop: [
    { id: 'bench', name: '木陰ベンチ', category: '街の装飾', icon: 'ベンチ', cost: 45, popularity: 2 },
    { id: 'flower', name: '季節の花壇', category: '街の装飾', icon: '花壇', cost: 35, popularity: 2 },
    { id: 'lamp', name: 'あたたかい街灯', category: '街の装飾', icon: '街灯', cost: 55, popularity: 3 },
    { id: 'rack', name: '古着ラック', category: '古着装飾', icon: 'ラック', cost: 70, popularity: 5 },
    { id: 'table', name: 'テラス席セット', category: 'カフェ家具', icon: 'テーブル', cost: 70, popularity: 5 },
    { id: 'stageLight', name: 'ステージライト', category: 'イベント装飾', icon: 'ライト', cost: 90, popularity: 7 },
    { id: 'furugyHat', name: 'フルギーの帽子', category: 'キャラ衣装', icon: '帽子', cost: 75, popularity: 4 },
    { id: 'canal', name: '水辺スキン', category: '背景スキン', icon: '運河', cost: 120, popularity: 10 }
  ],
  quests: [
    { id: 'open', title: 'NEXCA TOWNを開く', action: 'openTown', target: 1, rewardPoints: 25, rewardExp: 20 },
    { id: 'talk', title: '公式キャラに話しかける', action: 'talkChar', target: 1, rewardPoints: 20, rewardExp: 15 },
    { id: 'mini', title: 'ミニゲームを1回遊ぶ', action: 'playMiniGame', target: 1, rewardPoints: 35, rewardExp: 30 },
    { id: 'code', title: '参加コードを入力する', action: 'redeemCode', target: 1, rewardPoints: 60, rewardExp: 55 },
    { id: 'collect', title: '建物報酬を回収する', action: 'collectReward', target: 1, rewardPoints: 25, rewardExp: 18 }
  ],
  codes: {
    VINTAGE50: { genre: 'vintage', title: '古着ストリート発掘体験', placeName: 'Nexca Vintage', points: 120, playerExp: 85, buildingExp: 100, characterExp: 80, badge: '初めての古着バッジ' },
    CAFE50: { genre: 'cafe', title: 'カフェ通りの一杯', placeName: 'Nexca Cafe', points: 100, playerExp: 75, buildingExp: 90, characterExp: 75, badge: '初めてのカフェバッジ' },
    EVENT100: { genre: 'event', title: 'イベント・体験参加', placeName: 'Nexca Experience', points: 150, playerExp: 110, buildingExp: 120, characterExp: 95, badge: '初めての体験バッジ' }
  }
};
