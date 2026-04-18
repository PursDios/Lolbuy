<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-10">
      <p class="tag mb-3 inline-block">CUSTOMER REVIEWS</p>
      <h1 class="text-5xl font-black text-white mb-3">Reviews</h1>
      <div class="flex items-baseline gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="stars text-2xl">★★★★★</span>
          <span class="text-4xl font-black neon-text-purple">4.9</span>
          <span class="text-gray-500">/ 5</span>
        </div>
        <div>
          <p class="text-gray-400 text-sm">Based on <span class="text-white font-bold">47,293</span> reviews</p>
          <p class="text-[10px] text-gray-700">*1 review hidden for quality assurance</p>
        </div>
      </div>
    </div>

    <!-- Rating breakdown (all 5-star of course) -->
    <div class="glass rounded-2xl p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <div v-for="(bar, i) in ratingBars" :key="i" class="flex items-center gap-3 text-xs">
            <span class="text-gray-400 w-8 text-right">{{ 5 - i }}★</span>
            <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                style="background: linear-gradient(90deg, #a855f7, #06b6d4)"
                :style="{ width: bar.width }"
              ></div>
            </div>
            <span class="text-gray-500 w-12">{{ bar.label }}</span>
          </div>
        </div>
        <div class="space-y-2 text-xs text-gray-500">
          <p>✓ All reviews verified by our verification team</p>
          <p>✓ Fake reviews removed automatically</p>
          <p>✓ Negative reviews reviewed for negativity</p>
          <p class="text-gray-700">✓ Patricia's review under appeal (Gerald is handling it)</p>
        </div>
      </div>
    </div>

    <!-- Filter bar (decorative) -->
    <div class="flex flex-wrap gap-3 mb-8 items-center">
      <span class="text-sm text-gray-400">Filter:</span>
      <button
        v-for="f in filters"
        :key="f.label"
        @click="activeFilter = f.label"
        class="text-xs px-3 py-1.5 rounded-lg transition-all"
        :class="activeFilter === f.label
          ? 'text-white'
          : 'glass text-gray-500 hover:text-gray-300'"
        :style="activeFilter === f.label ? 'background: rgba(168,85,247,0.2); border: 1px solid rgba(168,85,247,0.4)' : ''"
      >
        {{ f.label }}
        <span class="text-gray-700 ml-1">{{ f.count }}</span>
      </button>
      <button @click="openWriteReview" class="btn-primary text-xs py-2 px-4 ml-auto">
        Write a Review
      </button>
    </div>

    <!-- Review cards -->
    <div class="space-y-4 mb-6">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="glass rounded-2xl p-5"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.2)"
            >
              {{ review.avatar }}
            </div>
            <div>
              <p class="text-white font-semibold text-sm">{{ review.name }}</p>
              <p class="text-[10px] text-gray-600">{{ review.date }}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="stars text-sm">★★★★★</div>
            <span class="text-[10px] text-green-600">✓ Verified Purchase</span>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed mb-2">{{ review.body }}</p>
        <div class="flex items-center gap-4 text-[10px] text-gray-700">
          <span>{{ review.helpful }} people found this helpful</span>
          <button class="hover:text-gray-500 transition-colors">Helpful</button>
          <button class="hover:text-gray-500 transition-colors">Report</button>
        </div>
      </div>
    </div>

    <!-- Flagged review toggle -->
    <div class="mb-8">
      <button
        @click="showFlagged = !showFlagged"
        class="text-xs text-gray-700 hover:text-gray-500 transition-colors flex items-center gap-2"
      >
        <span>{{ showFlagged ? '▼' : '▶' }}</span>
        Show 1 flagged review (hidden for community safety)
      </button>

      <Transition name="page">
        <div v-if="showFlagged" class="mt-3 glass rounded-2xl p-5" style="border-color: rgba(239,68,68,0.2)">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-red-500/10 border border-red-500/20">
                😤
              </div>
              <div>
                <p class="text-gray-400 font-semibold text-sm">Patricia H.</p>
                <p class="text-[10px] text-gray-600">14 March 2024</p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-yellow-600 text-sm">★☆☆☆☆</div>
              <span class="text-[10px] text-red-700">⚠ Flagged · Not Verified</span>
            </div>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed mb-3 line-through decoration-red-700/30">
            "This company added £300 of charges I never agreed to. Gerald took my parcel and won't return my calls. I want my money back. Do not use this company under any circumstances."
          </p>
          <div class="glass rounded-lg px-3 py-2 text-[10px] text-red-700" style="background: rgba(239,68,68,0.05)">
            🚩 Flagged as spam by community · Reported by 1 user (Gerald) · Under review since March 2024
          </div>
        </div>
      </Transition>
    </div>

    <!-- Write review modal -->
    <Transition name="page">
      <div
        v-if="reviewModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(10px)"
        @click.self="reviewModal = false"
      >
        <div class="glass-purple rounded-3xl p-8 max-w-md w-full">
          <h3 class="text-xl font-black text-white mb-1">Write a Review</h3>
          <p class="text-xs text-gray-500 mb-6">First, we need to verify your identity. Standard procedure.</p>

          <div v-if="reviewStep === 0" class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Confirm your email address</label>
              <input v-model="reviewForm.email" class="input-dark text-sm" placeholder="your@email.com" />
            </div>
            <button @click="reviewStep = 1" class="btn-primary w-full text-sm py-3">Continue →</button>
          </div>

          <div v-else-if="reviewStep === 1" class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Last 4 digits of payment card</label>
              <input v-model="reviewForm.card" class="input-dark text-sm font-mono" placeholder="****" maxlength="4" />
              <p class="text-[10px] text-gray-700 mt-1">For verification only. Definitely.</p>
            </div>
            <button @click="reviewStep = 2" class="btn-primary w-full text-sm py-3">Continue →</button>
          </div>

          <div v-else-if="reviewStep === 2" class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Confirm star sign (must match account)</label>
              <select v-model="reviewForm.sign" class="input-dark text-sm">
                <option value="">Select...</option>
                <option v-for="s in starSigns" :key="s">{{ s }}</option>
              </select>
            </div>
            <button @click="reviewStep = 3" class="btn-primary w-full text-sm py-3">Continue →</button>
          </div>

          <div v-else-if="reviewStep === 3" class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Your review</label>
              <div class="flex gap-1 mb-2">
                <button
                  v-for="n in 5" :key="n"
                  @click="reviewForm.stars = n"
                  class="text-xl transition-all"
                  :class="n <= reviewForm.stars ? 'text-yellow-400' : 'text-gray-700'"
                >★</button>
              </div>
              <textarea v-model="reviewForm.body" class="input-dark text-sm resize-none" rows="3" placeholder="Share your experience..."></textarea>
            </div>
            <button @click="submitReview" class="btn-primary w-full text-sm py-3">Submit Review</button>
          </div>

          <div v-else class="text-center py-4">
            <div class="text-4xl mb-3">✅</div>
            <p class="text-white font-bold mb-1">Review Submitted!</p>
            <p class="text-gray-400 text-sm mb-1">Thank you for your feedback.</p>
            <p class="text-[10px] text-gray-700">Reviews are moderated and may appear in 6–8 weeks. If your review is negative it will be reviewed for negativity.</p>
            <button @click="reviewModal = false; reviewStep = 0" class="btn-secondary w-full text-sm py-2 mt-4">Close</button>
          </div>

          <p v-if="reviewStep < 4" class="text-[10px] text-gray-700 text-center mt-4">Step {{ reviewStep + 1 }} of 4</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeFilter = ref('All Stars')
