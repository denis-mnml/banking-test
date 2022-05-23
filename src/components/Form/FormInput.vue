<template>
  <div>
    <label v-if="label" class="form-label">
      {{ label }}
    </label>
    <input
      :type="type"
      class="form-input"
      :value="modelValue"
      @input="inputHandler"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    type: string
    label?: string
    modelValue?: string | number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function inputHandler(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
  }
</script>
