<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'
  import AppInput from '@/components/Ui/AppInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import { BankAccount, Card } from '@/types'
  import { useBankAccountsStore } from '@/stores'

  type BankAccountFormValues = Omit<BankAccount, 'id'>

  const router = useRouter()
  const route = useRoute()

  const { storage: formDraft, destroyStorage: destroyFormDraft } =
    useLocalStorage<Partial<BankAccountFormValues>>('bankAccountFormDraft')
  const { storage: bankAccountStore } = useBankAccountsStore()

  const accountToEdit = computed(() => {
    if ('id' in route.params) {
      return bankAccountStore.find((item) => item.id === parseInt(route.params.id as string)) || {}
    }
    return {}
  })

  const isEdit = computed(() => Object.keys(accountToEdit.value).length !== 0)

  const { handleSubmit, handleReset } = useForm({
    initialValues: {
      ...formDraft,
      ...accountToEdit.value,
    },
    validationSchema: yup.object({
      accountName: yup.string().required().max(30).label('Account name'),
      accountNumber: yup
        .number()
        .required()
        .label('Account number')
        .test(
          'test-number',
          'Account number must contain 10 digits',
          (value) => (value && value.toString().length === 10) as boolean
        ),
      bsb: yup.string().required().label('BSB'),
    }),
  })

  const { value: accountName, errorMessage: accountNameError } = useField<string | undefined>('accountName')
  const { value: accountNumber, errorMessage: accountNumberError } = useField<string | undefined>('accountNumber')
  const { value: bsb, errorMessage: bsbError } = useField<string | undefined>('bsb')

  const onSubmit = handleSubmit((values) => {
    if (isEdit.value) {
      const account = accountToEdit.value as BankAccount
      const idx = bankAccountStore.findIndex((item) => item.id === account.id)

      if (idx !== -1) {
        bankAccountStore[idx] = {
          ...account,
          ...values,
        }
      }
    } else {
      bankAccountStore.push({
        id: Date.now(),
        ...(values as BankAccountFormValues),
      })
    }

    router.push('/')
    destroyFormDraft()
  })

  const onInput = (e: Event) => {
    if (!isEdit.value) {
      const name = (e.target as HTMLInputElement).name as keyof BankAccountFormValues
      const value = (e.target as HTMLInputElement).value

      if (name === 'accountNumber') {
        formDraft[name] = Number(value)
      } else {
        formDraft[name] = value
      }
    }
  }

  function resetForm() {
    destroyFormDraft()
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
      label="Account Name"
      name="accountName"
      placeholder="Enter account name"
      :error="!!accountNameError"
      :help-text="accountNameError"
      v-model="accountName"
    />
    <AppInput
      class="mb-6"
      label="Account Number"
      name="accountNumber"
      inputmode="numeric"
      placeholder="Enter account number"
      :maxlength="10"
      :error="!!accountNumberError"
      :help-text="accountNumberError"
      v-model="accountNumber"
    />
    <AppInput
      class="mb-6"
      label="BSB"
      name="bsb"
      inputmode="numeric"
      mask="bsb"
      placeholder="Enter BSB"
      :error="!!bsbError"
      :help-text="bsbError"
      v-model="bsb"
    />
    <AppButton html-type="submit" type="success" class="mt-auto">Save</AppButton>
  </form>
</template>
