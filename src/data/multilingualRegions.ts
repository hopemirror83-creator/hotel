export const multilingualRegions = {
  myeongdong: {
    path: 'myeongdong-hotels',
    localePath: 'seoul/myeongdong-hotels',
    koPath: '/seoul/myeongdong-hotels/',
    enName: 'Myeongdong, Seoul',
    jaName: 'ソウル・明洞',
    enTitle: 'Myeongdong hotels, compared before you book',
    jaTitle: '予約前に比較する明洞ホテル',
    slugs: ['seoul-788681', 'seoul-1810284', 'seoul-108250', 'seoul-1110738', 'seoul-399361', 'seoul-908128', 'seoul-407482', 'seoul-29283814']
  },
  gangnam: {
    path: 'gangnam-hotels',
    localePath: 'seoul/gangnam-hotels',
    koPath: '/seoul/gangnam-hotels/',
    enName: 'Gangnam, Seoul',
    jaName: 'ソウル・江南',
    enTitle: 'Gangnam hotels for business, COEX and city travel',
    jaTitle: '出張・COEX・観光で選ぶ江南ホテル',
    slugs: ['seoul-1620721', 'seoul-764629', 'seoul-4969637', 'seoul-1974802', 'seoul-2961984', 'seoul-1198189', 'seoul-12448894', 'seoul-699258']
  },
  hongdae: {
    path: 'hongdae-hotels',
    localePath: 'seoul/hongdae-hotels',
    koPath: '/seoul/hongdae-mapo-hotels/',
    enName: 'Hongdae, Seoul',
    jaName: 'ソウル・弘大',
    enTitle: 'Hongdae hotels for airport rail, nightlife and Seoul travel',
    jaTitle: '空港鉄道・夜遊び・観光で選ぶ弘大ホテル',
    slugs: ['seoul-3743390', 'seoul-5056661', 'seoul-1403676', 'seoul-6179956', 'seoul-35154502', 'seoul-292286', 'seoul-15285321', 'seoul-570453']
  },
  incheonAirport: {
    path: 'airport-hotels',
    localePath: 'incheon/airport-hotels',
    koPath: '/incheon/yeongjongdo-airport-hotels/',
    enName: 'Incheon Airport, South Korea',
    jaName: '韓国・仁川国際空港',
    enTitle: 'Incheon Airport hotels for early flights, late arrivals and airport transfers',
    jaTitle: '早朝便・深夜到着・空港アクセスで選ぶ仁川国際空港ホテル',
    slugs: ['nest-hotel-incheon', 'incheon-2070028', 'incheon-3155645', 'incheon-49124', 'incheon-50405896', 'incheon-1194169', 'incheon-35614450', 'incheon-74232024']
  },
  busan: {
    path: 'hotels',
    localePath: 'busan/hotels',
    koPath: '/busan/busan-hotel-comparison/',
    enName: 'Busan, South Korea',
    jaName: '韓国・釜山',
    enTitle: 'Busan hotels for Haeundae Beach, Busan Station and city travel',
    jaTitle: '海雲台・釜山駅・西面へのアクセスで選ぶ釜山ホテル',
    slugs: ['busan-13870752', 'busan-65460', 'busan-16933389', 'busan-1974844', 'busan-52027642', 'busan-42958', 'busan-9079659', 'busan-4576021']
  },
  jeju: {
    path: 'hotels',
    localePath: 'jeju/hotels',
    koPath: '/jeju/jeju-hotel-comparison/',
    enName: 'Jeju Island, South Korea',
    jaName: '韓国・済州島',
    enTitle: 'Jeju Island hotels for airport access, Jungmun resorts and island travel',
    jaTitle: '済州空港・中文・西帰浦・城山への旅で選ぶ済州島ホテル',
    slugs: ['jeju-567545', 'jeju-18209350', 'jeju-31451473', 'jeju-42957', 'jeju-18875336', 'jeju-1199068', 'jeju-178625', 'jeju-302120']
  }
} as const;

export type MultilingualRegionKey = keyof typeof multilingualRegions;
