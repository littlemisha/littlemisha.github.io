export default {
  lang: 'zh-CN',
  title: '小米夏的笔记',
  description: '学习Java时做的笔记',
  cleanUrls: 'true',  //去除 .html 后缀
  lastUpdated: 'true',  //显示页面最后更新时间
  head: [
    // 1. 传统 favicon
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // 2. 16x16 PNG 图标
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    // 3. 32x32 PNG 图标
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    // 4. Apple Touch 图标 (iOS设备)
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    // 5. 192x192 PNG 图标
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' }],
    // 6. 512x512 PNG 图标
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon-512x512.png' }]
  ]
}