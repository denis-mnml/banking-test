<script setup lang="ts">
  import { computed, ComputedRef, ref } from 'vue'
  import { SelectGroupOptions, SelectOption } from '@/types'

  type ValueType = SelectOption['value']

  const props = defineProps<{
    modelValue?: ValueType
    options: (SelectOption | SelectGroupOptions)[]
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
  const isGroupOptions = computed(() => props.options[0] && 'groupTitle' in props.options[0])

  const selectedItem = computed(() => {
    if (!localValue.value) return

    if (isGroupOptions.value) {
      return props.options
                  .flatMap((item) => (item as SelectGroupOptions).options)
                  .find((item) => item.value === localValue.value)
    } else {
      return props.options.find((item) => (item as SelectOption).value === localValue.value)
    }
  }) as ComputedRef<SelectOption | undefined>

  const isEmptyOptions = computed(() => {
    if (isGroupOptions.value) {
      return props.options.flatMap((item) => (item as SelectGroupOptions).options).length === 0
    }

    return props.options.length === 0
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

  function beforeLeave(el: HTMLElement) {
    console.log('beforeLeave', el)
    el.style.height = el.offsetHeight + 'px'
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
              <template v-if="isGroupOptions">
                <ul class="drawer__list" v-for="(item, index) in options" :key="item.value">
                  <template v-if="item.options.length">
                    <li class="drawer__list-title" :class="{ 'mt-8': index !== 0 }">{{ item.groupTitle }}</li>
                    <TransitionGroup name="delete">
                      <li
                        class="drawer__list-item"
                        v-for="(_item, _index) in item.options"
                        :key="_item.value"
                        @click="select(_item.value)"
                      >
                        <slot
                          name="optionItem"
                          :item="_item"
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
              </template>
              <template v-else>
                <TransitionGroup tag="ul" class="drawer__list" name="delete" @before-leave="beforeLeave">
                  <li class="drawer__list-item" v-for="(item, index) in options" :key="item.value"
                      @click="select(item.value)">
                    <slot
                      name="optionItem"
                      :item="item"
                      :is-selected="localValue === item.value"
                      :is-first="index === 0"
                      :is-last="options.length === index + 1"
                    >
                      <div
                        class="py-4 text-gray-700 border-b border-b-gray-200"
                        :class="{ 'font-bold': localValue === item.value }"
                      >
                        {{ item.title }}
                      </div>
                    </slot>
                  </li>
                </TransitionGroup>
              </template>
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
