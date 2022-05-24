import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Home',
    path: '/',
    meta: { transition: 'open-home-page' },
    component: () => import('@/views/Home.vue'),
  },
  {
    name: 'Contacts',
    path: '/contacts',
    meta: { transition: 'open-secondary-page' },
    component: () => import('@/views/Contacts.vue'),
  },
  {
    name: 'PaymentMethods',
    path: '/payment-methods',
    meta: { transition: 'open-secondary-page' },
    component: () => import('@/views/PaymentMethods.vue'),
  },
  // {
  //   path: '*',
  //   redirect: '/',
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
