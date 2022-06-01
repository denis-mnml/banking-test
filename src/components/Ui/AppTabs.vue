<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'

  export type Tab = {
    title: string
    name: string
  }

  export type Tabs = Tab[]

  const props = defineProps<{
    tabs: Tab[]
    activeTab?: string
  }>()

  const route = useRoute()
  const router = useRouter()
  const isActiveTab = (tabName: string, index: number) => {
    return (route.query.tab === tabName || props.activeTab === tabName) || !route.query.tab && !props.activeTab && index === 0
  }


  function switchTab(tab: string) {
    router.push({
      ...route,
      query: {
        ...route.query,
        tab
      }
    })
  }
</script>

<template>
  <div class="tabs">
    <div
      class="tabs__item"
      :class="{ tabs__item_active: isActiveTab(tab.name, index)  }"
      v-for="(tab, index) in tabs"
      :key="tab.name"
      @click="switchTab(tab.name)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>
