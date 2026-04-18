<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <!-- Welcome banner -->
    <div class="glass-purple rounded-3xl p-8 mb-10 text-center relative overflow-hidden" ref="welcomeEl">
      <div class="text-6xl mb-4">👤</div>
      <h1 class="text-4xl font-black text-white mb-2">
        Welcome back, <span class="neon-text-purple">{{ userStore.firstName }}</span>!
      </h1>
      <p class="text-gray-400 text-sm mb-4">
        We remembered you. You've been a customer since {{ joinDate }}.
        <span class="text-gray-600">(We remembered you the same way we remember everyone: we just picked a name.)</span>
      </p>

      <div class="flex flex-wrap justify-center gap-3">
        <span class="tag">⭐ Platinum Member</span>
        <span class="tag tag-cyan">{{ loyaltyPoints.toLocaleString() }} Loyalty Points</span>
        <span class="tag">{{ userBadge }}</span>
      </div>

      <!-- Logout button (sad label) -->
      <button
        @click="rerollUser"
        class="absolute top-4 right-4 text-xs text-gray-700 hover:text-gray-500 transition-colors"
      >
        Log out ({{ userStore.firstName }} will be sad)
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Profile -->
      <div class="space-y-5">
        <!-- Profile card -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <span>👤</span> Your Profile
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Name</span>
              <span class="text-white">{{ userStore.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Email</span>
              <span class="text-neon-cyan text-xs">{{ userStore.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Member Since</span>
              <span class="text-white">{{ joinDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tier</span>
              <span class="text-yellow-400 font-semibold">Platinum ⭐</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Trust Score</span>
              <span class="text-green-400">{{ trustScore }}/100</span>
            </div>
          </div>
          <button @click="rerollUser" class="btn-secondary w-full text-xs mt-4 py-2">
            Not You? Click Here (We'll assign someone else)
          </button>
        </div>

        <!-- Saved addresses -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-4">📍 Saved Addresses</h3>
          <div class="space-y-2">
            <div v-for="(addr, i) in savedAddresses" :key="i" class="text-xs p-2 rounded-lg hover:bg-white/5 transition-colors">
              <p class="text-white font-medium">{{ addr.label }}</p>
              <p class="text-gray-500">{{ addr.address }}</p>
              <p v-if="addr.note" class="text-gray-700 text-[10px] mt-0.5 italic">{{ addr.note }}</p>
            </div>
          </div>
        </div>

        <!-- Linked accounts -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-4">🔗 Linked Accounts</h3>
          <div class="space-y-2">
            <div v-for="link in linkedAccounts" :key="link.name" class="flex items-center justify-between text-xs py-1">
              <div class="flex items-center gap-2">
                <span>{{ link.icon }}</span>
                <span class="text-gray-400">{{ link.name }}</span>
              </div>
              <span class="text-green-400 text-[10px]">{{ link.status }}</span>
            </div>
          </div>
          <p class="text-[10px] text-gray-700 mt-3">These were linked automatically when you visited. We hope that's okay!</p>
        </div>
      </div>

      <!-- Right: Order history + more -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Order history -->
        <div class="glass rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-white text-sm">📦 Order History</h3>
            <span class="tag text-[10px]">{{ fakeOrders.length }} orders</span>
          </div>
          <div class="space-y-3">
            <div
              v-for="order in fakeOrders"
              :key="order.id"
              class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span class="text-2xl">{{ order.icon }}</span>
              <div class="flex-1">
                <p class="text-sm text-white font-medium">{{ order.product }}</p>
                <p class="text-xs text-gray-500">{{ order.date }} · Order #{{ order.id }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold neon-text-purple">${{ order.total }}</p>
                <span :class="order.statusClass" class="text-[10px]">{{ order.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscriptions (sneaky) -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-4 flex items-center gap-2">
            💸 Active Subscriptions
            <span class="tag tag-red text-[10px]">{{ subscriptions.length }} active</span>
          </h3>
          <div class="space-y-3">
            <div
              v-for="sub in subscriptions"
              :key="sub.name"
              class="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
              :style="sub.active
                ? 'background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15)'
                : 'background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05)'"
            >
              <div>
                <p class="text-sm font-medium" :class="sub.active ? 'text-white' : 'text-gray-600 line-through'">{{ sub.name }}</p>
                <p class="text-xs text-gray-500">{{ sub.desc }}</p>
                <p class="text-[10px] text-gray-700">Signed up: {{ sub.signedUp }}</p>
                <p v-if="sub.cancelRequested" class="text-[10px] text-yellow-600">Cancellation pending (6–8 weeks)</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold" :class="sub.active ? 'text-red-400' : 'text-gray-600'">${{ sub.price }}/mo</p>
                <button
                  v-if="!sub.cancelRequested && sub.active"
                  @click="tryUnsubscribe(sub)"
                  class="text-[10px] text-gray-700 hover:text-gray-500 transition-colors"
                >
                  cancel
                </button>
                <button
                  v-else-if="sub.cancelRequested || !sub.active"
                  @click="resubscribe(sub)"
                  class="text-[10px] text-green-700 hover:text-green-500 transition-colors"
                >
                  renew
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences (all opt-out, all checked) -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-bold text-white text-sm mb-4">📬 Communication Preferences</h3>
          <div class="space-y-2">
            <label v-for="pref in commsPrefs" :key="pref.label" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" v-model="pref.checked" @change="handlePrefChange(pref)" class="w-4 h-4 accent-purple-500 flex-shrink-0" />
              <div>
                <p class="text-sm text-white">{{ pref.label }}</p>
                <p class="text-[10px] text-gray-600">{{ pref.note }}</p>
              </div>
            </label>
          </div>
          <button @click="savePrefs" class="btn-secondary w-full text-xs py-2 mt-4">Save Preferences</button>
          <p v-if="savePrefsMsg" class="text-xs text-yellow-500 mt-2 transition-all">{{ savePrefsMsg }}</p>
          <p v-else class="text-[10px] text-gray-700 mt-2">Changes take 6-8 weeks to process. We may send a few things while we process.</p>
        </div>
      </div>
    </div>

    <!-- Unsubscribe modal -->
    <Transition name="page">
      <div
        v-if="unsubStep > 0"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(10px)"
      >
        <div class="glass-purple rounded-3xl p-8 max-w-sm w-full text-center">
          <div class="text-4xl mb-3">{{ unsubStepData.emoji }}</div>
          <h3 class="text-xl font-black text-white mb-2">{{ unsubStepData.title }}</h3>
          <p class="text-gray-400 text-sm mb-6">{{ unsubStepData.message }}</p>
          <div class="flex gap-3">
            <button @click="unsubNext" class="btn-secondary flex-1 text-sm">{{ unsubStepData.yesLabel }}</button>
            <button @click="unsubCancel" class="btn-primary flex-1 text-sm">{{ unsubStepData.noLabel }}</button>
          </div>
          <p class="text-[10px] text-gray-700 mt-3">Step {{ unsubStep }} of {{ unsubSteps.length }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'
import gsap from 'gsap'

const userStore = useUserStore()
const welcomeEl = ref(null)

const loyaltyPoints = ref(Math.floor(Math.random() * 50000) + 1000)
const trustScore = ref(Math.floor(Math.random() * 20) + 75)

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const userBadges = [
  '🏆 Power Shopper',
  '🧠 Galaxy Brain Buyer',
  '💸 Certified Impulse Purchaser',
  '🐋 Whale Detected',
  '🤡 Premium Member (Involuntary)',
  '👑 Financially Reckless',
  '🎰 High Roller',
  '😤 Reluctant Customer',
  '🦈 Apex Spender',
  '🫀 LolBuy Is My Cardio',
]
const userBadge = ref(pick(userBadges))

const joinDate = computed(() => {
  const years = Math.floor(Math.random() * 8) + 1
  return `${new Date().getFullYear() - years}`
})

const savedAddresses = computed(() => [
  { label: '🏠 Home', address: userStore.address, note: null },
  { label: '🏢 Work', address: '1600 Pennsylvania Ave, Washington DC', note: '(We added this. We thought you might work there.)' },
  { label: '🌍 Other', address: '4 Privet Drive, Little Whinging', note: '(You\'ve never ordered here but we saved it anyway.)' },
])

const linkedAccounts = computed(() => [
  { icon: '👤', name: `Your Mom's Facebook`, status: 'Connected' },
  { icon: '💼', name: `Your Boss's LinkedIn`, status: 'Connected' },
  { icon: '🐦', name: 'That Twitter Account You Forgot About', status: 'Connected' },
  { icon: '📸', name: 'Instagram (the personal one)', status: 'Connected' },
])

const orderPool = [
  { product: 'NVIDIA RTX 5090 Ti ULTRA MAX', icon: '🖥️', total: '1,899.99' },
  { product: 'HyperX Fury DDR5 64GB Kit', icon: '🧠', total: '249.99' },
  { product: 'Samsung 990 Pro 4TB NVMe', icon: '💾', total: '399.99' },
  { product: 'LolBuy Prime Membership x12', icon: '👑', total: '239.88' },
  { product: 'Corsair RM1000x PSU', icon: '⚡', total: '189.99' },
  { product: 'AMD Ryzen 9 7950X', icon: '💻', total: '599.99' },
  { product: 'Noctua NH-D15 Chromax.Black', icon: '🌀', total: '109.99' },
  { product: 'ASUS ROG Strix B650E', icon: '🔌', total: '349.99' },
  { product: '3x LolBuy Gift Card (self-purchase)', icon: '🎁', total: '149.97' },
  { product: 'RGB Mousepad (3m²)', icon: '🖱️', total: '89.99' },
]
const orderDates = ['2 days ago', '1 week ago', '2 weeks ago', '1 month ago', '3 months ago', '1 year ago', 'Last Tuesday (Gerald knows)']
const orderStatuses = [
  { label: 'Delivered', cls: 'text-green-400' },
  { label: 'In Transit (with Gerald)', cls: 'text-yellow-400' },
  { label: 'Preparing', cls: 'text-blue-400' },
  { label: 'Lost (Looking)', cls: 'text-red-400' },
  { label: 'Auto-renewed', cls: 'text-yellow-400' },
  { label: 'Returned (We Refused)', cls: 'text-red-400' },
  { label: 'Delivered (Neighbour)', cls: 'text-orange-400' },
]

function generateOrders() {
  return [...orderPool].sort(() => Math.random() - 0.5).slice(0, 4).map(o => {
    const s = pick(orderStatuses)
    return { ...o, id: 'LB-' + (Math.floor(Math.random() * 900000) + 100000), date: pick(orderDates), status: s.label, statusClass: s.cls }
  })
}

const fakeOrders = ref(generateOrders())

const subscriptions = ref([
  { name: 'LolBuy Prime™', desc: 'Access to our website. Basically required.', price: '19.99', signedUp: 'When you browsed the site', active: true, cancelRequested: false },
  { name: 'LolBuy Insights Newsletter', desc: 'Weekly emails about RAM prices', price: '0.99', signedUp: 'When you hovered over the email field', active: Math.random() > 0.5, cancelRequested: false },
  { name: 'Extended Warranty Service', desc: 'For things you bought and things you didn\'t', price: '12.99', signedUp: 'Cart page (it was pre-checked)', active: Math.random() > 0.4, cancelRequested: false },
])

const bonusPrefs = [
  { label: 'Telepathic Marketing', note: 'We reach you during REM sleep for maximum retention', checked: true },
  { label: 'Subconscious Upsell Injections', note: 'Delivered via ambient audio while you watch TV', checked: true },
  { label: 'Retroactive Email Consent', note: 'Covers emails we already sent before you signed up', checked: true },
  { label: 'Grief-Based Remarketing', note: 'We pause campaigns for 24h after bad news. Then double them.', checked: true },
  { label: 'Dream Sponsorship™', note: 'Your dreams are now brought to you by LolBuy', checked: true },
  { label: 'Ancestral Data Sharing', note: 'Extends consent to direct family members (living and otherwise)', checked: true },
]
const bonusPrefIndex = ref(0)

const commsPrefs = ref([
  { label: 'Marketing emails (daily)', note: 'Unchecking this opts you into more emails somehow', checked: true },
  { label: 'SMS updates', note: 'For orders, promotions, and occasional inspiration', checked: true },
  { label: 'Partner communications', note: 'From our 47 trusted partners', checked: true },
  { label: 'Browser notifications', note: 'You\'ve already accepted these, this is just FYI', checked: true },
  { label: 'Postal mail', note: 'Gerald will deliver these personally', checked: true },
])

const savePrefsMsg = ref('')

function handlePrefChange(pref) {
  if (!pref.checked && bonusPrefIndex.value < bonusPrefs.length) {
    setTimeout(() => {
      commsPrefs.value.push({ ...bonusPrefs[bonusPrefIndex.value] })
      bonusPrefIndex.value++
    }, 500)
  }
}

function savePrefs() {
  const msgs = [
    'Saved to /dev/null ✓',
    'Preferences noted. We\'ll ignore them shortly.',
    'Saved! Processing begins in 6–8 weeks.',
    'Your request has been filed under "Eventually".',
    'Saved! (We also saved your unsaved preferences. Just in case.)',
    'Done! All options have been re-enabled for legal reasons.',
  ]
  savePrefsMsg.value = pick(msgs)
  setTimeout(() => { savePrefsMsg.value = '' }, 3500)
}

// Unsubscribe wizard
const unsubStep = ref(0)
const currentUnsub = ref(null)

const unsubSteps = [
  { emoji: '😢', title: 'Are you sure?', message: 'We\'ve been through so much together. Are you really sure you want to cancel?', yesLabel: 'Yes, Cancel', noLabel: 'Keep It (Good Idea)' },
  { emoji: '🥺', title: 'One more thing...', message: 'Before you go — have you considered that this subscription is actually really useful? Think about it.', yesLabel: 'Still Cancel', noLabel: 'You Know What, Fine' },
  { emoji: '📋', title: 'Reason for leaving?', message: 'We need to know why for legal purposes. Please call our retention team at 1-800-DON-TLEAVE (Mon-Fri, 9am-5pm, closed on Tuesdays).', yesLabel: 'Skip This Step', noLabel: 'Actually Keep It' },
  { emoji: '📧', title: 'Confirm via email', message: 'We\'ve sent a confirmation link to your email. And your backup email. And your emergency contact.', yesLabel: 'I\'ll Check Email', noLabel: 'Forget It, Keep It' },
  { emoji: '✅', title: 'Request submitted!', message: 'Your cancellation request has been submitted! Processing takes 6-8 weeks. You\'ll be charged in the meantime.', yesLabel: 'OK Fine', noLabel: 'OK Fine' },
]

const unsubStepData = computed(() => unsubSteps[unsubStep.value - 1] || unsubSteps[0])

function tryUnsubscribe(sub) {
  currentUnsub.value = sub
  unsubStep.value = 1
}

function resubscribe(sub) {
  sub.cancelRequested = false
  sub.active = true
}

function unsubNext() {
  if (unsubStep.value >= unsubSteps.length) {
    if (currentUnsub.value) {
      currentUnsub.value.cancelRequested = true
      currentUnsub.value.active = false
    }
    unsubStep.value = 0
  } else {
    unsubStep.value++
  }
}

function unsubCancel() {
  unsubStep.value = 0
}

function rerollUser() {
  userStore.reroll()
  loyaltyPoints.value = Math.floor(Math.random() * 50000) + 1000
  trustScore.value = Math.floor(Math.random() * 20) + 75
  fakeOrders.value = generateOrders()
  userBadge.value = pick(userBadges)
}

onMounted(() => {
  if (welcomeEl.value) {
    gsap.from(welcomeEl.value, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
  }
})
</script>
