<script setup lang="ts">
  import { Contact, SelectOption } from '@/types'

  const props = defineProps<{
    slotData: {
      item: SelectOption
      isSelected: boolean
      isFirst: boolean
      isLast: boolean
    }
    contact: Contact
  }>()
</script>

<template>
  <div
    class="flex justify-between py-4"
    :class="{ 'border-b border-b-gray-200': !slotData.isLast, 'pt-0': slotData.isFirst }"
  >
    <div>
      <div class="font-bold text-gray-800">{{ slotData.item.title }}</div>
      <div class="text-gray-400 text-sm">{{ contact.email }}</div>
    </div>
    <div
      :class="{ 'bg-green-600': slotData.isSelected }"
      class="flex items-center justify-center h-5 min-w-[1.25rem] basis-5 mt-1 bg-gray-200 text-white rounded-full"
    >
      <CheckIcon v-if="slotData.isSelected" size="12" />
    </div>
  </div>
</template>