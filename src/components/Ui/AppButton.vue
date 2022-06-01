<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    test?: string
    htmlType?: 'button' | 'submit' | 'reset' | undefined
    type?: string
    loading?: boolean
    disabled?: boolean
  }>()

  const btnType = computed(() => (props.type ? `btn_${props.type}` : ''))
</script>

<template>
  <button :type="htmlType || 'button'" class="btn" :class="btnType" :disabled="disabled || loading">
    <span v-if="loading" class="btn__loader"></span>
    <span v-else class="btn__content"><slot /></span>
  </button>
</template>
