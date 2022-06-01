<script setup lang="ts">
  import { computed, ComputedRef, ref } from 'vue'
  import { SelectGroupOption, SelectOption } from '@/types'

  type ValueType = SelectOption['value']

  const props = defineProps<{
    modelValue?: ValueType
    options: SelectOption[] | SelectGroupOption[]
    placeholder: string
    label?: string
    error?: boolean
    helpText?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ValueType): void
    (e: 'change', value: ValueType): void
  }>()

  const localValue = ref(props.modelValue)
  const isShow = ref(false)
  const optionsList = computed(() => {
    if (!(props.options[0] && 'groupTitle' in props.options[0])) {
      return [
        {
          groupTitle: '',
          options: props.options,
        } as SelectGroupOption,
      ]
    }

    return props.options as SelectGroupOption[]
  })

  const selectedItem = computed(() => {
    if (!localValue.value) return

    return optionsList.value.flatMap((item) => item.options).find((item) => item.value === localValue.value)
  })

  const isEmptyOptions = computed(() => {
    return optionsList.value.flatMap((item) => item.options).length === 0
  })

  function open() {
    document.body.classList.add('overflow-hidden')
    isShow.value = true
  }

  function close() {
    document.body.classList.remove('overflow-hidden')
    isShow.value = false
  }

  function select(value: ValueType) {
    localValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
    close()
  }

  function beforeLeave(el: Element) {
    ;(el as HTMLElement).style.height = (el as HTMLElement).offsetHeight + 'px'
  }
</script>

<template>
  <div class="select">
    <div v-if="label" class="select__header">
      <label class="form-label select__label">{{ label }}</label>
      <slot name="action" />
    </div>
    <div class="select__input" @click="open">
      <div class="overflow-hidden pr-2">
        <slot v-if="selectedItem" name="selectedView" :item="selectedItem">
          <div class="select__input-text">{{ selectedItem.title }}</div>
        </slot>
        <div class="select__placeholder" v-else>{{ placeholder }}</div>
      </div>
      <ChevronRightIcon class="text-gray-300 ml-auto" size="16" />
    </div>
    <div v-if="helpText" class="select__help-text" :class="{ 'select__help-text_error': error }">
      {{ helpText }}
    </div>
    <Transition name="drawer-fade">
      <div class="fixed inset-0" v-if="isShow">
        <div class="absolute inset-0 bg-gray-900/40" @click="close"></div>
        <div class="select__drawer drawer">
          <div class="drawer__top-line"></div>
          <div class="flex flex-col">
            <div class="drawer__header">
              <h3 class="drawer__heading mr-4">{{ label }}</h3>
              <XIcon size="20" class="-my-1 text-gray-400" @click="close" />
            </div>
            <div class="drawer__content no-scrollbar">
              <ul class="drawer__list" v-for="(item, index) in optionsList" :key="item.groupTitle">
                <template v-if="item.options.length">
                  <li v-if="item.groupTitle" class="drawer__list-title" :class="{ 'mt-8': index !== 0 }">
                    {{ item.groupTitle }}
                  </li>
                  <TransitionGroup name="delete" @before-leave="beforeLeave">
                    <li
                      class="drawer__list-item"
                      v-for="(_item, _index) in item.options"
                      :key="_item.value"
                      @click="select(_item.value)"
                    >
                      <slot
                        name="optionItem"
                        :item="_item"
                        :group="item.groupTitle"
                        :is-selected="localValue === _item.value"
                        :is-first="_index === 0"
                        :is-last="options.length === _index + 1"
                      >
                        <div
                          class="py-4 text-gray-700 border-b border-b-gray-200"
                          :class="{ 'font-bold': localValue === _item.value }"
                        >
                          {{ _item.title }}
                        </div>
                      </slot>
                    </li>
                  </TransitionGroup>
                </template>
              </ul>
              <Transition name="fade">
                <slot v-if="isEmptyOptions" name="empty">
                  <div class="pt-6 mb-4 text-gray-400 text-center">No items</div>
                </slot>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
