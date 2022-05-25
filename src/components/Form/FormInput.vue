<script setup lang="ts">
  defineProps<{
    type?: string
    label?: string
    name: string
    placeholder?: string
    modelValue?: string | number
    error?: boolean
    helpText?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function inputHandler(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
  }
</script>

<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <input
      :type="type || 'text'"
      class="form-input"
      :class="{ 'form-input_error': error }"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      @input="inputHandler"
    />
    <div v-if="helpText" class="form-input__help-text" :class="{ 'form-input__help-text_error': error }">
      {{ helpText }}
    </div>
  </div>
</template>
