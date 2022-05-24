<script setup lang="ts">
  defineProps<{
    type: string
    label?: string
    placeholder?: string
    modelValue?: string | number
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
    <label v-if="label" class="form-label">
      {{ label }}
    </label>
    <input
      :type="type"
      class="form-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="inputHandler"
    />
  </div>
</template>

