import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export type RouteNames = 'Home' | 'Contacts' | 'PaymentMethods' | 'Thanks'

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: {
      transition: 'page-slide-left',
      title: 'Make payment',
    },
  },
  {
    name: 'Contacts',
    path: '/contacts',
    component: () => import('@/views/Contacts.vue'),
    meta: {
      transition: 'page-slide-right',
      title: 'Add new contact',
    },
  },
  {
    name: 'EditContact',
    path: '/contacts/:id',
    component: () => import('@/views/Contacts.vue'),
    meta: {
      transition: 'page-slide-right',
      title: 'Edit contact',
    },
  },
  {
    name: 'PaymentMethods',
    path: '/payment-methods',
    component: () => import('@/views/PaymentMethods.vue'),
    meta: {
      transition: 'page-slide-right',
      title: 'Add payment method',
    },
  },
  {
    name: 'EditPaymentMethod',
    path: '/payment-methods/:id',
    component: () => import('@/views/PaymentMethods.vue'),
    meta: {
      transition: 'page-slide-right',
      title: 'Edit payment method',
    },
  },
  {
    name: 'Thanks',
    path: '/thanks',
    component: () => import('@/views/Thanks.vue'),
    meta: {
      transition: 'page-slide-bottom',
      title: 'Success',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  if (to.name === 'Home' && from.name === 'Thanks') {
    to.meta.transition = 'page-slide-top'
  }

  if (to.name === 'Thanks' && !to.query.order) {
    return { name: 'Home' }
  }

  return true
})

export default router
