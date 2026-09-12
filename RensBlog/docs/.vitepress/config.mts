import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RENSBLOG",
  description: "IKBS About My Life",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    // 👇 把当前文章的目录放到左侧
    aside: 'left',
    outline: {
      level: [2, 3],      // 显示 h2 和 h3 标题
      label: '本页目录'    // 目录标题（默认是 "On this page"）
    },
    sidebar: undefined,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zh-rens/IKBS' }
    ]
  }
})