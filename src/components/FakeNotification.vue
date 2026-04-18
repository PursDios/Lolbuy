<template>
  <Teleport to="body">
    <div class="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-xs pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="glass rounded-xl p-3 flex items-start gap-3 pointer-events-auto"
          style="border-color: rgba(168, 85, 247, 0.3)"
        >
          <span class="text-xl flex-shrink-0">🔥</span>
          <div>
            <p class="text-xs text-gray-300 leading-tight">{{ notif.message }}</p>
            <p class="text-[10px] text-gray-600 mt-1">{{ notif.time }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fakePurchaseNotifications } from '../data/products.js'
import { products } from '../data/products.js'

const notifications = ref([])
let timer = null
let idCounter = 0

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomTime() {
  const secs = Math.floor(Math.random() * 59) + 1
  if (secs < 5) return 'just now'
  return `${secs} seconds ago`
}

function addNotification() {
  const product = pick(products)
  const message = `${pick(fakePurchaseNotifications)}: ${product.name}`
  const notif = {
    id: idCounter++,
    message,
    time: randomTime(),
  }
  notifications.value.push(notif)
  if (notifications.value.length > 3) {
    notifications.value.shift()
  }
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== notif.id)
  }, 5000)
}

onMounted(() => {
  setTimeout(addNotification, 2000)
  timer = setInterval(addNotification, 7000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
