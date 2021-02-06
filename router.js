import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'
// import { metricHit } from '../properties'

/*
  !: pages
*/
import Index from '~/pages/Index.vue'
import Registration from '~/pages/Registration.vue'
import Cart from '~/pages/Cart.vue'
import Category from '~/pages/Category.vue'
import SimplePage from '~/pages/SimplePage.vue'
import CategoryItem from '~/pages/CategoryItem.vue'
import VINRequest from '~/pages/VINRequest.vue'
import PasswordRecovery from '~/pages/PasswordRecovery.vue'
import Checkout from '~/pages/Checkout.vue'
import PersonalContent from '~/components/PersonalContent.vue'
import Personal from '~/pages/Personal.vue'
import Contact from '~/pages/Contact.vue'
import EventsItem from '~/pages/EventsItem.vue'
import EventsList from '~/pages/EventsList.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/category-*',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/public/category-*',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/tip-product-*',
    name: 'attribute',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/public/tip-product-*',
    name: 'attribute',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/brand-*',
    name: 'brand',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/public/brand-*',
    name: 'brand',
    meta: { type: 'category' },
    component: Category
  },
  {
    path: '/product-group*',
    name: 'favorite',
    meta: {
      type: 'category',
      requiresAuth: true
    },
    component: Category
  },
  {
    path: '/product*',
    component: CategoryItem,
    // beforeEnter: (to, from, next) => {
    //   if ('type' in from.meta && from.meta.type === 'category') {
    //     store.commit('setPreviousRoute', window.location.pathname)
    //   }
    //   next()
    // }
  },
  {
    path: '/public/product*',
    component: CategoryItem
  },
  // {
  //   path: '/offers',
  //   component: Offers
  // },
  // {
  //   path: '/public/offers',
  //   component: Offers
  // },
  // {
  //   path: '/search-result*',
  //   component: Search
  // },
  // {
  //   path: '/public/search-result*',
  //   component: Search
  // },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/checkout',
    name: 'checkout',
    meta: { layout: 'alter', requiresAuth: true },
    component: Checkout,
    props: true
  },
  {
    path: '/personal',
    name: 'personal',
    meta: { requiresAuth: true },
    component: Personal
  },
  {
    path: '/personal/:section',
    name: 'personal',
    meta: { requiresAuth: true },
    component: Personal,
    children: [
      {
        path: '',
        name: 'personal',
        props: true,
        component: PersonalContent
      }
    ]
  },
  {
    path: '/personal/:section/:page',
    name: 'personal',
    meta: { requiresAuth: true },
    component: Personal,
    children: [
      {
        path: '',
        name: 'personal',
        props: true,
        component: PersonalContent
      }
    ]
  },
  {
    path: '/event-*',
    component: EventsItem
  },
  {
    path: '/event*',
    component: EventsList
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/page-*',
    component: SimplePage
  },
  {
    path: '/vin-request',
    component: VINRequest
  },
  {
    path: '/password-recovery/*',
    component: PasswordRecovery
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new Router({
  mode: 'history',
  routes
})

// router.beforeEach((to, from, next) => {
  
//   if (from.matched.length) {
//     window.json_page_data = null
//   }
  
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.getters.isAuthorized) {
//       if (to.name === 'checkout') {
//         next({ name: 'cart'})
//       } else if (to.name === 'personal' || to.name === 'favorite') {
//         next({ name: 'index' })
//       }
//     } else {
//       next()
//     }
//   } else if (to.name === 'registration' && store.getters.isAuthorized) {
//     next('/')
//   } else {
//     next()
//   }

// })

// router.afterEach((to, from) => {
//   metricHit(to.fullPath)
// })

export function createRouter() {
  return router
}