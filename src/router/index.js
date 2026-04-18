import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import AccountView from '../views/AccountView.vue'
import ContactView from '../views/ContactView.vue'
import ReviewsView from '../views/ReviewsView.vue'
import ReturnsView from '../views/ReturnsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/shop', component: ShopView },
    { path: '/product/:id', component: ProductView },
    { path: '/cart', component: CartView },
    { path: '/checkout', component: CheckoutView },
    { path: '/account', component: AccountView },
    { path: '/contact', component: ContactView },
    { path: '/reviews', component: ReviewsView },
    { path: '/returns', component: ReturnsView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
