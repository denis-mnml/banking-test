<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { BankAccount, Card, SelectOption } from '@/types'
  import { getProtectedCardNumber } from '@/utils'
  import AppDropdown from '@/components/Ui/AppDropdown.vue'
  import AppDropdownItem from '@/components/Ui/AppDropdownItem.vue'
  import { useBankAccountsStore, useCardsStore } from '@/stores'

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
    (e: 'delete', value: number): void
  }>()

  const { storage: cardsStore } = useCardsStore()
  const { storage: bankAccountsStore } = useBankAccountsStore()

  const cardType = 'cardNumber' in props.card ? 'card' : 'bankAccount'
  const cardNumber = 'fullName' in props.card ? props.card.fullName : props.card.accountName
  const cardExpiry = 'expiryDate' in props.card ? props.card.expiryDate : ''
  const cardImgSrc = computed(() => {
    let type = 'https://cdn.worldvectorlogo.com/logos/bank-mandiri.svg'

    if ('cardNumber' in props.card) {
      console.log(props.card.cardNumber.toString())
      console.log(props.card.cardNumber.toString().charAt(0))
      type =
        Number(props.card.cardNumber.toString().charAt(0)) > 5
          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/772px-Mastercard-logo.svg.png'
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png?20170118154621'
    }

    return type
  })

  const to = ref({
    name: 'EditPaymentMethod',
    params: { id: props.card.id },
    ...(cardType === 'bankAccount' ? { query: { tab: 'bank-account' } } : {}),
  })

  function removeItem() {
    const storage = eval(cardType === 'card' ? 'cardsStore' : 'bankAccountsStore') as Card[] | BankAccount[]
    const idx = storage.findIndex((item) => item.id === props.card.id)
    if (idx !== -1) {
      storage.splice(idx, 1)
      emit('delete', props.card.id)
    }
  }
</script>

<template>
  <div class="w-full p-4 rounded-xl shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]">
    <div class="flex justify-between mb-2">
      <img :src="cardImgSrc" class="block max-w-full h-4" alt="Card type" />
      <AppDropdown class="mt-1 ml-auto">
        <template #trigger>
          <DotsVerticalIcon size="20" class="text-gray-400" />
        </template>
        <template #menu>
          <AppDropdownItem :to="to">Edit</AppDropdownItem>
          <AppDropdownItem @click="removeItem">Delete</AppDropdownItem>
        </template>
      </AppDropdown>
    </div>
    <div class="flex items-center mb-2">
      <div
        :class="slotData.isSelected ? 'bg-green-600' : 'bg-gray-200'"
        class="flex items-center justify-center h-5 min-w-[1.25rem] basis-5 mr-2 text-white rounded-full"
      >
        <CheckIcon v-if="slotData.isSelected" size="12" />
      </div>
      <div class="font-bold text-gray-800">{{ cardNumber }}</div>
    </div>
    <div class="flex justify-between">
      <div class="text-gray-400 text-sm">{{ getProtectedCardNumber(card) }}</div>
      <div class="text-gray-400 text-sm" v-if="cardExpiry">{{ cardExpiry }}</div>
    </div>
  </div>
</template>
