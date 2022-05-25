<script setup lang="ts">
  import PageHeader from '@/components/Common/PageHeader.vue'
  import ContactsForm from '@/components/Contacts/ContactsForm.vue'
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const contactsForm = ref()

  function resetForm() {
    contactsForm.value.resetForm()
  }
</script>

<template>
  <PageHeader back-to="/" @back="resetForm" :title="route.meta.title" />
  <ContactsForm ref="contactsForm" />
</template>