<template>
  <Teleport to="body">
    <Transition name="page">
      <div
        v-if="visible"
        class="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);"
      >
        <div class="glass-purple rounded-3xl p-8 max-w-md w-full text-center relative" ref="modal">
          <!-- Tiny, misaligned close button -->
          <button
            @click="dismiss"
            class="absolute text-gray-700 hover:text-gray-500 text-[9px] transition-colors"
            style="top: 4px; right: 7px; font-size: 8px;"
            title="close (good luck finding this)"
          >
            ×
          </button>

          <div class="text-6xl mb-4 animate-bounce">😢</div>
          <h2 class="text-2xl font-black text-white mb-2">WAIT! Don't Go!</h2>
          <p class="text-gray-400 text-sm mb-2">
            Our servers will <span class="text-neon-purple font-semibold">literally cry</span> if you leave.
          </p>
          <p class="text-gray-500 text-xs mb-6">
            {{ userStore.firstName }}, we've been building a relationship here. Years of trust. Well, {{ minutesOnSite }} minutes of trust. That's basically the same.
          </p>

          <div class="glass rounded-2xl p-4 mb-6 text-left">
            <p class="text-xs text-gray-400 mb-2 font-semibold">As a "please stay" gift, here's 5% off:</p>
            <div class="flex gap-2 items-center">
              <code class="text-neon-cyan text-sm font-mono flex-1 text-center py-1 rounded"
                style="background: rgba(6,182,212,0.1); border: 1px dashed rgba(6,182,212,0.3)">
                DONTLEAVE5
              </code>
              <button
                @click="copyCode"
                class="text-xs btn-secondary py-1 px-2"
              >{{ copied ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <p class="text-[10px] text-gray-700 mt-1">*5% off your next order of $10,000 or more. One per lifetime. Non-transferable. We reserve the right to revoke this at any time for any reason including "we felt like it."</p>
          </div>

          <div class="flex gap-3">
            <button @click="dismiss" class="btn-primary flex-1">
              OK Fine, I'll Stay 😊
            </button>
            <button
              @click="dismiss"
              class="text-xs text-gray-700 hover:text-gray-600 flex-1 transition-colors"
            >
              leave (you monster)
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const visible = ref(false)
const copied = ref(false)
const minutesOnSite = ref(Math.floor(Math.random() * 4) + 1)
const shown = ref(false)

function handleMouseLeave(e) {
  if (e.clientY <= 0 && !shown.value) {
    shown.value = true
    visible.value = true
  }
}

function dismiss() {
  visible.value = false
}

function copyCode() {
  navigator.clipboard.writeText('DONTLEAVE5').catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(() => {
  document.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  document.removeEventListener('mouseleave', handleMouseLeave)
})
</script>
