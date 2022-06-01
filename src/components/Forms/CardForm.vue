<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'
  import AppInput from '@/components/Ui/AppInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import { Card } from '@/types'
  import { useCardsStore } from '@/stores'

  type CardFormValues = Omit<Card, 'id'>

  const router = useRouter()
  const route = useRoute()

  const { storage: cardFormDraft, destroyStorage: destroyCardFormDraft } =
    useLocalStorage<Partial<CardFormValues>>('cardFormDraft')
  const { storage: cardsStore } = useCardsStore()

  const cardToEdit = computed(() => {
    if ('id' in route.params) {
      return cardsStore.find((item) => item.id === parseInt(route.params.id as string)) || {}
    }
    return {}
  })

  const isEdit = computed(() => Object.keys(cardToEdit.value).length !== 0)

  const { handleSubmit, handleReset } = useForm({
    initialValues: {
      ...cardFormDraft,
      ...cardToEdit.value,
    },
    validationSchema: yup.object({
      fullName: yup.string().required().max(30).label('Full name'),
      cardNumber: yup
        .string()
        .required()
        .label('Card number')
        .test(
          'test-number',
          'Card number must contain 16 digits',
          (value) => (value && value?.length === 19) as boolean
        ),
      expiryDate: yup
        .string()
        .required()
        .label('Expiry date')
        .test('test-expiry', 'Expiry date is incorrect', (value) => {
          if (value && value.length === 5) {
            const [month, year] = value.split('/')
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1
            return (
              Number(month) > currentMonth &&
              Number(month) <= 12 &&
              Number('20' + year) >= currentYear &&
              Number('20' + year) <= currentYear + 3
            )
          }

          return false
        }),
    }),
  })

  const { value: fullName, errorMessage: fullNameError } = useField<string | undefined>('fullName')
  const { value: cardNumber, errorMessage: cardNumberError } = useField<string | undefined>('cardNumber')
  const { value: expiryDate, errorMessage: expiryDateError } = useField<string | undefined>('expiryDate')

  const onSubmit = handleSubmit((values) => {
    console.log('Add card', values, isEdit.value)
    if (isEdit.value) {
      const card = cardToEdit.value as Card
      const idx = cardsStore.findIndex((item) => item.id === card.id)

      if (idx !== -1) {
        cardsStore[idx] = {
          ...card,
          ...values,
        }
      }
    } else {
      cardsStore.push({
        id: Date.now(),
        ...(values as CardFormValues),
      })
    }

    router.push('/')
    destroyCardFormDraft()
  })

  const onInput = (e: Event) => {
    if (!isEdit.value) {
      const name = (e.target as HTMLInputElement).name as keyof CardFormValues
      const value = (e.target as HTMLInputElement).value

      cardFormDraft[name] = value
    }
  }

  function resetForm() {
    destroyCardFormDraft()
    handleReset()
  }

  defineExpose({
    resetForm,
  })
</script>

<template>
  <form class="flex flex-col grow" autocomplete="off" @submit.prevent="onSubmit" @input="onInput">
    <AppInput
      class="mb-6"
      label="Full Name"
      name="fullName"
      placeholder="Enter full name"
      :error="!!fullNameError"
      :help-text="fullNameError"
      v-model="fullName"
    />
    <AppInput
      class="mb-6"
      label="Card Number"
      name="cardNumber"
      inputmode="numeric"
      mask="card"
      placeholder="Enter card number"
      :error="!!cardNumberError"
      :help-text="cardNumberError"
      v-model="cardNumber"
    />
    <AppInput
      class="mb-6"
      label="Expiry date"
      name="expiryDate"
      inputmode="numeric"
      mask="expiry"
      placeholder="Enter expiry date"
      :error="!!expiryDateError"
      :help-text="expiryDateError"
      v-model="expiryDate"
    />
    <AppButton html-type="submit" type="success" class="mt-auto">Save</AppButton>
  </form>
</template>
