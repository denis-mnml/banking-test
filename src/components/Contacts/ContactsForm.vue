<script setup lang="ts">
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'
  import FormInput from '@/components/Form/FormInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Contact } from '@/types'

  type ContactFormValues = {
    firstName: string
    lastName: string
    email: string
  }

  const router = useRouter()
  const route = useRoute()

  const {
    storage: contactFormDraft,
    destroyStorage: destroyContactFormDraft
  } = useLocalStorage<Partial<ContactFormValues>>('contactFormDraft')
  const { storage: contactsStorage } = useLocalStorage<Contact[]>('contacts', [])

  const contactToEdit = (() => {
    if ('id' in route.params) {
      return contactsStorage.find((item) => item.id === parseInt(route.params.id as string)) || {}
    }
    return {}
  })()

  const isEdit = Object.keys(contactToEdit).length !== 0

  const { handleSubmit, handleReset } = useForm({
    initialValues: {
      ...contactFormDraft,
      ...contactToEdit
    },
    validationSchema: yup.object({
      firstName: yup.string().required().max(30).label('First name'),
      lastName: yup.string().required().max(30).label('Last name'),
      email: yup.string().required().email().label('Email')
    })
  })

  const { value: firstName, errorMessage: firstNameError } = useField('firstName')
  const { value: lastName, errorMessage: lastNameError } = useField('lastName')
  const { value: email, errorMessage: emailError } = useField('email')

  const onSubmit = handleSubmit((values) => {
    if (isEdit) {
      const contact = contactToEdit as Contact
      const idx = contactsStorage.findIndex(item => item.id === contact.id)

      if (idx !== -1) {
        contactsStorage[idx] = {
          ...contact,
          ...values
        }
      }
    } else {
      contactsStorage.push({
        id: Date.now(),
        ...values as ContactFormValues
      })
    }

    router.push('/')
    destroyContactFormDraft()
  })

  const onInput = (e: InputEvent) => {
    if (!isEdit) {
      const name = (e.target as HTMLInputElement).name as keyof ContactFormValues
      contactFormDraft[name] = (e.target as HTMLInputElement).value
    }
  }

  function resetForm() {
    destroyContactFormDraft()
    handleReset()
  }

  defineExpose({
    resetForm
  })
</script>

<template>
  <form class="flex flex-col grow" @submit.prevent="onSubmit" @input="onInput">
    <FormInput
      class="mb-6"
      label="First Name"
      name="firstName"
      placeholder="Enter first name"
      :error="!!firstNameError"
      :help-text="firstNameError"
      v-model="firstName"
    />
    <FormInput
      class="mb-6"
      label="Last Name"
      name="lastName"
      placeholder="Enter last name"
      :error="!!lastNameError"
      :help-text="lastNameError"
      v-model="lastName"
    />
    <FormInput
      type="email"
      class="mb-6"
      label="Email"
      name="email"
      placeholder="Enter email"
      :error="!!emailError"
      :help-text="emailError"
      v-model="email"
    />
    <AppButton html-type="submit" type="success" class="mt-auto">Save</AppButton>
  </form>
</template>
