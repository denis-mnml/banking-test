<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Contact, SelectOption } from '@/types'
  import Dropdown from '@/components/Ui/Dropdown.vue'
  import DropdownItem from '@/components/Ui/DropdownItem.vue'
  import { ref } from 'vue'
  import { useContactsStore } from '@/stores'

  const props = defineProps<{
    slotData: {
      item: SelectOption
      isSelected: boolean
      isFirst: boolean
      isLast: boolean
    }
    contact: Contact
  }>()

  const emit = defineEmits<{
    (e: 'delete', value: number): void
  }>()

  const { storage: contactsStorage } = useContactsStore()

  function removeItem() {
    const idx = contactsStorage.findIndex((item) => item.id === props.contact.id)
    if (idx !== -1) {
      contactsStorage.splice(idx, 1)
      emit('delete', props.contact.id)
    }
  }

  const router = useRouter()
  const to = ref({
    name: 'EditContact',
    params: {
      id: props.contact.id
    }
  })
</script>

<template>
  <div
    class="flex py-4"
    :class="{ 'border-b border-b-gray-200': !slotData.isLast, 'pt-0': slotData.isFirst }"
  >
    <div
      :class="slotData.isSelected ? 'bg-green-600' : 'bg-gray-200'"
      class="flex items-center justify-center h-5 min-w-[1.25rem] basis-5 mt-1 mr-3 text-white rounded-full"
    >
      <CheckIcon v-if="slotData.isSelected" size="12" />
    </div>
    <div>
      <div class="font-bold text-gray-800">{{ slotData.item.title }}</div>
      <div class="text-gray-400 text-sm">{{ contact.email }}</div>
    </div>
    <Dropdown class="mt-1 ml-auto">
      <template #trigger>
        <DotsVerticalIcon size="20" class="text-gray-400" />
      </template>
      <template #menu>
        <DropdownItem :to="to">Edit</DropdownItem>
        <DropdownItem @click="removeItem">Delete</DropdownItem>
      </template>
    </Dropdown>
  </div>
</template>