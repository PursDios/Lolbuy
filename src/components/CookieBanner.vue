<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed bottom-6 right-6 z-[200] max-w-sm glass rounded-2xl p-5"
        style="border-color: rgba(168, 85, 247, 0.3)"
      >
        <div class="flex items-start gap-3 mb-4">
          <span class="text-2xl">🍪</span>
          <div>
            <h3 class="font-bold text-white text-sm mb-1">We Use Cookies!</h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              We use cookies to enhance your experience, track your every move, sell your data to seventeen different companies,
              and remember your name is {{ userName }}. You definitely consent to all of this.
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="acceptAll"
            class="btn-primary text-xs py-2 px-3 flex-1"
          >
            Accept Everything Forever
          </button>
          <button
            @click="acceptAll"
            class="btn-secondary text-xs py-2 px-3 flex-1"
          >
            Accept
          </button>
        </div>
        <p class="text-[10px] text-gray-700 mt-2 text-center">
          By clicking anything you also agree to receive emails forever. There is no unsubscribe.
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const visible = ref(false)
const userName = ref(userStore.firstName)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 1500)
})

function acceptAll() {
  visible.value = false
}
</script>
