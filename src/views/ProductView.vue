<template>
  <div v-if="product" class="max-w-6xl mx-auto px-6 py-12">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-600 mb-8 flex items-center gap-2">
      <RouterLink to="/" class="hover:text-gray-400 transition-colors">Home</RouterLink>
      <span>/</span>
      <RouterLink to="/shop" class="hover:text-gray-400 transition-colors">Shop</RouterLink>
      <span>/</span>
      <span class="text-gray-400">{{ product.name }}</span>
    </nav>

    <!-- Product hero -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <!-- Image -->
      <div class="glass rounded-3xl p-12 flex items-center justify-center min-h-80 relative overflow-hidden" ref="imageEl">
        <span class="text-9xl" style="filter: drop-shadow(0 0 40px rgba(168,85,247,0.6))">{{ product.image }}</span>
        <!-- Stock flicker -->
        <div
          class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300"
          :class="stockInStock ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'"
        >
          {{ stockInStock ? '✅ In Stock' : '⚠️ Only 1 Left!' }}
        </div>
        <div v-if="product.badge" class="absolute top-4 left-4 tag text-xs">{{ product.badge }}</div>
      </div>

      <!-- Info -->
      <div ref="infoEl">
        <span class="tag-cyan tag text-xs mb-3 inline-block">{{ product.category }}</span>
        <h1 class="text-4xl font-black text-white leading-tight mb-4">{{ product.name }}</h1>

        <!-- Rating -->
        <div class="flex items-center gap-3 mb-4">
          <span class="stars text-lg">{{ '★'.repeat(5) }}</span>
          <span class="text-white font-bold">{{ product.rating }}</span>
          <span class="text-gray-500 text-sm">({{ product.reviewCount.toLocaleString() }} reviews)</span>
          <span class="tag-cyan tag text-[10px]">Verified™</span>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-3 mb-2">
          <span class="text-5xl font-black neon-text-purple">${{ product.price.toFixed(2) }}</span>
          <span class="text-xl text-gray-600 line-through">${{ product.originalPrice.toFixed(2) }}</span>
        </div>
        <p class="text-green-400 text-sm font-semibold mb-6">
          You save ${{ (product.originalPrice - product.price).toFixed(2) }} ({{ Math.round((1 - product.price / product.originalPrice) * 100) }}% off)
          — Today only! (It's always today only.)
        </p>

        <!-- Specs -->
        <div class="glass rounded-2xl p-4 mb-6">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specifications</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(val, key) in product.specs" :key="key" class="flex flex-col">
              <span class="text-[10px] text-gray-600 uppercase">{{ key }}</span>
              <span class="text-sm text-white font-medium">{{ val }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-400 text-sm leading-relaxed mb-6">{{ product.description }}</p>

        <!-- CTA -->
        <div class="flex gap-3 mb-4">
          <button @click="addToCart" class="btn-primary flex-1 text-lg py-4">
            {{ cartAdded ? '✓ Added to Cart!' : 'Add to Cart' }}
          </button>
          <button
            @click="addToCart"
            class="btn-primary py-4 px-5 text-xl"
            title="Buy Now"
          >⚡</button>
        </div>

        <p class="text-[11px] text-gray-700 text-center">
          By adding to cart you agree to our terms, conditions, anti-terms, and the unspoken agreement that you'll leave a 5-star review.
        </p>

        <!-- Sneaky quantity selector that upsells -->
        <div class="mt-4 glass rounded-xl p-3 flex items-center justify-between">
          <span class="text-xs text-gray-500">Quantity:</span>
          <div class="flex items-center gap-3">
            <button @click="qty > 1 && qty--" class="w-7 h-7 rounded-lg glass text-white flex items-center justify-center text-sm hover:bg-white/10">−</button>
            <span class="text-white font-bold w-6 text-center">{{ qty }}</span>
            <button @click="qty++" class="w-7 h-7 rounded-lg glass text-white flex items-center justify-center text-sm hover:bg-white/10">+</button>
          </div>
          <span v-if="qty >= 3" class="text-xs text-yellow-400 animate-pulse">Wow, bold move</span>
          <span v-else-if="qty >= 2" class="text-xs text-gray-500">Why not get 3?</span>
        </div>
      </div>
    </div>

    <!-- Reviews section -->
    <div class="mb-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-black text-white">Customer Reviews</h2>
          <p class="text-gray-500 text-sm mt-1">All reviews verified by our team of definitely-not-us reviewers</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="stars text-2xl">{{ '★'.repeat(5) }}</span>
          <span class="text-3xl font-black neon-text-purple">{{ product.rating }}</span>
          <span class="text-gray-500 text-sm">/ 5.0</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="(review, i) in fakeReviews"
          :key="i"
          class="glass rounded-2xl p-5"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ review.avatar }}</span>
              <div>
                <p class="text-white font-semibold text-sm">{{ review.name }}</p>
                <p class="text-gray-600 text-xs">{{ review.date }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="stars text-sm">{{ '★'.repeat(review.rating) }}</span>
              <span v-if="review.verified" class="tag text-[10px]">Verified</span>
            </div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">{{ review.text }}</p>
        </div>
      </div>
    </div>

    <!-- People also viewed (same product, different prices) -->
    <div>
      <h2 class="text-3xl font-black text-white mb-6">People Also Viewed</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(variant, i) in productVariants"
          :key="i"
          @click="$router.push(`/product/${product.id}`)"
          class="product-card cursor-pointer p-4 text-center"
        >
          <span class="text-4xl block mb-3">{{ product.image }}</span>
          <p class="text-xs text-white font-semibold mb-1 line-clamp-2">{{ product.name }}</p>
          <p class="text-sm font-black neon-text-purple">${{ variant.price }}</p>
          <p class="text-[10px] text-gray-600">(Same product. Different price. Unclear why.)</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-40">
    <p class="text-gray-500">Product not found</p>
    <RouterLink to="/shop" class="btn-primary mt-4 inline-block">Back to Shop</RouterLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { products, fakeReviews } from '../data/products.js'
import { useCartStore } from '../stores/cart.js'
import gsap from 'gsap'

const route = useRoute()
const cartStore = useCartStore()

const product = computed(() => products.find(p => p.id === Number(route.params.id)))
const imageEl = ref(null)
const infoEl = ref(null)
const cartAdded = ref(false)
const qty = ref(1)

// Stock flicker
const stockInStock = ref(true)
let stockTimer = null

// Variants with slightly different prices (same product shown 4 times)
const productVariants = computed(() => {
  if (!product.value) return []
  const p = product.value.price
  return [
    { price: p.toFixed(2) },
    { price: (p * 1.03).toFixed(2) },
    { price: (p * 0.98).toFixed(2) },
    { price: (p * 1.07).toFixed(2) },
  ]
})

function addToCart() {
  if (product.value) {
    for (let i = 0; i < qty.value; i++) {
      cartStore.addItem(product.value)
    }
    cartAdded.value = true
    setTimeout(() => { cartAdded.value = false }, 2000)
  }
}

onMounted(() => {
  if (imageEl.value) {
    gsap.from(imageEl.value, { x: -50, opacity: 0, duration: 0.7, ease: 'power3.out' })
  }
  if (infoEl.value) {
    gsap.from(infoEl.value.children, { x: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 })
  }

  // Stock indicator flicker
  stockTimer = setInterval(() => {
    stockInStock.value = !stockInStock.value
    setTimeout(() => { stockInStock.value = !stockInStock.value }, 800)
  }, 4000)
})

onUnmounted(() => {
  clearInterval(stockTimer)
})
</script>
