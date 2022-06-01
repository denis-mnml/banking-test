<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PageHeader from '@/components/Common/PageHeader.vue'
  import CardForm from '@/components/Forms/CardForm.vue'
  import BankAccountForm from '@/components/Forms/BankAccountForm.vue'
  import Tabs from '@/components/Ui/AppTabs.vue'

  const route = useRoute()
  const cardForm = ref()
  const bankAccountForm = ref()
  const activeTab = computed(() => route.query.tab)
  const isEdit = computed(() => !!route.params.id)
  const isCard = computed(() => activeTab.value !== 'bank-account')
  const animation = computed(() => (isCard.value ? 'slide-right' : 'slide-left'))
  const title = computed(() => {
    if (isEdit.value) {
      if (isCard.value) return 'Edit card'
      return 'Edit bank account'
    }

    return route.meta.title
  })

  const tabs = [
    {
      title: 'Card',
      name: 'card',
    },
    {
      title: 'Bank Account',
      name: 'bank-account',
    },
  ]

  function resetForm() {
    cardForm.value?.resetForm()
    bankAccountForm.value?.resetForm()
  }
</script>

<template>
  <PageHeader back-to="/" @back="resetForm" :title="title" />
  <Tabs v-if="!isEdit" class="mb-6" :tabs="tabs" />
  <div class="flex flex-col grow relative h-full overflow-hidden -mx-5 px-5">
    <Transition :name="animation">
      <CardForm v-if="isCard" ref="cardForm" />
      <BankAccountForm v-else ref="bankAccountForm" />
    </Transition>
  </div>
</template>
