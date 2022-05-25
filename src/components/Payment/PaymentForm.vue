<script setup lang="ts">
  import { ref } from 'vue'
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { BankAccount, Card, Contact, SelectGroupOptions, SelectOption } from '@/types'
  import { getProtectedCardNumber } from '@/utils'
  import FormInput from '@/components/Form/FormInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import AppSelect from '@/components/Ui/AppSelect.vue'
  import PaymentMethodListItem from '@/components/PaymentMethod/PaymentMethodListItem.vue'
  import ContactsListItem from '@/components/Contacts/ContactsListItem.vue'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  type PayFormValues = {
    amount: number
    recipient: number
    method: number
  }

  const isLoading = ref(false)

  const { storage: contacts } = useLocalStorage<Contact[]>('contacts', [])
  const { storage: cards } = useLocalStorage<Card[]>('cards', [])
  const { storage: bankAccounts } = useLocalStorage<BankAccount[]>('bankAccounts', [])
  const {
    storage: payFormDraft,
    destroyStorage: destroyPayFormDraft
  } = useLocalStorage<Partial<PayFormValues>>('payFormDraft')

  const { handleSubmit, handleReset } = useForm({
    initialValues: {
      ...payFormDraft
    },
    validationSchema: yup.object({
      recipient: yup.number().required().label('Last name'),
      method: yup.number().required().label('Payment method'),
      amount: yup.number().required().label('Amount')
    })
  })

  const { value: recipient, errorMessage: recipientError } = useField('recipient')
  const { value: method, errorMessage: methodError } = useField('method')
  const { value: amount, errorMessage: amountError } = useField('amount')

  const onSubmit = handleSubmit(() => {
    handleReset()
    destroyPayFormDraft()
  })

  const onInput = (e: InputEvent) => {
    const name = (e.target as HTMLInputElement).name as keyof PayFormValues
    const value = parseInt((e.target as HTMLInputElement).value)
    console.log('onInput', name, value)
    payFormDraft[name] = value
  }

  const onChangeSelect = (value: number, name: keyof PayFormValues) => {
    if (value) {
      console.log('onChangeSelect', name, value)
      payFormDraft[name] = value
    }
  }

  const contactOptions: SelectOption[] = contacts.map((item) => ({
    title: `${item.firstName} ${item.lastName}`,
    value: item.id
  }))

  const paymentOptions: SelectGroupOptions[] = [
    {
      groupTitle: 'Credit/debit cards',
      options: cards.map((item) => ({ title: item.fullName, value: item.id }))
    },
    {
      groupTitle: 'Bank accounts',
      options: bankAccounts.map((item) => ({
        title: item.accountName,
        value: item.id
      }))
    }
  ]

  function removeItem(type: string, id: string) {
    console.log('Remove Item', type, id)
  }

  function getItemById<T extends { id: number }>(items: T[], id: number) {
    return items.find((item) => item.id === id)
  }

  function getContactEmail(value: number) {
    const item = getItemById<Contact>(contacts, value) as Contact
    return item?.email || ''
  }

  function getCardNumber(value: number) {
    const item = getItemById<Card | BankAccount>([...cards, ...bankAccounts], value) as Card
    return item ? getProtectedCardNumber(item) : ''
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
      @change="(v) => onChangeSelect(v, 'recipient')"
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
        <ContactsListItem :slot-data="data" :contact="getItemById(contacts, data.item.value)" />
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
      :options="paymentOptions"
      label="Payment Method"
      name="paymentMethod"
      placeholder="Select method"
      :error="!!methodError"
      :help-text="methodError"
      v-model="method"
    >
      <template #action>
        <router-link :to="{ name: 'PaymentMethods' }" class="text-sm font-semibold text-blue-600"> + Add</router-link>
      </template>
      <template v-slot:selectedView="{ item }">
        <div class="font-bold text-gray-900 text-sm">{{ item.title }}</div>
        <div class="text-gray-400 text-xs">{{ getCardNumber(item.value) }}</div>
      </template>
      <template v-slot:optionItem="data">
        <PaymentMethodListItem
          class="mb-4"
          :slot-data="data"
          :card="getItemById([...cards, ...bankAccounts], data.item.value)"
          @remove="removeItem('card', data.item.value)"
        />
      </template>
      <template #empty>
        <div class="my-6 text-center">
          <div class="text-gray-400 text-sm mb-1">You don't have any payments methods yet</div>
          <router-link to="/payment-methods" class="font-medium text-blue-600 underline">Add payment method
          </router-link>
        </div>
      </template>
    </AppSelect>
    <FormInput
      class="mb-8"
      type="number"
      label="Amount"
      name="amount"
      placeholder="Enter amount"
      :error="!!amountError"
      :help-text="amountError"
      v-model="amount"
    />
    <AppButton class="mt-auto w-full" html-type="submit" type="primary" :loading="isLoading">
      Pay
    </AppButton>
  </form>
</template>
