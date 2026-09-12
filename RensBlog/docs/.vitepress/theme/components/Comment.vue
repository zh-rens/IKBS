<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const container = ref<HTMLDivElement | null>(null)

const repo = 'zh-rens/IKBS'
const repoId = 'R_kgDOUSRWHw'
const category = 'General'
const categoryId = 'DIC_kwDOUSRWH84DFcTh'

function loadGiscus() {
  if (!container.value) return

  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'

  script.setAttribute('data-repo', repo)
  script.setAttribute('data-repo-id', repoId)
  script.setAttribute('data-category', category)
  script.setAttribute('data-category-id', categoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')

  container.value.appendChild(script)
}

onMounted(loadGiscus)

watch(
  () => page.value.relativePath,
  () => {
    loadGiscus()
  }
)
</script>

<template>
  <div class="giscus-wrapper">
    <div ref="container" />
  </div>
</template>