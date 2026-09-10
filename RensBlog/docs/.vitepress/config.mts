import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-confiBg
export default defineConfig({
  title: "RENSBLOG",
  description: "IKBS About My Life",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
  // 自动生成文章目录导航
  outline: {
    level: [2, 3],        // 显示 h2 和 h3 标题，'deep' 显示全部层级
    label: '本文目录'      // 目录的标题文字
  },
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
