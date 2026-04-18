<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <div class="mb-10">
      <p class="tag mb-3 inline-block">HELP & SUPPORT</p>
      <h1 class="text-5xl font-black text-white mb-3">Contact Us</h1>
      <p class="text-gray-500">We're here for you. Gerald, however, is not.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- Card A: Live Support -->
      <div class="glass rounded-2xl p-8 flex flex-col">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-2xl">💬</span>
          <h2 class="text-xl font-black text-white">Live Support</h2>
          <span
            class="text-xs font-mono px-2 py-1 rounded-full transition-all duration-500"
            :class="isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'"
          >
            {{ isOnline ? '🟢 ONLINE' : '🔴 OFFLINE' }}
          </span>
        </div>

        <div class="flex-1">
          <div class="glass rounded-xl p-5 mb-5" style="background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.15)">
            <p class="text-2xl mb-3">🏖️</p>
            <p class="text-white font-semibold text-sm mb-1">Our Representative is Unavailable</p>
            <p class="text-gray-400 text-sm mb-3">{{ geraldStatus }}</p>
            <p class="text-[10px] text-gray-700">Expected return: <span class="text-gray-600">unclear</span></p>
          </div>

          <div class="space-y-2 text-xs text-gray-600 mb-6">
            <p>📞 Phone: 1-800-GER-ALDO <span class="text-gray-700">(rings Gerald's personal mobile, which is off)</span></p>
            <p>📧 Email: support@lolbuy.com <span class="text-gray-700">(Gerald monitors this when he's in the country)</span></p>
            <p>💬 Live chat: see above</p>
          </div>

          <div v-if="!geraldMessageSent">
            <button
              v-if="!showGeraldInput"
              @click="showGeraldInput = true"
              class="btn-secondary w-full text-sm py-3"
            >
              Leave Gerald a Message
            </button>
            <div v-else class="space-y-3">
              <textarea
                v-model="geraldMessage"
                class="input-dark text-sm resize-none"
                rows="3"
                placeholder="Type your message for Gerald..."
              ></textarea>
              <button @click="sendGeraldMessage" class="btn-primary w-full text-sm py-3">
                Send to Gerald
              </button>
            </div>
          </div>
          <div v-else class="glass rounded-xl p-4 text-center">
            <p class="text-green-400 text-sm font-semibold mb-1">✓ Message delivered</p>
            <p class="text-gray-500 text-xs">Gerald will see this when he returns.</p>
            <p class="text-gray-700 text-[10px] mt-1">Estimated response time: eventually.</p>
          </div>
        </div>
      </div>

      <!-- Card B: Contact Form -->
      <div class="glass rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-2xl">📋</span>
          <h2 class="text-xl font-black text-white">Send Us a Message</h2>
        </div>

        <div v-if="!formSubmitted" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Full Name <span class="text-red-400">*</span></label>
              <input v-model="form.name" class="input-dark text-sm" placeholder="Your legal name" />
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Email</label>
              <input v-model="form.email" class="input-dark text-sm" placeholder="your@email.com" />
              <p class="text-[10px] text-gray-700 mt-0.5">We already have this. Just confirming.</p>
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Subject <span class="text-red-400">*</span></label>
            <select v-model="form.subject" class="input-dark text-sm">
              <option value="">Select a subject...</option>
              <option>I have a complaint</option>
              <option>I have a question</option>
              <option>I accept everything is my fault</option>
              <option>I just wanted to say hi (not recommended)</option>
              <option>Other (we won't read this)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Blood Type <span class="text-red-400">*</span></label>
              <select v-model="form.bloodType" class="input-dark text-sm">
                <option value="">Select...</option>
                <option v-for="bt in bloodTypes" :key="bt">{{ bt }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Star Sign <span class="text-red-400">*</span></label>
              <select v-model="form.starSign" class="input-dark text-sm">
                <option value="">Select...</option>
                <option v-for="s in starSigns" :key="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Order Number</label>
              <input v-model="form.orderNum" class="input-dark text-sm font-mono" placeholder="LB-XXXXXX" />
              <p class="text-[10px] text-gray-700 mt-0.5">Don't have one? Invent one.</p>
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Shoe Size (EU) <span class="text-red-400">*</span></label>
              <input v-model="form.shoeSize" class="input-dark text-sm" placeholder="e.g. 42" type="number" />
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Message <span class="text-red-400">*</span></label>
            <textarea
              v-model="form.message"
              class="input-dark text-sm resize-none"
              rows="3"
              maxlength="50"
              placeholder="Describe your issue..."
            ></textarea>
            <p class="text-[10px] text-gray-700 mt-0.5">{{ form.message.length }}/50 characters. We read the first 3 words.</p>
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-2 block">
              Response Urgency
              <span class="text-gray-700 ml-1">— All enquiries processed identically regardless of this.</span>
            </label>
            <input type="range" min="1" max="5" v-model="form.urgency" class="w-full accent-purple-500" />
            <div class="flex justify-between text-[10px] text-gray-700 mt-0.5">
              <span>Not urgent</span><span>Quite urgent</span><span>EXTREMELY URGENT</span>
            </div>
          </div>

          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.notRobot" @change="onNotRobot" class="w-4 h-4 accent-purple-500" />
            <span class="text-sm text-gray-300">{{ robotLabel }}</span>
          </label>

          <button @click="submitForm" class="btn-primary w-full py-3 font-bold text-sm">
            {{ submitLabel }}
          </button>
          <p class="text-[10px] text-gray-700 text-center">Response time: 6–8 weeks. Possibly longer during Gerald's holidays.</p>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-5xl mb-4">📬</div>
          <h3 class="text-xl font-black text-white mb-2">Message Received</h3>
          <p class="text-gray-400 text-sm mb-1">Your enquiry has been logged.</p>
          <p class="text-gray-600 text-xs mb-4">Reference: <span class="font-mono text-gray-500">TKT-{{ ticketNum }}</span></p>
          <div class="glass rounded-xl p-4 text-left space-y-1 text-xs text-gray-500">
            <p>✓ Assigned to: <span class="text-gray-400">Unassigned</span></p>
            <p>✓ Priority: <span class="text-gray-400">{{ urgencyLabel }}</span></p>
            <p>✓ Expected response: <span class="text-gray-400">6–8 weeks</span></p>
            <p>✓ Gerald notified: <span class="text-red-500">No</span></p>
          </div>
        </div>
      </div>

    </div>

    <!-- FAQ teaser -->
    <div class="mt-10 glass rounded-2xl p-6 text-center">
      <p class="text-gray-400 text-sm mb-1">Before contacting us, have you tried not contacting us?</p>
      <p class="text-gray-600 text-xs">Most issues resolve themselves in 6–8 weeks. Gerald finds this to be true.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isOnline = ref(true)
const showGeraldInput = ref(false)
const geraldMessage = ref('')
const geraldMessageSent = ref(false)
const formSubmitted = ref(false)
const submitLabel = ref('Submit Enquiry')
const ticketNum = ref(Math.floor(Math.random() * 900000) + 100000)
const robotLabel = ref('I am definitely not a robot')

const geraldReasons = [
  'Gerald is on holiday in Barbados (Week 3 of 2).',
  'Gerald is competing in a regional pie-eating contest.',
  "Gerald is at his nephew Darren's recorder recital.",
  "Gerald is getting his van serviced.",
  "Gerald is taking a mental health day (his 47th this year).",
  "Gerald is watching the match. Please do not disturb.",
  "Gerald is currently delivering someone else's package. Not yours.",
  "Gerald is at a conference about Gerald.",
  "Gerald has stepped away from his desk. His desk has also stepped away.",
  "Gerald is on a silent retreat. He isn't, but that's what he told us.",
]

const geraldStatus = ref(geraldReasons[Math.floor(Math.random() * geraldReasons.length)])

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const starSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

const form = ref({
  name: '', email: '', subject: '', bloodType: '', starSign: '',
  orderNum: '', shoeSize: '', message: '', urgency: 3, notRobot: false,
})

const urgencyLabel = computed(() => {
  const labels = ['', 'Low', 'Low', 'Normal', 'Normal', 'CRITICAL (ignored)']
  return labels[form.value.urgency] || 'Normal'
})

function onNotRobot() {
  if (form.value.notRobot) robotLabel.value = 'Noted. (This changes nothing.)'
}

function sendGeraldMessage() {
  geraldMessageSent.value = true
}

function submitForm() {
  submitLabel.value = 'Submitted. Gerald has been notified.'
  setTimeout(() => {
    submitLabel.value = "(He hasn't.)"
    setTimeout(() => { formSubmitted.value = true }, 1200)
  }, 1500)
}

onMounted(() => {
  setTimeout(() => { isOnline.value = false }, 300)
})
</script>
