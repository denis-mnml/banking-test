<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SelectGroupOptions, SelectOption } from '@/types'

  const props = defineProps<{
    modelValue?: string | number
    options: (SelectOption | SelectGroupOptions)[]
    placeholder: string
    label?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: SelectOption['value']): void
  }>()

  const isShow = ref(false)

  const selectedItem = computed(() => {
    if (!props.modelValue) return

    if ('groupTitle' in props.options[0]) {
      return props.options
                  .flatMap((item) => (item as SelectGroupOptions).options)
                  .find((item) => item.value === props.modelValue)
    } else {
      return props.options.find((item) => (item as SelectOption).value === props.modelValue)
    }
  })

  function open() {
    document.body.classList.add('overflow-hidden')
    isShow.value = true
  }

  function close() {
    document.body.classList.remove('overflow-hidden')
    isShow.value = false
  }

  function select(value: SelectOption['value']) {
    emit('update:modelValue', value)
    close()
  }
</script>

<template>
  <div>
    <div v-if="label" class="flex items-center justify-between mb-2">
      <label class="form-label !mb-0">{{ label }}</label>
      <slot name="action" />
    </div>
    <div
      class="flex items-center justify-between h-14 px-4 w-full bg-white rounded-lg shadow-[0_0_8px_0_rgba(0,0,0,0.1)]"
      @click="open"
    >
      <div class="overflow-hidden pr-2">
        <slot v-if="selectedItem" name="selectedView" :item="selectedItem">
          <div class="text-gray-600 text-[15px] font-semibold">
            {{ selectedItem.title }}
          </div>
        </slot>
        <div class="text-gray-400 font-medium text-[15px]" v-else>
          {{ placeholder }}
        </div>
      </div>
      <div class="text-gray-300">
        <ChevronRightIcon size="16" />
      </div>
    </div>
    <transition name="fade">
      <div class="fixed inset-0" v-if="isShow">
        <div class="absolute inset-0 bg-gray-900/40" @click="close"></div>
        <div
          class="drawer absolute bottom-0 inset-x-0 max-h-[85vh] px-5 pb-6 pt-8 rounded-t-2xl shadow-[0 -4px 6px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.1)] bg-white"
        >
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-[5px] bg-gray-200 rounded"></div>
          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm tracking-wider text-blue-800 uppercase font-bold mr-4">
                {{ label }}
              </h3>
              <XIcon size="20" class="-my-1 text-gray-400" @click="close" />
            </div>
            <div class="overflow-y-auto max-h-[calc(90vh-4.5rem)] -mx-5 px-5 pb-5 no-scrollbar">
              <div v-for="(item, index) in options" :key="item.value">
                <template v-if="item.groupTitle">
                  <div
                    class="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2"
                    :class="{ 'mt-8': index !== 0 }"
                  >
                    {{ item.groupTitle }}
                  </div>
                  <div v-for="(_item, _index) in item.options" :key="_item.value" @click="select(_item.value)">
                    <slot
                      name="optionItem"
                      :item="_item"
                      :is-selected="modelValue === _item.value"
                      :is-first="_index === 0"
                      :is-last="options.length === _index + 1"
                    >
                      <div
                        :class="{ 'font-bold': modelValue === _item.value }"
                        class="py-4 text-gray-700 border-b border-b-gray-200"
                      >
                        {{ _item.title }}
                      </div>
                    </slot>
                  </div>
                </template>
                <template v-else>
                  <div @click="select(item.value)">
                    <slot
                      name="optionItem"
                      :item="item"
                      :is-selected="modelValue === item.value"
                      :is-first="index === 0"
                      :is-last="options.length === index + 1"
                    >
                      <div
                        :class="{ 'font-bold': modelValue === item.value }"
                        class="py-4 text-gray-700 border-b border-b-gray-200"
                      >
                        {{ item.title }}
                      </div>
                    </slot>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;

    .drawer {
      transition: transform 0.2s ease;
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;

    .drawer {
      transform: translateY(20px);
    }
  }
</style>
