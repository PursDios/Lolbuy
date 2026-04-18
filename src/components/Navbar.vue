<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5" ref="navEl">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <span class="text-2xl">💸</span>
        <span class="text-xl font-black tracking-tight">
          <span class="neon-text-purple">Lol</span><span class="text-white">Buy</span>
        </span>
        <span class="tag text-[10px] hidden sm:block">™ Definitely Legit</span>
      </RouterLink>

      <!-- Nav links -->
      <div class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          active-class="text-white bg-white/5"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Cart -->
        <RouterLink to="/cart" class="relative p-2 rounded-xl hover:bg-white/5 transition-all duration-200 group">
          <span class="text-xl">🛒</span>
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style="background: linear-gradient(135deg, #a855f7, #06b6d4)"
          >{{ cartCount }}</span>
        </RouterLink>

        <!-- Account -->
        <RouterLink to="/account" class="btn-primary text-sm py-2 px-4">
          <span class="hidden sm:inline">Hey {{ userStore.firstName }}! 👋</span>
          <span class="sm:hidden">👤</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useUserStore } from '../stores/user.js'
import gsap from 'gsap'

const cartStore = useCartStore()
const userStore = useUserStore()
const navEl = ref(null)

const cartCount = computed(() => cartStore.itemCount)

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/returns', label: 'Returns' },
  { path: '/contact', label: 'Contact' },
  { path: '/account', label: 'Account' },
]

onMounted(() => {
  gsap.from(navEl.value, {
    y: -60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>
