<script setup lang="ts">
  import PageHeader from '@/components/Common/PageHeader.vue'
  import PaymentForm from '@/components/Payment/PaymentForm.vue'
</script>

<template>
  <PageHeader title="Make Payment">
    <template #backBtn>
      <Menu2Icon />
    </template>
  </PageHeader>
  <PaymentForm />
</template>
