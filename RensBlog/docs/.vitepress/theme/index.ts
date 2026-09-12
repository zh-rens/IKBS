// https://vitepress.dev/guide/custom-theme
import { h, onBeforeUnmount, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

// 导航栏滚动隐藏逻辑
function useScrollNav() {
  let ticking = false
  const SHOW_THRESHOLD = 50 // 滚回距离顶部 50px 以内时才显示导航栏

  const updateNav = () => {
    const nav = document.querySelector('.VPNav') as HTMLElement
    if (!nav) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop <= SHOW_THRESHOLD) {
      // 接近顶部 -> 显示导航栏
      nav.classList.remove('nav-hidden')
    } else {
      // 离开顶部 -> 隐藏导航栏
      nav.classList.add('nav-hidden')
    }

    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav)
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    // 页面加载时就处于滚动位置（浏览器恢复会话）也能正确更新状态
    updateNav()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })
}

// 包装 Layout 以注入滚动逻辑
// 注意：必须是带 setup() 的对象组件，函数式组件没有组件实例，
// 内部的 onMounted 不会执行（Vue 会报 "no active component instance" 警告）
const CustomLayout = {
  setup() {
    useScrollNav()
    return () => h(DefaultTheme.Layout, null, {})
  }
}

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme