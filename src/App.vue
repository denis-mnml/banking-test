<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <div class="page-container" :key="route.name">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>