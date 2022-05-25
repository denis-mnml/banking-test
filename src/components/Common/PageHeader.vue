<script setup lang="ts">
  import { RouteNames } from '@/router'

  defineProps<{
    backTo?: string | Record<'name', RouteNames>
    title: string
  }>()
  
  const emit = defineEmits<{
    (e: 'back'): void
  }>()
</script>

<template>
  <div class="page-header">
    <router-link v-if="backTo" :to="backTo" class="page-header__back" @click="emit('back')">
      <ArrowLeftIcon />
    </router-link>
    <div class="page-header__back" v-else>
      <slot name="backBtn"></slot>
    </div>
    <h1 class="page-heading">{{ title }}</h1>
  </div>
</template>