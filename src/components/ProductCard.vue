<template>
  <div
    class="product-card relative"
    @mouseenter="startHoverTimer"
    @mouseleave="cancelHoverTimer"
    @click="$router.push(`/product/${product.id}`)"
  >
    <!-- Badge -->
    <div v-if="product.badge" class="absolute top-3 left-3 z-10">
      <span :class="badgeClass">{{ product.badge }}</span>
    </div>

    <!-- Sneaky hover warning -->
    <div
      v-if="hoverProgress > 0 && !added"
      class="absolute top-3 right-3 z-10 glass rounded-lg px-2 py-1 text-[10px] text-gray-400"
    >
      <div class="flex items-center gap-1">
        <span>👀</span>
        <div class="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-100"
            style="background: linear-gradient(90deg, #a855f7, #06b6d4)"
            :style="{ width: hoverProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Added to cart flash -->
    <Transition name="toast">
      <div
        v-if="added"
        class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
        style="background: rgba(168, 85, 247, 0.15); backdrop-filter: blur(4px)"
      >
        <div class="text-center">
          <div class="text-4xl mb-2">✅</div>
          <p class="text-sm font-bold text-white">Added for you!</p>
          <p class="text-xs text-gray-400">You seemed interested 👀</p>
        </div>
      </div>
    </Transition>

    <!-- Product image area -->
    <div class="h-48 flex items-center justify-center relative overflow-hidden"
      style="background: linear-gradient(135deg, rgba(168,85,247,0.05), rgba(6,182,212,0.05))">
      <span class="text-7xl" style="filter: drop-shadow(0 0 20px rgba(168,85,247,0.5))">{{ product.image }}</span>
      <!-- shimmer on hover -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 shimmer-bg transition-opacity duration-300"></div>
    </div>

    <div class="p-5">
      <!-- Category tag -->
      <span class="tag-cyan tag text-[10px] mb-2 inline-block">{{ product.category }}</span>

      <!-- Name -->
      <h3 class="font-bold text-white text-sm leading-tight mb-2 line-clamp-2">{{ product.name }}</h3>

      <!-- Stock indicator -->
      <p class="text-[11px] text-red-400 mb-2 font-medium">⚠️ Only {{ Math.floor(Math.random() * 2) + 1 }} left in stock!</p>

      <!-- Rating -->
      <div class="flex items-center gap-2 mb-3">
        <span class="stars text-xs">{{ '★'.repeat(5) }}</span>
        <span class="text-xs text-gray-500">({{ product.reviewCount.toLocaleString() }})</span>
      </div>

      <!-- Price -->
      <div class="flex items-baseline gap-2">
        <span class="text-xl font-black neon-text-purple">${{ product.price.toFixed(2) }}</span>
        <span class="text-sm text-gray-600 line-through">${{ product.originalPrice.toFixed(2) }}</span>
        <span class="text-xs text-green-400 font-semibold">
          {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% off
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const router = useRouter()
const cartStore = useCartStore()

const hoverProgress = ref(0)
const added = ref(false)
let hoverTimer = null
let progressTimer = null

const badgeClass = computed(() => {
  const colors = {
    purple: 'tag',
    cyan: 'tag tag-cyan',
    red: 'tag tag-red',
    green: 'tag',
  }
  return (colors[props.product.badgeColor] || 'tag') + ' text-[10px]'
})

function startHoverTimer() {
  hoverProgress.value = 0
  progressTimer = setInterval(() => {
    hoverProgress.value += 5
    if (hoverProgress.value >= 100) {
      clearInterval(progressTimer)
    }
  }, 100)

  hoverTimer = setTimeout(() => {
    cartStore.addItem(props.product)
    added.value = true
    hoverProgress.value = 0
    setTimeout(() => { added.value = false }, 2000)
  }, 2000)
}

function cancelHoverTimer() {
  clearTimeout(hoverTimer)
  clearInterval(progressTimer)
  hoverProgress.value = 0
}

onUnmounted(() => {
  cancelHoverTimer()
})
</script>
