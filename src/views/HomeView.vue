<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <!-- Hero content -->
      <div class="max-w-6xl mx-auto text-center relative z-10" ref="heroEl">
        <!-- Sale banner -->
        <div class="inline-flex items-center gap-3 glass rounded-full px-4 py-2 mb-8 text-sm">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span class="text-gray-300">MEGA SALE ENDS IN</span>
          <span class="font-mono font-bold neon-text-cyan">{{ countdown }}</span>
          <span class="tag text-[10px]">REAL TIMER</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-black leading-none mb-6">
          <span class="text-white">The Future of</span><br>
          <span class="neon-text-purple">PC Building</span><br>
          <span class="text-gray-500 text-4xl md:text-6xl">is Probably Here™</span>
        </h1>

        <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
          Top-tier computer parts, RAM, and components. Delivered to your door by someone named Gerald.
          Prices are made up but the RGB is very real.
        </p>

        <p class="text-sm text-gray-600 mb-10">
          Welcome back, <span class="text-neon-purple font-semibold">{{ userStore.firstName }}</span>! We've missed you. (We don't actually track whether you've been here before. We just say this to everyone.)
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/shop" class="btn-primary text-lg py-4 px-8">
            Shop Now →
          </RouterLink>
          <RouterLink to="/account" class="btn-secondary text-lg py-4 px-8">
            View Account (You're {{ userStore.firstName }})
          </RouterLink>
        </div>

        <!-- Trust badges (very trustworthy) -->
        <div class="flex flex-wrap justify-center gap-4 mt-12 text-xs text-gray-600">
          <span class="flex items-center gap-1">✅ SSL Encrypted (probably)</span>
          <span class="flex items-center gap-1">✅ 30-day returns (terms apply*)</span>
          <span class="flex items-center gap-1">✅ Award-Winning™</span>
          <span class="flex items-center gap-1">✅ Trusted by {{ trustCount.toLocaleString() }} customers</span>
        </div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-1/4 left-10 text-6xl opacity-20 animate-float" style="animation-delay: 0s">🖥️</div>
      <div class="absolute top-1/3 right-16 text-5xl opacity-15 animate-float" style="animation-delay: 2s">⚡</div>
      <div class="absolute bottom-1/3 left-20 text-4xl opacity-20 animate-float" style="animation-delay: 4s">🧠</div>
      <div class="absolute bottom-1/4 right-24 text-5xl opacity-15 animate-float" style="animation-delay: 1s">💾</div>
    </section>

    <!-- Stats bar -->
    <section class="border-y border-white/5 py-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-3xl font-black neon-text-purple mb-1">{{ stat.value }}</div>
            <div class="text-xs text-gray-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="tag mb-3 inline-block">FEATURED</p>
            <h2 class="text-4xl font-black text-white">Hot Right Now</h2>
            <p class="text-gray-500 mt-2 text-sm">These are definitely the most popular. We checked. Sort of.</p>
          </div>
          <RouterLink to="/shop" class="btn-secondary text-sm hidden md:block">View All →</RouterLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref="productsGrid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="text-center mt-8">
          <RouterLink to="/shop" class="btn-primary">
            See All {{ totalProducts }} Products →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Dark Pattern Feature Banner: Newsletter -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto glass-purple rounded-3xl p-10 text-center">
        <h3 class="text-3xl font-black text-white mb-3">Get Exclusive Deals!</h3>
        <p class="text-gray-400 text-sm mb-6">
          Sign up for our newsletter. You can unsubscribe at any time.*
          <br>
          <span class="text-[11px] text-gray-700">*"any time" = 15 business days after 3 written notices notarized in the state of Delaware</span>
        </p>
        <div class="flex gap-3 max-w-md mx-auto">
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="input-dark flex-1"
            @focus="emailFocused = true"
          />
          <button @click="subscribeEmail" class="btn-primary whitespace-nowrap">
            {{ subscribed ? '✓ Subscribed!' : 'Sign Me Up' }}
          </button>
        </div>
        <p v-if="subscribed" class="text-xs text-gray-500 mt-3">
          Great! We've also signed up your secondary email, your mom's email, and your work email. Hope that's fine 😊
        </p>
        <p v-if="emailFocused && !subscribed" class="text-xs text-gray-700 mt-3">
          By typing in this field you have already agreed to receive weekly emails, monthly catalogues, and occasional faxes.
        </p>
      </div>
    </section>

    <!-- Why LolBuy -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-black text-center text-white mb-16">Why Choose LolBuy?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="reason in whyUs" :key="reason.title" class="glass rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
            <div class="text-4xl mb-4">{{ reason.icon }}</div>
            <h3 class="font-bold text-white text-lg mb-2">{{ reason.title }}</h3>
            <p class="text-gray-500 text-sm">{{ reason.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'
import gsap from 'gsap'

const userStore = useUserStore()
const heroEl = ref(null)
const productsGrid = ref(null)

const email = ref('')
const emailFocused = ref(false)
const subscribed = ref(false)
const trustCount = ref(Math.floor(Math.random() * 50000) + 150000)

const featuredProducts = computed(() => products.slice(0, 6))
const totalProducts = computed(() => products.length)

// Countdown timer that resets
const countdownSeconds = ref(9 * 60 + 59)
let countdownTimer = null
const countdown = computed(() => {
  const m = Math.floor(countdownSeconds.value / 60).toString().padStart(2, '0')
  const s = (countdownSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const stats = [
  { value: '2.4M+', label: 'Happy Customers (Estimated)' },
  { value: '99.9%', label: 'Uptime (This Week)' },
  { value: '47ms', label: 'Average Shipping Time*' },
  { value: '$0', label: 'Hidden Fees (That We Tell You About)' },
]

const whyUs = [
  {
    icon: '🔒',
    title: 'Totally Secure',
    description: 'We use 256-bit encryption on some of our pages. The checkout page uses SHA-1 but we\'re "looking into it."',
  },
  {
    icon: '🚀',
    title: 'Lightning Fast Shipping',
    description: 'Most orders ship within 3-5 business weeks. Express shipping means Gerald will jog.',
  },
  {
    icon: '💯',
    title: 'Best Prices',
    description: 'We guarantee the lowest prices or we\'ll match them! (Competitor must be on the moon. Moon prices only.)',
  },
]

function subscribeEmail() {
  if (email.value) {
    subscribed.value = true
  }
}

onMounted(() => {
  // Hero entrance animation
  gsap.from(heroEl.value.children, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.2,
  })

  // Countdown that resets
  countdownTimer = setInterval(() => {
    countdownSeconds.value--
    if (countdownSeconds.value <= 0) {
      countdownSeconds.value = 10 * 60 // reset to 10 minutes
    }
  }, 1000)

  // Animate trust count up
  const target = trustCount.value
  trustCount.value = 0
  gsap.to(trustCount, {
    value: target,
    duration: 2,
    delay: 0.5,
    ease: 'power2.out',
    onUpdate: () => { trustCount.value = Math.floor(trustCount.value) },
  })
})

onUnmounted(() => {
  clearInterval(countdownTimer)
})
</script>
