<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="mb-10">
      <h1 class="text-5xl font-black text-white mb-2">Checkout</h1>
      <p class="text-gray-500 text-sm">Almost there, {{ userStore.firstName }}! This will only take a moment and possibly your soul.</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center gap-4 mb-10">
      <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
          :class="currentStep > i ? 'bg-green-500 text-white' :
                  currentStep === i ? 'text-white' : 'glass text-gray-500'"
          :style="currentStep === i ? 'background: linear-gradient(135deg, #a855f7, #06b6d4)' : ''"
        >
          {{ currentStep > i ? '✓' : i + 1 }}
        </div>
        <span class="text-sm" :class="currentStep === i ? 'text-white font-semibold' : 'text-gray-600'">
          {{ step }}
        </span>
        <span v-if="i < steps.length - 1" class="text-gray-700 mx-1">→</span>
      </div>
    </div>

    <!-- Step 1: Your Info -->
    <div v-if="currentStep === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div class="glass-purple rounded-2xl p-4 mb-2">
          <p class="text-xs text-gray-400">
            👋 We've pre-filled this with <strong class="text-white">{{ userStore.firstName }}'s</strong> saved info. It's almost certainly yours.
          </p>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Full Name</label>
          <input
            v-model="form.name"
            class="input-dark"
            @input="onNameEdit"
          />
          <p v-if="nameEdited" class="text-xs text-yellow-400 mt-1">
            ⚠️ Are you sure? {{ userStore.firstName }} usually uses "{{ userStore.fullName }}". <button @click="form.name = userStore.fullName; nameEdited = false" class="underline">Restore</button>
          </p>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Email</label>
          <input v-model="form.email" type="email" class="input-dark" />
          <p class="text-[10px] text-gray-700 mt-1">We will also email your contacts, just FYI.</p>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Address</label>
          <input
            v-model="form.address"
            class="input-dark"
            @input="addressEdited = true"
          />
          <p v-if="addressEdited" class="text-xs text-yellow-400 mt-1">
            Unusual! We've logged this change for fraud prevention purposes (and general nosiness).
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-500 mb-1 block">City</label>
            <input v-model="form.city" class="input-dark" />
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">ZIP</label>
            <input v-model="form.zip" class="input-dark" />
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Phone</label>
          <input v-model="form.phone" class="input-dark" placeholder="We will call you. Repeatedly." />
        </div>

        <button @click="nextStep" class="btn-primary w-full py-4 font-bold">
          Continue to Payment →
        </button>
      </div>

      <!-- Order preview -->
      <div class="glass rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 text-sm">Order Preview</h3>
        <p class="text-xs text-gray-500 mb-3">(Prices finalized in Step 3. They may be different.)</p>
        <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm py-2 border-b border-white/5">
          <span class="text-gray-400 truncate flex-1">{{ item.name }}</span>
          <span class="text-white ml-2">${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-lg font-black pt-4 mt-2">
          <span class="text-gray-300">Approx. Total</span>
          <span class="neon-text-purple">~${{ cartStore.total.toFixed(2) }}ish</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Payment -->
    <div v-if="currentStep === 1">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <!-- Debra's card offer -->
          <div v-if="!usingOwnCard" class="glass-purple rounded-2xl p-5">
            <div class="flex items-start gap-3 mb-4">
              <span class="text-3xl">💳</span>
              <div>
                <h3 class="font-bold text-white mb-1">No card on file?</h3>
                <p class="text-sm text-gray-400">
                  No worries! We found <strong class="text-white">{{ userStore.debraCard.name }}</strong>'s card.
                  She won't mind. Probably.
                </p>
              </div>
            </div>

            <!-- Fake card display -->
            <div class="glass rounded-xl p-4 mb-4" style="background: linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))">
              <div class="flex justify-between items-start mb-6">
                <span class="text-xs text-gray-500 font-mono">LolBuy Bank™</span>
                <span class="text-xl">💎</span>
              </div>
              <p class="font-mono text-white text-lg tracking-widest mb-3">{{ userStore.debraCard.number }}</p>
              <div class="flex justify-between text-xs text-gray-400 font-mono">
                <span>{{ userStore.debraCard.name }}</span>
                <span>{{ userStore.debraCard.expiry }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="useDebraCard" class="btn-primary flex-1 text-sm py-3">
                Use {{ userStore.debraCard.name.split(' ')[0] }}'s Card 💳
              </button>
              <button
                @click="declineDebra"
                class="flex-1 text-xs text-gray-700 hover:text-gray-500 transition-colors"
              >
                Decline (Debra will know)
              </button>
            </div>
          </div>

          <!-- Debra declined state -->
          <div v-if="debraDeclined" class="glass rounded-2xl p-4 text-center text-sm text-gray-500">
            <p class="text-2xl mb-2">😔</p>
            <p>{{ userStore.debraCard.name.split(' ')[0] }} has been notified of your rejection. She's fine. Mostly.</p>
          </div>

          <!-- Own card form -->
          <div v-if="usingDebraCard || debraDeclined" class="space-y-4">
            <div v-if="usingDebraCard" class="glass rounded-xl p-3 flex items-center gap-2 text-sm">
              <span class="text-green-400">✓</span>
              <span class="text-gray-400">Using {{ userStore.debraCard.name }}'s card. She's happy for you.</span>
            </div>

            <div v-if="debraDeclined">
              <label class="text-xs text-gray-500 mb-1 block">Card Number</label>
              <input v-model="form.cardNumber" class="input-dark font-mono" placeholder="**** **** **** ****" />
            </div>
            <div v-if="debraDeclined" class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-500 mb-1 block">Expiry</label>
                <input v-model="form.cardExpiry" class="input-dark font-mono" placeholder="MM/YY" />
              </div>
              <div>
                <label class="text-xs text-gray-500 mb-1 block">CVV</label>
                <input v-model="form.cardCvv" class="input-dark font-mono" placeholder="123" maxlength="3" />
              </div>
            </div>
          </div>

          <button
            v-if="usingDebraCard || debraDeclined"
            @click="nextStep"
            class="btn-primary w-full py-4 font-bold"
          >
            Continue to Review →
          </button>

          <button @click="prevStep" class="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors text-center">
            ← Back to Info
          </button>
        </div>

        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white mb-3 text-sm">Payment Security</h3>
          <div class="space-y-2 text-xs text-gray-500">
            <p>✅ 256-bit SSL (on this page at least)</p>
            <p>✅ PCI compliant (we think)</p>
            <p>✅ Your card details stored forever (for convenience!)</p>
            <p>✅ Shared with partners (they're nice)</p>
            <p>✅ Definitely not stored in plain text</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Review & Confirm -->
    <div v-if="currentStep === 2">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="glass rounded-2xl p-5 mb-5">
            <h3 class="font-bold text-white mb-4 text-sm">Order Review</h3>
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between py-2 border-b border-white/5 text-sm">
              <span class="text-gray-400">{{ item.name }} x{{ item.quantity }}</span>
              <span class="text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <!-- Surprise items -->
            <div class="mt-4 p-3 rounded-xl" style="background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2)">
              <p class="text-xs text-red-400 font-semibold mb-2 flex items-center gap-1">
                🎁 Surprise Items (these came with your order!)
              </p>
              <div v-for="(surprise, i) in surpriseItems" :key="i" class="flex justify-between py-1 text-sm">
                <span class="text-gray-500">{{ surprise.name }}</span>
                <span class="text-white">${{ surprise.price.toFixed(2) }}</span>
              </div>
              <p class="text-[10px] text-gray-700 mt-2">These are included per our Terms & Conditions Section 47, Subsection B, Paragraph 12 (the spicy one).</p>
            </div>
          </div>

          <!-- Total breakdown -->
          <div class="glass rounded-2xl p-5 mb-5">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-400">
                <span>Your items</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-yellow-400">
                <span>Add-ons</span>
                <span>+${{ cartStore.sneakyTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-red-400">
                <span>Surprise Items</span>
                <span>+${{ surpriseTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Various Fees</span>
                <span>+$16.98</span>
              </div>
            </div>
            <div class="border-t border-white/10 pt-4 mt-4 flex justify-between items-baseline">
              <span class="font-black text-white text-lg">Total</span>
              <div class="text-right">
                <p class="text-3xl font-black neon-text-purple">${{ finalTotal.toFixed(2) }}</p>
                <p class="text-xs text-gray-600">(~40% more than expected, as always)</p>
              </div>
            </div>
          </div>

          <!-- Terms -->
          <div class="glass rounded-2xl p-5 mb-5 relative overflow-hidden">
            <p class="text-sm text-gray-400 mb-3">
              Please agree to our
              <span @click="openTermsDoc('tos')" class="text-neon-purple underline cursor-pointer">Terms of Service</span>,
              <span @click="openTermsDoc('privacy')" class="text-neon-cyan underline cursor-pointer">Privacy Policy</span>,
              <span @click="openTermsDoc('anti')" class="text-gray-500 underline cursor-pointer">Anti-Terms</span>, and
              <span @click="openTermsDoc('other')" class="text-gray-700 text-xs underline cursor-pointer">The Other Document</span>.
            </p>
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                v-model="termsAgreed"
                class="w-4 h-4 accent-purple-500 cursor-pointer"
              />
              <label class="text-sm text-gray-300 cursor-pointer">
                I agree to all terms and conditions
              </label>
            </div>
          </div>

          <button
            @click="placeOrder"
            class="btn-primary w-full py-4 font-bold text-lg"
            :class="!termsAgreed ? 'opacity-60' : ''"
          >
            Place Order (${{ finalTotal.toFixed(2) }}) 🚀
          </button>

          <div
            class="transition-all duration-300"
            :style="{ transform: `translate(${backOffset.x}px, ${backOffset.y}px)` }"
            @mouseover="moveBack"
          >
            <button @click="prevStep" class="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors text-center mt-3">
              ← Back to Payment
            </button>
          </div>
        </div>

        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-3">Delivering To</h3>
          <p class="text-gray-400 text-sm">{{ form.name }}</p>
          <p class="text-gray-500 text-xs">{{ form.address }}, {{ form.city }} {{ form.zip }}</p>
          <p class="text-gray-600 text-xs mt-1">Gerald has been briefed.</p>

          <div class="border-t border-white/5 mt-4 pt-4">
            <h3 class="font-bold text-white text-sm mb-2">Payment Method</h3>
            <div class="flex items-center gap-2">
              <span class="text-lg">💳</span>
              <div>
                <p class="text-gray-400 text-sm">{{ usingDebraCard ? userStore.debraCard.name + "'s Card" : 'Your Card' }}</p>
                <p class="text-gray-600 text-xs font-mono">{{ usingDebraCard ? userStore.debraCard.number : '**** **** **** ' + (form.cardNumber.slice(-4) || '????') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms modal -->
    <Transition name="page">
      <div
        v-if="termsModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(10px)"
        @click.self="termsModal = null"
      >
        <div class="glass-purple rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <h3 class="text-xl font-black text-white mb-4">{{ termsModal.title }}</h3>
          <div class="space-y-3 text-sm text-gray-400">
            <p v-for="(line, i) in termsModal.lines" :key="i">{{ line }}</p>
          </div>
          <button @click="termsModal = null; termsAgreed = true" class="btn-primary w-full mt-6 text-sm py-3">
            I Have Read and Understood Everything (Agree)
          </button>
          <p class="text-[10px] text-gray-700 mt-2 text-center">Scrolling to this button constitutes full acceptance.</p>
        </div>
      </div>
    </Transition>

    <!-- Step 4: Success -->
    <div v-if="currentStep === 3" class="text-center py-12" ref="successEl">
      <div class="text-8xl mb-6 animate-bounce">🎉</div>
      <h2 class="text-5xl font-black text-white mb-4">Order Placed!</h2>
      <p class="text-gray-400 text-lg mb-2">
        Thanks, <span class="neon-text-purple font-bold">{{ userStore.firstName }}</span>!
      </p>
      <p class="text-gray-500 text-sm mb-6">
        Your order <span class="font-mono text-neon-cyan">#LB-{{ orderId }}</span> is confirmed.
        Gerald has been notified and is stretching.
      </p>

      <div class="glass rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
        <h3 class="font-bold text-white mb-3">What Happens Next:</h3>
        <div class="space-y-2 text-sm text-gray-400">
          <p>📧 Confirmation email sent to {{ form.email }} (and 14 others)</p>
          <p>📱 Signed you up for SMS updates (and some other SMS things)</p>
          <p>🔔 Your social contacts have been notified of your purchase</p>
          <p>👟 Gerald is already running</p>
          <p>💳 Charged ${{ finalTotal.toFixed(2) }} + possible mystery charge pending</p>
        </div>
      </div>

      <RouterLink to="/shop" class="btn-primary text-lg py-4 px-8">
        Continue Shopping (Gerald needs the work)
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useCartStore } from '../stores/cart.js'
import gsap from 'gsap'

const userStore = useUserStore()
const cartStore = useCartStore()

const currentStep = ref(0)
const steps = ['Your Info', 'Payment', 'Review', 'Done!']

const nameEdited = ref(false)
const addressEdited = ref(false)
const usingDebraCard = ref(false)
const usingOwnCard = ref(false)
const debraDeclined = ref(false)
const termsAgreed = ref(false)
const backOffset = ref({ x: 0, y: 0 })
const termsModal = ref(null)

const termsDocs = {
  tos: {
    title: 'Terms of Service',
    lines: [
      'Welcome to LolBuy! By reading this sentence you have agreed to everything.',
      '1. All purchases are final, including accidental ones, ones made while asleep, and ones made by your cat.',
      '2. Gerald owns your package until he personally decides to release it. Gerald\'s mood is not our liability.',
      '3. We reserve the right to add items to your cart at any time for any reason, including vibes.',
      '4. You waive all rights, including rights you haven\'t heard of yet.',
      '5. This agreement is binding on your descendants up to and including the fourth generation.',
      '6. LolBuy\'s interpretation of this document is the only legally valid interpretation.',
      '7. Prices shown are indicative. Final prices are revealed at the moment of charge.',
      '8. By using LolBuy you consent to receiving communications via all channels including ones not yet invented.',
      '9. If you disagree with any part of these terms, that disagreement also constitutes agreement.',
      'Thank you for your compliance.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    lines: [
      'We take your privacy very seriously, which is why we\'ve read all of it carefully.',
      'What we collect: Everything. This includes data you have not provided yet.',
      'What we store: Forever. Our servers are underground for a reason.',
      'Who we share with: Our 247 trusted partners, Gerald\'s cousin Derek, and an unnamed third party we call "The Listener".',
      'Your right to erasure: Denied (Premium tier required).',
      'Your right to access your data: Pending. Please allow 6–8 weeks. Then another 6–8 weeks.',
      'Cookies: Yes. All of them. We have invented new kinds of cookies specifically for your visit.',
      'Location data: We know where you are. We think that\'s neat.',
      'We may update this policy at any time. Continued breathing constitutes acceptance of updates.',
    ],
  },
  anti: {
    title: 'Anti-Terms',
    lines: [
      'These are the things LolBuy commits to NOT doing. Please read carefully.',
      'We will NOT stop emailing you. (Exceptions do not apply.)',
      'We will NOT forget your data. Forgetting is not in our roadmap.',
      'We will NOT tell you what "The Other Document" contains.',
      'We will NOT stop adding Gerald\'s tip. Gerald has a family.',
      'We will NOT acknowledge this document in any legal dispute.',
      'We will NOT define what "Anti-Terms" legally means.',
      'Interestingly, the Anti-Terms supersede the Terms of Service in all cases except the ones where they don\'t.',
    ],
  },
  other: {
    title: 'The Other Document',
    lines: [
      'This document supersedes all other documents, including itself.',
      '[REDACTED]',
      '[REDACTED]',
      'Section 3: The part you should worry about.',
      '[REDACTED]',
      '[REDACTED]',
      'Section 7: Gerald.',
      '[REDACTED]',
      'By viewing this document you have accepted its terms. The terms are classified.',
      '[REDACTED]',
      'This document was last updated: Always.',
      'Word count: [REDACTED]',
      'If you can read this, it\'s already too late.',
    ],
  },
}
const successEl = ref(null)
const orderId = ref(Math.floor(Math.random() * 900000) + 100000)

const form = ref({
  name: userStore.fullName,
  email: userStore.email,
  address: userStore.address.split(',')[0],
  city: userStore.address.split(',')[1]?.trim() || 'Springfield',
  zip: '90210',
  phone: '555-' + Math.floor(Math.random() * 9000 + 1000),
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
})

// Surprise items added at checkout
const surpriseItems = [
  { name: 'LolBuy Extended Care Bundle™', price: 39.99 },
  { name: 'Digital Instruction Manual (PDF)', price: 12.99 },
  { name: 'Complimentary "Thank You" NFT', price: 24.99 },
]

const surpriseTotal = computed(() => surpriseItems.reduce((sum, i) => sum + i.price, 0))

const finalTotal = computed(() =>
  cartStore.total + surpriseTotal.value + 16.98
)

function onNameEdit() {
  if (form.value.name !== userStore.fullName) {
    nameEdited.value = true
  } else {
    nameEdited.value = false
  }
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function useDebraCard() {
  usingDebraCard.value = true
  nextStep()
}

function declineDebra() {
  debraDeclined.value = true
}

function moveBack() {
  backOffset.value = {
    x: (Math.random() - 0.5) * 160,
    y: (Math.random() - 0.5) * 50,
  }
  setTimeout(() => {
    backOffset.value = { x: 0, y: 0 }
  }, 1500)
}

function openTermsDoc(key) {
  termsModal.value = termsDocs[key]
}

function placeOrder() {
  if (!termsAgreed.value) return
  currentStep.value = 3
  setTimeout(() => {
    if (successEl.value) {
      gsap.from(successEl.value.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }
  }, 100)
}
</script>
