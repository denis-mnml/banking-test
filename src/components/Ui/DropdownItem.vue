<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    to?: string | { name: string, params: any }
  }>()
  
  const componentName = ref(props.to ? 'router-link' : 'div')
</script>

<template>
  <component :is="componentName" :to="to" class="dropdown-item">
    <slot />
  </component>
</template>
