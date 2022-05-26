<script setup lang="ts">
  import { ref } from 'vue'

  const isShow = ref(false)

  function open() {
    document.body.classList.add('overflow-hidden')
    isShow.value = true
  }

  function close() {
    document.body.classList.remove('overflow-hidden')
    isShow.value = false
  }
</script>

<template>
  <div class="dropdown">
    <div v-if="isShow" class="dropdown__backdrop" @click.stop="close"></div>
    <div class="dropdown__content">
      <div class="dropdown__trigger" @click.stop="open">
        <slot name="trigger"></slot>
      </div>
      <transition name="roll">
        <div v-if="isShow" class="dropdown__menu" @click.stop="close">
          <slot name="menu"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>