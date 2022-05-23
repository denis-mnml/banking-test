<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { getProtectedCardNumber } from '@/utils'
  import { BankAccount, Card, Contact, SelectGroupOptions, SelectOption } from '@/types'
  import FormInput from '@/components/Form/FormInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import AppSelect from '@/components/Ui/AppSelect.vue'
  import PaymentMethodListItem from '@/components/PaymentMethod/PaymentMethodListItem.vue'
  import ContactsListItem from '@/components/Contacts/ContactsListItem.vue'

  const isLoading = ref(false)
  const form = ref({
    amount: '',
    recipient: null,
    method: null
  })

  const contacts: Contact[] = [
    {
      id: 1,
      firstName: 'Denis123123123sdfsdfsdf',
      lastName: 'Seredasdfjdysdfsdtsdfjkljkl',
      email: 'denis@gmail.com'
    },
    {
      id: 2,
      firstName: 'Victoria',
      lastName: 'Sereda',
      email: 'vika@gmail.com'
    }
  ]
  const cards: Card[] = [
    {
      id: 1,
      fullName: 'Master Card',
      cardNumber: 5101123412349802,
      expiryDate: '10/24'
    },
    {
      id: 2,
      fullName: 'Visa',
      cardNumber: 4400123412344528,
      expiryDate: '08/23'
    },
    {
      id: 3,
      fullName: 'Wife\'s card',
      cardNumber: 5121080056458912,
      expiryDate: '04/25'
    }
  ]
  const bankingAccounts: BankAccount[] = [
    {
      id: 11,
      accountName: 'Bank 1',
      accountNumber: 1234325432,
      bsb: '222-444'
    },
    {
      id: 12,
      accountName: 'Bank 2',
      accountNumber: 9876543243,
      bsb: '222-444'
    }
  ]

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
      options: bankingAccounts.map((item) => ({
        title: item.accountName,
        value: item.id
      }))
    }
  ]

  function removeItem(type: string, id: SelectOption['value']) {
    console.log('Remove Item')
  }

  function getItemById<T extends { id: number }>(items: T[], id: number) {
    return items.find((item) => item.id === id)
  }

  function getContactEmail(value: number) {
    const item = getItemById<Contact>(contacts, value) as Contact
    return item?.email || ''
  }

  function getCardNumber(value: number) {
    const item = getItemById<Card | BankAccount>([...cards, ...bankingAccounts], value) as Card
    return item ? getProtectedCardNumber(item) : ''
  }
</script>

<template>
  <h1 class="text-base tracking-wider text-gray-600 font-bold uppercase text-center mb-5">Make payment</h1>
  <AppSelect
    class="mb-6"
    :options="contactOptions"
    label="Recipient"
    placeholder="Select contact"
    v-model="form.recipient"
  >
    <template #action>
      <router-link :to="{ name: 'Contacts' }" class="text-sm font-semibold text-blue-600"> + Add</router-link>
    </template>
    <template v-slot:selectedView="{ item }">
      <div class="max-w-full overflow-hidden">
        <div class="font-bold text-gray-900 text-[15px] truncate">
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
  </AppSelect>
  <AppSelect
    class="mb-6"
    :options="paymentOptions"
    label="Payment Method"
    placeholder="Select method"
    v-model="form.method"
  >
    <template #action>
      <router-link :to="{ name: 'PaymentMethods' }" class="text-sm font-semibold text-blue-600"> + Add</router-link>
    </template>
    <template v-slot:selectedView="{ item }">
      <div class="font-bold text-gray-900 text-[15px]">{{ item.title }}</div>
      <div class="text-gray-400 text-xs">{{ getCardNumber(item.value) }}</div>
    </template>
    <template v-slot:optionItem="data">
      <PaymentMethodListItem
        class="mb-4"
        :slot-data="data"
        :card="getItemById([...cards, ...bankingAccounts], data.item.value)"
        @remove="removeItem('card', data.item.value)"
      />
    </template>
  </AppSelect>
  <FormInput type="number" label="Enter amount" v-model="form.amount" />
  <AppButton class="mt-auto w-full" type="primary" :disabled="!form.amount" :loading="isLoading"> Pay</AppButton>
</template>
