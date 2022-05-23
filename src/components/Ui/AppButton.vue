<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    test?: string
    htmlType?: string
    type?: string
    loading?: boolean
    disabled?: boolean
  }>()

  const btnType = computed(() => props.type ? `btn_${props.type}` : '')

</script>

<template>
  <button
    :type="htmlType || 'button'"
    class="btn"
    :class="btnType"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn__loader"></span>
    <span class="btn__content"><slot /></span>
  </button>
</template>