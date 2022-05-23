<script setup lang="ts">
  import { computed } from 'vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import { BankAccount, Card, SelectOption } from '@/types'
  import { getProtectedCardNumber } from '@/utils'

  const props = defineProps<{
    slotData: {
      item: SelectOption
      isSelected: boolean
      isFirst: boolean
      isLast: boolean
    }
    card: Card | BankAccount
  }>()

  const emit = defineEmits<{
    (e: 'remove', value: number): void
  }>()

  function remove() {
    emit('remove', props.card.id)
  }

  const cardImgSrc = computed(() => {
    let type = 'bank'

    if ('cardNumber' in props.card) {
      type = parseInt(props.card.cardNumber.toString().charAt(0)) > 5
        ? 'mastercard'
        : 'visa'
    }

    return `@/assets/img/${type}.svg`
  })
</script>

<template>
  <div class="w-full p-4 rounded-xl shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]">
    <div class="flex justify-between mb-4">
      <img :src="cardImgSrc" class="block max-w-full h-6" alt="Card type">
      <AppButton class="!h-6 w-6 -mr-2 !px-0 text-gray-400" @click="remove">
        <DotsVerticalIcon />
      </AppButton>
    </div>
    <div class="flex items-center mb-2">
      <div
        :class="slotData.isSelected ? 'bg-green-600' : 'bg-gray-200'"
        class="flex items-center justify-center h-5 min-w-[1.25rem] basis-5 mr-2  text-white rounded-full"
      >
        <CheckIcon v-if="slotData.isSelected" size="12" />
      </div>
      <div class="font-bold text-gray-800">{{ card.fullName || card.accountName }}</div>
    </div>
    <div class="flex justify-between">
      <div class="text-gray-400 text-sm">{{ getProtectedCardNumber(card) }}</div>
      <div class="text-gray-400 text-sm" v-if="card.expiryDate">
        {{ card.expiryDate }}
      </div>
    </div>
  </div>
</template>