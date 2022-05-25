<script setup lang="ts">
  import { Contact, SelectOption } from '@/types'
  import { useRouter } from 'vue-router'

  const props = defineProps<{
    slotData: {
      item: SelectOption
      isSelected: boolean
      isFirst: boolean
      isLast: boolean
    }
    contact: Contact
  }>()

  const router = useRouter()

  function editContact() {
    router.push({
      name: 'EditContact',
      params: {
        id: props.contact.id
      }
    })
  }
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
    <DotsVerticalIcon size="20" class="mt-1 ml-auto text-gray-400" @click.stop="editContact" />
  </div>
</template>