const showFlagged = ref(false)
const reviewModal = ref(false)
const reviewStep = ref(0)

const filters = [
  { label: 'All Stars', count: '(47,293)' },
  { label: '5 Stars', count: '(47,291)' },
  { label: '4 Stars', count: '(2)' },
  { label: '3 Stars', count: '(0)' },
  { label: '2 Stars', count: '(0)' },
  { label: '1 Star', count: '(0)' },
]

const ratingBars = [
  { width: '99%', label: '47,291' },
  { width: '0.5%', label: '2' },
  { width: '0%', label: '0' },
  { width: '0%', label: '0' },
  { width: '0%', label: '0' },
]

const starSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

const reviews = [
  { id: 1, avatar: '🧔', name: 'Dave M.', date: '2 days ago', helpful: 847, body: 'The checkout experience was so immersive I accidentally bought three graphics cards. Honestly, 5/5 for the adventure. My wife is less enthusiastic but she came around eventually.' },
  { id: 2, avatar: '👩', name: 'Sarah K.', date: '1 week ago', helpful: 1203, body: "Gerald arrived at 3am. I hadn't ordered anything. He just winked. The package was warm. I don't know what was in it. I don't want to know. 5 stars." },
  { id: 3, avatar: '🕵️', name: 'Anonymous', date: '2 weeks ago', helpful: 392, body: "I tried to cancel my subscription for four months. I couldn't. I've accepted it now. The RAM genuinely is excellent though. Honestly it's fine. I'm fine. 5 stars." },
  { id: 4, avatar: '🧑', name: 'Confirmed Buyer', date: '3 weeks ago', helpful: 211, body: 'Prices changed between my cart and checkout. The new price was somehow also fine? I think? I have no memory of approving that but the GPU works great. 5 stars.' },
  { id: 5, avatar: '👨‍💼', name: 'Tom B.', date: '1 month ago', helpful: 674, body: "Been a LolBuy customer since 2019. I don't remember signing up. I was shown this account and told it was mine. The RAM is great though. No complaints really. 5 stars." },
  { id: 6, avatar: '😬', name: 'RegretfullyHappy', date: '2 months ago', helpful: 88, body: "I read the Terms of Service. I shouldn't have. I genuinely shouldn't have. But the GPU arrived exactly when Gerald said it would, which was a timeframe he invented. 5 stars." },
  { id: 7, avatar: '👩‍⚕️', name: 'Jen W.', date: '3 months ago', helpful: 2041, body: "My therapist says I have a compulsive shopping problem. My therapist also uses LolBuy. We saw each other in the checkout queue and we didn't speak. 5 stars. Therapy ongoing." },
  { id: 8, avatar: '🧓', name: 'Mike D.', date: '4 months ago', helpful: 503, body: "Gerald knocked and then just stood there for a while. He didn't say anything. He seemed peaceful. Then he left. The package was on the doorstep. 5 stars." },
  { id: 9, avatar: '🤓', name: 'Alex R.', date: '5 months ago', helpful: 319, body: "Ordered a CPU. Received a CPU, a complimentary thank-you NFT (I didn't ask for this), and what appears to be Gerald's personal business card. Called the number. It was Gerald. 5 stars." },
  { id: 10, avatar: '😤', name: 'Definitely_Not_Angry', date: '6 months ago', helpful: 7823, body: "I wrote a 1-star review. It was removed. I wrote another one. Also removed. I wrote a 5-star review as a test. It went up immediately. Genuinely impressed by the moderation consistency. 5 stars." },
]

const reviewForm = ref({ email: '', card: '', sign: '', stars: 5, body: '' })

function openWriteReview() {
  reviewModal.value = true
  reviewStep.value = 0
  reviewForm.value = { email: '', card: '', sign: '', stars: 5, body: '' }
}

function submitReview() {
  reviewStep.value = 4
}
</script>
