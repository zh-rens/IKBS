import { defineConfig } from 'vitepress'
import katex from 'katex'

export default defineConfig({
  title: "RENSBLOG",
  description: "IKBS About My Life",
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css' }]
  ],
  markdown: {
    config: (md) => {
      md.inline.ruler.after('escape', 'math_inline', (state: any, silent: boolean) => {
        if (state.src.charCodeAt(state.pos) !== 0x24) return false
        const start = state.pos + 1
        const end = state.src.indexOf('$', start)
        if (end === -1) return false
        if (end === start) return false
        const content = state.src.slice(start, end)
        if (silent) return true
        const token = state.push('math_inline', '', 0)
        token.content = content
        state.pos = end + 1
        return true
      })
      md.renderer.rules.math_inline = (tokens: any[], idx: number) => {
        try {
          return katex.renderToString(tokens[idx].content, { throwOnError: false })
        } catch {
          return tokens[idx].content
        }
      }

      md.block.ruler.before('paragraph', 'math_block', (state: any, start: number, end: number, silent: boolean) => {
        if (state.bMarks[start] + 2 !== state.tShift[start]) return false
        const firstPos = state.bMarks[start] + state.tShift[start]
        if (state.src.charCodeAt(firstPos) !== 0x24 || state.src.charCodeAt(firstPos + 1) !== 0x24) return false
        let next = start + 1
        while (next < end) {
          const np = state.bMarks[next] + state.tShift[next]
          if (state.src.charCodeAt(np) === 0x24 && state.src.charCodeAt(np + 1) === 0x24 &&
              state.tShift[next] + 2 >= state.src.slice(state.bMarks[next]).search(/\S/)) {
            const content = state.src.slice(firstPos + 2, np).trim()
            if (silent) return true
            const token = state.push('math_block', '', 0)
            token.block = true
            token.content = content
            token.map = [start, next + 1]
            state.tos = next + 1
            return true
          }
          next++
        }
        return false
      })
      md.renderer.rules.math_block = (tokens: any[], idx: number) => {
        try {
          return `<div class="katex-display">${katex.renderToString(tokens[idx].content, { throwOnError: false, displayMode: true })}</div>`
        } catch {
          return tokens[idx].content
        }
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Articles', link: '/Articles' },
    ],
    aside: 'left',
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    sidebar: undefined,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zh-rens/IKBS' }
    ]
  }
})