<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { BankAccount, Card, Contact, SelectGroupOption, SelectOption } from '@/types'
  import { getProtectedCardNumber, isEmpty } from '@/utils'
  import AppInput from '@/components/Ui/AppInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import AppSelect from '@/components/Ui/AppSelect.vue'
  import PaymentMethodCard from '@/components/Common/PaymentMethodCard.vue'
  import ContactCard from '@/components/Common/ContactCard.vue'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'
  import { useBankAccountsStore, useCardsStore, useContactsStore } from '@/stores'
  import { useRouter } from 'vue-router'

  type PayFormValues = {
    recipient: number
    method: number
    amount: number
  }

  const router = useRouter()
  const isLoading = ref(false)

  const { storage: contactsStore } = useContactsStore()
  const { storage: cardsStore } = useCardsStore()
  const { storage: bankAccountsStore } = useBankAccountsStore()
  const { storage: payFormDraft, destroyStorage: destroyPayFormDraft } =
    useLocalStorage<Partial<PayFormValues>>('payFormDraft')

  // FORM
  const { handleSubmit, handleReset, setValues } = useForm({
    initialValues: {
      ...payFormDraft,
    },
    validationSchema: yup.object({
      recipient: yup.number().required().label('Last name'),
      method: yup.number().required().label('Payment method'),
      amount: yup.number().typeError('Amount is a required field').required().label('Amount'),
    }),
  })

  const {
    value: recipient,
    errorMessage: recipientError,
    resetField: resetRecipient,
  } = useField<number | undefined>('recipient')
  const { value: method, errorMessage: methodError, resetField: resetMethod } = useField<number | undefined>('method')
  const { value: amount, errorMessage: amountError } = useField<number | undefined>('amount')

  const onSubmit = handleSubmit(() => {
    isLoading.value = true

    setTimeout(() => {
      router.push({ name: 'Thanks', query: { order: 261572 } })
      handleReset()
      destroyPayFormDraft()
    }, 2000)
  })

  const onInput = (e: Event) => {
    const name = (e.target as HTMLInputElement).name as keyof PayFormValues
    const value = parseInt((e.target as HTMLInputElement).value)
    payFormDraft[name] = value
  }

  const onChangeSelect = (key: keyof PayFormValues, value: string | number) => {
    if (value) payFormDraft[key] = Number(value)
  }

  const contactOptions = computed<SelectOption[]>(() =>
    contactsStore.map((item) => ({
      title: `${item.firstName} ${item.lastName}`,
      value: item.id,
    }))
  )

  const paymentOptions = computed<SelectGroupOption[]>(() => {
    const options = []

    if (!isEmpty(cardsStore)) {
      options.push({
        groupTitle: 'Credit/debit cards',
        options: cardsStore.map((item) => ({ title: item.fullName, value: item.id })),
      })
    }

    if (!isEmpty(bankAccountsStore)) {
      options.push({
        groupTitle: 'Bank accounts',
        options: bankAccountsStore.map((item) => ({ title: item.accountName, value: item.id })),
      })
    }

    return options
  })

  function removeItem(type: keyof PayFormValues, id: number) {
    if (payFormDraft[type] === id) {
      delete payFormDraft[type]

      if (type === 'recipient') resetRecipient()
      if (type === 'method') resetMethod()
    }
  }

  function getItemById<T extends { id: number }>(items: T[], id: number) {
    return items.find((item) => item.id === id) as T
  }

  function getContactEmail(value: number) {
    const item = getItemById<Contact>(contactsStore, value)
    return item?.email || ''
  }

  function getCardNumber(value: number) {
    const item = getItemById<Card | BankAccount>([...cardsStore, ...bankAccountsStore], value)
    return getProtectedCardNumber(item)
  }
</script>

<template>
  <form class="flex flex-col grow" @submit.prevent="onSubmit" @input="onInput">
    <AppSelect
      class="mb-6"
      :options="contactOptions"
      label="Select contact"
      placeholder="Select contact"
      :error="!!recipientError"
      :help-text="recipientError"
      v-model="recipient"
      @change="(v) => onChangeSelect('recipient', v)"
    >
      <template #action>
        <router-link :to="{ name: 'Contacts' }" class="text-sm font-semibold text-blue-600"> + Add</router-link>
      </template>
      <template v-slot:selectedView="{ item }">
        <div class="max-w-full overflow-hidden">
          <div class="font-bold text-gray-900 text-sm truncate">
            {{ item.title }}
          </div>
          <div class="text-gray-400 text-xs truncate">
            {{ getContactEmail(item.value) }}
          </div>
        </div>
      </template>
      <template v-slot:optionItem="data">
        <ContactCard
          :slot-data="data"
          :contact="getItemById(contactsStore, data.item.value)"
          @delete="(v) => removeItem('recipient', v)"
        />
      </template>
      <template #empty>
        <div class="my-6 text-center">
          <div class="text-gray-400 text-sm mb-1">You don't have any contacts yet</div>
          <router-link to="/contacts" class="font-medium text-blue-600 underline">Add contact</router-link>
        </div>
      </template>
    </AppSelect>
    <AppSelect
      class="mb-6"
      label="Payment Method"
      placeholder="Select method"
      :options="paymentOptions"
      :error="!!methodError"
      :help-text="methodError"
      v-model="method"
      @change="(v) => onChangeSelect('method', v)"
    >
      <template #action>
        <router-link :to="{ name: 'PaymentMethods' }" class="text-sm font-semibold text-blue-600">+ Add</router-link>
      </template>
      <template v-slot:selectedView="{ item }">
        <div class="font-bold text-gray-900 text-sm">{{ item.title }}</div>
        <div class="text-gray-400 text-xs">{{ getCardNumber(item.value) }}</div>
      </template>
      <template v-slot:optionItem="data">
        <PaymentMethodCard
          class="mb-4"
          :slot-data="data"
          :card="getItemById([...cardsStore, ...bankAccountsStore], data.item.value)"
          @delete="(v) => removeItem('method', v)"
        />
      </template>
      <template #empty>
        <div class="my-6 text-center">
          <div class="text-gray-400 text-sm mb-1">You don't have any payments methods yet</div>
          <router-link to="/payment-methods" class="font-medium text-blue-600 underline">
            Add payment method
          </router-link>
        </div>
      </template>
    </AppSelect>
    <AppInput
      class="mb-8"
      type="number"
      label="Amount"
      name="amount"
      placeholder="Enter amount"
      :error="!!amountError"
      :help-text="amountError"
      v-model="amount"
    />
    <AppButton class="mt-auto w-full" html-type="submit" type="primary" :loading="isLoading">Pay</AppButton>
  </form>
</template>
