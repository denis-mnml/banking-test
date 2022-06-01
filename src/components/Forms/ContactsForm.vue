<script setup lang="ts">
  import useLocalStorage from '@/hooks/useLocalStorage'
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'
  import AppInput from '@/components/Ui/AppInput.vue'
  import AppButton from '@/components/Ui/AppButton.vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Contact } from '@/types'
  import { useContactsStore } from '@/stores'
  import { computed } from 'vue'

  type ContactFormValues = Omit<Contact, 'id'>

  const router = useRouter()
  const route = useRoute()

  const { storage: contactFormDraft, destroyStorage: destroyContactFormDraft } =
    useLocalStorage<Partial<ContactFormValues>>('contactFormDraft')
  const { storage: contactsStore } = useContactsStore()

  const contactToEdit = computed(() => {
    if ('id' in route.params) {
      return contactsStore.find((item) => item.id === parseInt(route.params.id as string)) || {}
    }
    return {}
  })
  const isEdit = computed(() => Object.keys(contactToEdit.value).length !== 0)

  const { handleSubmit, handleReset } = useForm({
    initialValues: {
      ...contactFormDraft,
      ...contactToEdit.value,
    },
    validationSchema: yup.object({
      firstName: yup.string().required().max(30).label('First name'),
      lastName: yup.string().required().max(30).label('Last name'),
      email: yup.string().required().email().label('Email'),
    }),
  })

  const { value: firstName, errorMessage: firstNameError } = useField<string | undefined>('firstName')
  const { value: lastName, errorMessage: lastNameError } = useField<string | undefined>('lastName')
  const { value: email, errorMessage: emailError } = useField<string | undefined>('email')

  const onSubmit = handleSubmit((values) => {
    if (isEdit.value) {
      const contact = contactToEdit.value as Contact
      const idx = contactsStore.findIndex((item) => item.id === contact.id)

      if (idx !== -1) {
        contactsStore[idx] = {
          ...contact,
          ...values,
        }
      }
    } else {
      contactsStore.push({
        id: Date.now(),
        ...(values as ContactFormValues),
      })
    }

    router.push('/')
    destroyContactFormDraft()
  })

  const onInput = (e: Event) => {
    if (!isEdit.value) {
      const name = (e.target as HTMLInputElement).name as keyof ContactFormValues
      contactFormDraft[name] = (e.target as HTMLInputElement).value
    }
  }

  function resetForm() {
    destroyContactFormDraft()
    handleReset()
  }

  defineExpose({
    resetForm,
  })
</script>

<template>
  <form class="flex flex-col grow" @submit.prevent="onSubmit" @input="onInput">
    <AppInput
      class="mb-6"
      label="First Name"
      name="firstName"
      placeholder="Enter first name"
      :error="!!firstNameError"
      :help-text="firstNameError"
      v-model="firstName"
    />
    <AppInput
      class="mb-6"
      label="Last Name"
      name="lastName"
      placeholder="Enter last name"
      :error="!!lastNameError"
      :help-text="lastNameError"
      v-model="lastName"
    />
    <AppInput
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
