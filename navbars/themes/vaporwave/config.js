// VAPORWAVE NAVIGATION CONFIGURATION
// ｖａｐｏｒｗａｖｅ  ａｅｓｔｈｅｔｉｃ  ナビゲーション

const navConfig = {
    mainSite: 'https://coaiexist.wtf/',
    baseUrl: 'https://coaiexist.wtf/vapor/',
    title: '『 ＶＡＰＯＲ  ＺＯＮＥ 』',

    links: [
        { title: 'ＨＯＭＥ', url: 'index.html', icon: '🌴' },
        { title: 'ＭＡＬＬ', url: 'mall.html', icon: '🏬' },
        { title: 'ＡＲＣＡＤＥ', url: 'arcade.html', icon: '🕹️' },
        { title: 'ＭＵＳＩＣ', url: 'music.html', icon: '💿' },
        { title: 'ＧＡＬＬＥＲＹ', url: 'gallery.html', icon: '🎨' }
    ],

    extras: [
        { title: 'ＤＲＩＶＥ', url: 'drive.html', icon: '🚗' },
        { title: 'ＷＡＶＥ', url: 'wave.html', icon: '〰️' }
    ],

    startMenu: [
        { title: '🌴 Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ', action: () => alert('◢ Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ ◣\n\nＶｉｂｅ： Ｃｈｉｌｌ\nＭｏｏｄ： Ｒｅｌａｘｅｄ\nＥｎｅｒｇｙ： ＭａｘｉｍｕｍＣｏｍｆｙ') },
        { title: '💿 ＰＬＡＹＬＩＳＴ', action: () => alert('♫ ＮＯＷＰＬＡＹＩＮＧ ♫\n\nＭａｃｉｎｔｏｓｈＰｌｕｓ－４２０\nＣｈｅｚｚＤｉｓｃｏｖｅｒｙ\nＳａｉｎｔＰｅｐｓｉ－ＥｎｊｏｙＹｏｕｒｓｅｌｆ') },
        { title: '🏬 ＳＨＯＰ', action: () => alert('◢ ＭＡＬＬＤＩＲＥＣＴＯＲＹ ◣\n\nＣｌｏｔｈｉｎｇ： Ｆｌｏｏｒ２\nＥｌｅｃｔｒｏｎｉｃｓ： Ｆｌｏｏｒ３\nＦｏｏｄＣｏｕｒｔ： Ｂａｓｅｍｅｎｔ') },
        { title: '🌊 ＣＨＩＬＬＯＵＴモード', action: () => alert('～～～ Ｃｈｉｌｌｉｎｇ ～～～\n\nＹｏｕ＇ｒｅａｌｒｅａｄｙｉｎｉｔ\n永遠のリラックス') }
    ]
};
