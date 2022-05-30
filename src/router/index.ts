import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: {
      transition: 'open-home-page',
      title: 'Make payment',
    },
  },
  {
    name: 'Contacts',
    path: '/contacts',
    component: () => import('@/views/Contacts.vue'),
    meta: {
      transition: 'open-secondary-page',
      title: 'Add new contact',
    },
  },
  {
    name: 'EditContact',
    path: '/contacts/:id',
    component: () => import('@/views/Contacts.vue'),
    meta: {
      transition: 'open-secondary-page',
      title: 'Edit contact',
    },
  },
  {
    name: 'PaymentMethods',
    path: '/payment-methods',
    component: () => import('@/views/PaymentMethods.vue'),
    meta: {
      transition: 'open-secondary-page',
      title: 'Add payment method',
    },
  },
  {
    name: 'EditPaymentMethod',
    path: '/payment-methods/:id',
    component: () => import('@/views/PaymentMethods.vue'),
    meta: {
      transition: 'open-secondary-page',
      title: 'Edit payment method',
    },
  },
  // {
  //   path: '*',
  //   redirect: '/',
  // },
]

export type RouteNames = 'Home' | 'Contacts' | 'PaymentMethods'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
