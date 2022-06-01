<script setup lang="ts">
  import StringMask from 'string-mask'
  import { computed } from 'vue'

  const maskTypes = {
    expiry: '00/00',
    card: '0000 0000 0000 0000',
    bsb: '000-000',
  }

  const removeFromMask = {
    expiry: '/',
    card: ' ',
    bsb: '-',
  }

  const props = defineProps<{
    type?: 'email' | 'hidden' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url'
    inputmode?: 'search' | 'text' | 'email' | 'none' | 'tel' | 'url' | 'numeric' | 'decimal'
    label?: string
    name: string
    placeholder?: string
    modelValue?: string | number
    value?: any
    error?: boolean
    helpText?: string
    mask?: keyof typeof maskTypes
    maxlength?: number
  }>()

  const localValue = computed(() => maskValue(props.value || props.modelValue))

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'input', value: string): void
  }>()

  function maskValue(value: string) {
    if (value && props.mask) {
      value = value.slice(0, maskTypes[props.mask].length).replaceAll(removeFromMask[props.mask], '')
      value = StringMask.apply(value, maskTypes[props.mask])
    }

    return value
  }

  function inputHandler(event: Event) {
    const value = (event.target as HTMLInputElement).value
    emit('update:modelValue', value)
    emit('input', value)
  }
</script>

<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <input
      :type="type || 'text'"
      :inputmode="inputmode"
      class="form-input"
      :class="{ 'form-input_error': error }"
      :name="name"
      :value="localValue"
      :maxlength="maxlength || (mask && maskTypes[mask].length)"
      :placeholder="placeholder"
      @input="inputHandler"
    />
    <div v-if="helpText" class="form-input__help-text" :class="{ 'form-input__help-text_error': error }">
      {{ helpText }}
    </div>
  </div>
</template>
