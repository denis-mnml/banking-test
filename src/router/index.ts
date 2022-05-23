import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { name: 'Home', path: '/', component: () => import('@/views/Home.vue') },
  { name: 'Contacts', path: '/contacts', component: () => import('@/views/Contacts.vue') },
  { name: 'PaymentMethods', path: '/payment-methods', component: () => import('@/views/PaymentMethods.vue') }
  // {
  //   path: '*',
  //   redirect: '/',
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
