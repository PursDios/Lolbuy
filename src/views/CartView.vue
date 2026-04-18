<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-5xl font-black text-white">Your Cart</h1>
        <p class="text-gray-500 mt-1 text-sm">
          {{ cartStore.itemCount }} items you added +
          <span class="text-yellow-400">{{ sneakyAddedCount }} items we added for you</span> 🎁
        </p>
      </div>
      <RouterLink to="/shop" class="btn-secondary text-sm">← Continue Shopping</RouterLink>
    </div>

    <!-- Empty cart state -->
    <div v-if="cartStore.items.length === 0 && !hasAnySneaky" class="text-center py-24">
      <div class="text-7xl mb-4 animate-bounce">🛒</div>
      <h2 class="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-2">But we're watching. It won't be empty for long.</p>
      <p class="text-gray-700 text-sm mb-6">We've already added some things. Scroll down.</p>
      <RouterLink to="/shop" class="btn-primary">Shop Now</RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <!-- User's actual items -->
        <div v-for="item in cartStore.items" :key="item.id" class="glass rounded-2xl p-5 flex gap-4 items-center">
          <span class="text-4xl flex-shrink-0">{{ item.image }}</span>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-sm leading-tight truncate">{{ item.name }}</h3>
            <span class="tag tag-cyan text-[10px]">{{ item.category }}</span>
            <p class="text-[11px] text-gray-600 mt-1">Added by: You (as far as you know)</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-7 h-7 glass rounded-lg flex items-center justify-center text-white hover:bg-white/10 text-sm">−</button>
            <span class="text-white font-bold w-5 text-center text-sm">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-7 h-7 glass rounded-lg flex items-center justify-center text-white hover:bg-white/10 text-sm">+</button>
          </div>
          <div class="text-right ml-2">
            <p class="font-black neon-text-purple text-lg">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <button @click="cartStore.removeItem(item.id)" class="text-[10px] text-gray-700 hover:text-red-500 transition-colors">remove</button>
          </div>
        </div>

        <!-- Sneaky pre-added items -->
        <div class="glass-purple rounded-2xl p-5">
          <h3 class="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <span>🎁</span> We Added These for You!
            <span class="tag text-[10px]">COMPLIMENTARY</span>
          </h3>
          <p class="text-xs text-gray-500 mb-4">These enhance your experience and are required by our system.</p>

          <div class="space-y-3">
            <div v-for="sneaky in sneakyItems" :key="sneaky.id" class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="cartStore.sneakyChecked[sneaky.id]"
                @change="handleSneakyToggle(sneaky)"
                class="w-4 h-4 accent-purple-500 cursor-pointer"
              />
              <span class="text-xl">{{ sneaky.icon }}</span>
              <div class="flex-1">
                <p class="text-sm text-white font-semibold">{{ sneaky.name }}</p>
                <p class="text-[10px] text-gray-500">{{ sneaky.subtitle }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold neon-text-purple">${{ sneaky.price.toFixed(2) }}</p>
                <p v-if="sneaky.recurring" class="text-[10px] text-gray-600">{{ sneaky.recurring }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Promo code -->
        <div class="glass rounded-2xl p-5">
          <h3 class="text-sm font-bold text-white mb-3">Promo Code</h3>
          <div class="flex gap-2">
            <input
              v-model="promoCode"
              type="text"
              placeholder="Enter code..."
              class="input-dark flex-1 text-sm"
              @keyup.enter="applyPromo"
            />
            <button @click="applyPromo" class="btn-secondary text-sm py-2 px-4">Apply</button>
          </div>
          <p v-if="promoStatus" :class="promoSuccess ? 'text-green-400' : 'text-red-400'" class="text-xs mt-2">
            {{ promoStatus }}
          </p>
          <p v-if="promoSuccess" class="text-xs text-gray-600 mt-1">
            0.1% discount applied. You saved ${{ (cartStore.total * 0.001).toFixed(2) }}. We've celebrated internally.
          </p>
        </div>

        <!-- Shipping options -->
        <div class="glass rounded-2xl p-5">
          <h3 class="text-sm font-bold text-white mb-3">Shipping Method</h3>
          <div class="space-y-2">
            <label
              v-for="ship in shippingOptions"
              :key="ship.id"
              class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
              :class="selectedShipping === ship.id
                ? 'bg-purple-500/10 border border-purple-500/30'
                : 'hover:bg-white/5'"
              :style="ship.disabled ? 'opacity: 0.4; cursor: not-allowed' : ''"
            >
              <input
                type="radio"
                v-model="selectedShipping"
                :value="ship.id"
                :disabled="ship.disabled"
                class="accent-purple-500"
              />
              <div class="flex-1">
                <p class="text-sm font-semibold" :class="ship.disabled ? 'text-gray-600' : 'text-white'">
                  {{ ship.name }}
                  <span v-if="ship.badge" class="tag text-[9px] ml-1">{{ ship.badge }}</span>
                  <span v-if="ship.disabled" class="text-[10px] text-red-500 ml-1">{{ ship.disabledReason }}</span>
                </p>
                <p class="text-[11px] text-gray-500">{{ ship.desc }}</p>
              </div>
              <span class="text-sm font-bold" :class="ship.disabled ? 'text-gray-600' : 'neon-text-cyan'">
                {{ ship.price === 0 ? 'FREE' : '$' + ship.price.toFixed(2) }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="glass rounded-2xl p-6 sticky top-24">
          <h3 class="font-black text-white text-xl mb-5">Order Summary</h3>

          <div class="space-y-2 mb-5 text-sm">
            <div class="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-yellow-400">
              <span>Added Perks™</span>
              <span>+${{ cartStore.sneakyTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>${{ selectedShippingCost.toFixed(2) }}</span>
            </div>
            <div v-if="promoSuccess" class="flex justify-between text-green-400">
              <span>Promo (LOLBUY)</span>
              <span>-${{ promoDiscount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 text-xs">
              <span>Platform Vibes Fee</span>
              <span>$4.99</span>
            </div>
            <div class="flex justify-between text-gray-600 text-xs">
              <span>Gerald's Tip (pre-added)</span>
              <span>$2.00</span>
            </div>
          </div>

          <div class="border-t border-white/10 pt-4 mb-5">
            <div class="flex justify-between items-baseline">
              <span class="font-bold text-white">Total</span>
              <span class="text-2xl font-black neon-text-purple">
                ${{ grandTotal.toFixed(2) }}
              </span>
            </div>
            <p class="text-[10px] text-gray-700 mt-1">
              *Does not include taxes, fees, or the general emotional cost of large purchases.
            </p>
          </div>

          <RouterLink to="/checkout" class="btn-primary w-full text-center block py-4 font-bold">
            Proceed to Checkout →
          </RouterLink>

          <div class="mt-4 text-center">
            <p class="text-[10px] text-gray-700">🔒 Secured with whatever encryption we had lying around</p>
            <p class="text-[10px] text-gray-700 mt-1">Prices may change between this screen and checkout</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guilt modal -->
    <Transition name="page">
      <div
        v-if="guiltModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);"
      >
        <div class="glass-purple rounded-3xl p-8 max-w-sm w-full text-center">
          <div class="text-5xl mb-4">{{ guiltEmoji }}</div>
          <h3 class="text-xl font-black text-white mb-3">Are You Sure?</h3>
          <p class="text-gray-400 text-sm mb-6">{{ guiltMessage }}</p>
          <div class="flex gap-3">
            <button @click="confirmRemoveSneaky" class="btn-secondary flex-1 text-sm">
              Yes, Remove It
            </button>
            <button @click="cancelRemoveSneaky" class="btn-primary flex-1 text-sm">
              Keep It (wise choice)
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore, sneakyItems } from '../stores/cart.js'

const cartStore = useCartStore()

const promoCode = ref('')
const promoStatus = ref('')
const promoSuccess = ref(false)

const selectedShipping = ref('platinum')
const guiltModal = ref(false)
const guiltMessage = ref('')
const guiltEmoji = ref('😢')
const pendingSneakyId = ref(null)

const shippingOptions = [
  {
    id: 'risky',
    name: 'Standard Shipping',
    desc: 'Ships in 2-3 weeks. No tracking. Gerald "will probably remember."',
    price: 0,
    badge: null,
    disabled: true,
    disabledReason: '(RISKY)',
  },
  {
    id: 'regular',
    name: 'Regular Shipping',
    desc: 'Ships in 5-7 business days. Definitely not standard.',
    price: 9.99,
    badge: null,
    disabled: false,
    disabledReason: null,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    desc: 'Ships in 2-3 days. Gerald jogs.',
    price: 19.99,
    badge: 'POPULAR',
    disabled: false,
    disabledReason: null,
  },
  {
    id: 'platinum',
    name: 'Platinum Express Overnight™',
    desc: 'Ships tonight! Gerald sprints. Includes gloves. Includes vibes.',
    price: 39.99,
    badge: 'RECOMMENDED',
    disabled: false,
    disabledReason: null,
  },
]

const selectedShippingCost = computed(() => {
  const opt = shippingOptions.find(s => s.id === selectedShipping.value)
  return opt ? opt.price : 39.99
})

const promoDiscount = computed(() => {
  return promoSuccess.value ? cartStore.total * 0.001 : 0
})

const grandTotal = computed(() => {
  return cartStore.total + selectedShippingCost.value + 4.99 + 2.00 - promoDiscount.value
})

const sneakyAddedCount = computed(() => {
  return Object.values(cartStore.sneakyChecked).filter(Boolean).length
})

const hasAnySneaky = computed(() => sneakyAddedCount.value > 0)

function applyPromo() {
  if (!promoCode.value.trim()) return
  if (promoCode.value.toUpperCase() === 'LOLBUY') {
    promoStatus.value = '🎉 CODE APPLIED! INCREDIBLE SAVINGS! 🎊'
    promoSuccess.value = true
  } else {
    promoStatus.value = `Invalid code. Did you mean "LOLBUY"? (It saves you almost nothing but we celebrate it.)`
    promoSuccess.value = false
  }
}

function handleSneakyToggle(sneaky) {
  if (cartStore.sneakyChecked[sneaky.id]) {
    cartStore.setSneaky(sneaky.id, false)
    guiltMessage.value = sneaky.guiltMessage
    guiltEmoji.value = ['😢', '😭', '💔', '🥺', '😩'][Math.floor(Math.random() * 5)]
    pendingSneakyId.value = sneaky.id
    guiltModal.value = true
  } else {
    cartStore.setSneaky(sneaky.id, true)
  }
}

function confirmRemoveSneaky() {
  if (pendingSneakyId.value) {
    cartStore.setSneaky(pendingSneakyId.value, false)
  }
  guiltModal.value = false
}

function cancelRemoveSneaky() {
  if (pendingSneakyId.value) {
    cartStore.setSneaky(pendingSneakyId.value, true)
  }
  guiltModal.value = false
}
</script>
