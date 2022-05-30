<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PageHeader from '@/components/Common/PageHeader.vue'
  import CardForm from '@/components/PaymentMethods/CardForm.vue'

  const route = useRoute()
  const cardForm = ref()

  function resetForm() {
    cardForm.value.resetForm()
  }
</script>

<template>
  <PageHeader back-to="/" @back="resetForm" :title="route.meta.title" />
  <CardForm ref="cardForm" />
</template>
