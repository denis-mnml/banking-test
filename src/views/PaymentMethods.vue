<script setup lang="ts">
  import PageHeader from '@/components/Common/PageHeader.vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
</script>

<template>
  <PageHeader back-to="/" :title="route.meta.title" />
</template>
