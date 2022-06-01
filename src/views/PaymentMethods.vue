<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PageHeader from '@/components/Common/PageHeader.vue'
  import CardForm from '@/components/PaymentMethods/CardForm.vue'
  import Tabs from '@/components/Ui/Tabs.vue'

  const route = useRoute()
  const cardForm = ref()
  const activeTab = computed(() => route.query.tab)

  const tabs = [
    {
      title: 'Card',
      name: 'card'
    },
    {
      title: 'Bank Account',
      name: 'bank-account'
    }
  ]

  const animation = computed(() => activeTab.value === 'bank-account' ? 'slide-left' : 'slide-right')

  function resetForm() {
    cardForm.value.resetForm()
  }
</script>

<template>
  <PageHeader back-to="/" @back="resetForm" :title="route.meta.title" />
  <Tabs class="mb-6" :tabs="tabs" />
  <div class="flex flex-col grow relative h-full overflow-hidden -mx-5 px-5">
    <Transition :name="animation">
      <CardForm v-if="activeTab === 'card'" ref="cardForm" />
      <CardForm v-else ref="bankAccountForm" />
    </Transition>
  </div>
</template>
