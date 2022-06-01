<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import PageHeader from '@/components/Common/PageHeader.vue'
  import PaymentForm from '@/components/Forms/PaymentForm.vue'

  const router = useRouter()
  const route = useRoute()
</script>

<template>
  <div class="mt-16">
    <div class="success mx-auto mb-4">
      <CheckIcon class="success__icon" size="56" />
    </div>
    <div class="text-xl text-gray-700 font-medium text-center">Payment completed successfully</div>
  </div>
  <router-link to="/" class="btn btn_primary mt-auto">Make another one</router-link>
</template>
