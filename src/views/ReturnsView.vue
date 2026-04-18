<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Hero -->
    <div class="mb-10">
      <p class="tag mb-3 inline-block">RETURNS & REFUNDS</p>
      <h1 class="text-5xl font-black text-white mb-3">30-Day Hassle-Free Returns™<span class="text-neon-purple">*</span></h1>
      <p class="text-gray-500 text-sm max-w-xl">
        We stand behind every product we sell. We stand very far behind them, in a different room, but we are there.
      </p>
      <p class="text-[11px] text-gray-700 mt-2">
        *Hassle not included. "Free" refers to the spirit of the return, not its cost. 30 days counted from date of manufacture, not date of purchase.
        "Hassle-Free" is a registered trademark and does not imply an absence of hassle.
      </p>
    </div>

    <!-- How it works -->
    <div class="glass rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-black text-white mb-5">How It Works</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div v-for="(step, i) in steps" :key="i" class="text-center">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
            style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2)"
          >
            {{ step.icon }}
          </div>
          <p class="text-xs font-semibold text-white mb-1">{{ i + 1 }}. {{ step.title }}</p>
          <p class="text-[10px] text-gray-600">{{ step.note }}</p>
        </div>
      </div>
    </div>

    <!-- Eligibility checker -->
    <div class="glass rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-black text-white mb-2">Am I Eligible?</h2>
      <p class="text-xs text-gray-500 mb-6">Use our interactive eligibility checker to find out in seconds.</p>

      <div v-if="flowStep === null" class="text-center py-4">
        <button @click="flowStep = 0" class="btn-primary text-sm py-3 px-8">
          Check My Eligibility
        </button>
      </div>

      <div v-else-if="!flowResult" class="space-y-4">
        <div class="glass rounded-xl p-5" style="background: rgba(168,85,247,0.04)">
          <p class="text-white font-semibold mb-4">{{ flowQuestions[flowStep].question }}</p>
          <div class="flex gap-3">
            <button
              @click="answerFlow(true)"
              class="btn-secondary flex-1 text-sm py-2"
            >Yes</button>
            <button
              @click="answerFlow(false)"
              class="btn-secondary flex-1 text-sm py-2"
            >No</button>
          </div>
        </div>
        <p class="text-[10px] text-gray-700 text-center">Question {{ flowStep + 1 }} of {{ flowQuestions.length }}</p>
      </div>

      <div v-else class="glass rounded-xl p-6 text-center" style="background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2)">
        <div class="text-4xl mb-3">❌</div>
        <h3 class="text-lg font-black text-red-400 mb-2">Not Eligible</h3>
        <p class="text-gray-400 text-sm mb-3">{{ flowResult }}</p>
        <button @click="resetFlow" class="text-xs text-gray-700 hover:text-gray-500 transition-colors">Try again (result will be the same)</button>
      </div>
    </div>

    <!-- Policy highlights -->
    <div class="glass rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-black text-white mb-5">Return Policy Highlights</h2>
      <div class="space-y-3">
        <div v-for="policy in policies" :key="policy.title" class="flex gap-3 items-start">
          <span class="text-lg flex-shrink-0">{{ policy.icon }}</span>
          <div>
            <p class="text-sm font-semibold text-white">{{ policy.title }}</p>
            <p class="text-xs text-gray-500">{{ policy.detail }}</p>
            <p v-if="policy.catch" class="text-[10px] text-gray-700 mt-0.5">{{ policy.catch }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Still think you're eligible accordion -->
    <div class="glass rounded-2xl overflow-hidden mb-8">
      <button
        @click="showStillEligible = !showStillEligible"
        class="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors"
      >
        <span class="font-bold text-white">Still think you're eligible?</span>
        <span class="text-gray-500 transition-transform duration-300" :class="showStillEligible ? 'rotate-180' : ''">▼</span>
      </button>
      <Transition name="page">
        <div v-if="showStillEligible" class="px-6 pb-6 space-y-3 text-sm text-gray-400">
          <p>We appreciate your confidence. Here are your next steps:</p>
          <p>📞 <strong class="text-white">Phone:</strong> 1-800-NOT-ELGB (Mon–Fri 9–5, closed Tuesdays, Wednesdays during summer, and the third Thursday of any month containing the letter R)</p>
          <p>📧 <strong class="text-white">Email:</strong> returns@lolbuy.com — Gerald monitors this inbox when he is in the country. Response time: 6–8 weeks.</p>
          <p>📮 <strong class="text-white">Post:</strong> Write your complaint on paper and mail it to LolBuy HQ. Address available upon written request.</p>
          <p class="text-[10px] text-gray-700 pt-2">Please note: contacting us about eligibility does not affect your eligibility determination. Nothing does.</p>
        </div>
      </Transition>
    </div>

    <!-- Footer note -->
    <div class="text-center">
      <p class="text-gray-700 text-xs">LolBuy processes thousands of returns every year. Zero have been approved. We find this to be a remarkable streak.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const flowStep = ref(null)
const flowResult = ref('')
const showStillEligible = ref(false)

const steps = [
  { icon: '🔍', title: 'Check Eligibility', note: 'Use our checker below. Spoiler enclosed.' },
  { icon: '📦', title: 'Original Packaging', note: 'We recycled yours at checkout as a sustainability initiative.' },
  { icon: '🖨️', title: 'Print Return Label', note: '$29.99. Non-refundable.' },
  { icon: '🏃', title: 'Drop Off With Gerald', note: "Gerald's location varies. He'll find you." },
  { icon: '⏳', title: 'Await Confirmation', note: '6–8 weeks. Then another 6–8 weeks.' },
  { icon: '💸', title: 'Receive Refund', note: 'Partial. If eligible. See above re: eligibility.' },
]

const flowQuestions = [
  {
    question: 'Was the item unopened when you decided to return it?',
    yes: 1,
    no: 'notEligible',
    noReason: 'Opened items fall under our Digital Experience Policy (Section 12, Subsection F). Once a product has been "experienced," it cannot be returned. Not eligible.',
  },
  {
    question: 'Are you returning it within 30 days of purchase?',
    yes: 2,
    no: 'notEligible',
    noReason: 'Our 30-day returns window has passed. This window is counted in business days, excluding weekends, bank holidays, and any day Gerald is unavailable. Not eligible.',
  },
  {
    question: 'Do you have the original packaging?',
    yes: 3,
    no: 'notEligible',
    noReason: 'Items must be returned in original packaging. As noted in your dispatch email (Section 3), we recycled your packaging on your behalf as part of our EcoLolBuy™ initiative. Not eligible.',
  },
  {
    question: 'Did you have any intention of returning the item before purchasing it?',
    yes: 'notEligible',
    yesReason: 'Advance return intent constitutes a breach of our Good Faith Purchasing Agreement (Terms, Section 47b). Purchasing with intent to return is classified as Speculative Acquisition. Not eligible.',
    no: 4,
  },
  {
    question: 'Has the item been exposed to air, light, or gravity since delivery?',
    yes: 'notEligible',
    yesReason: 'Items exposed to standard atmospheric conditions are classified as "environmentally integrated" and are no longer eligible for return under our Environmental Integration Clause. Not eligible.',
    no: 'notEligible',
    noReason: "Items that haven't been exposed to air or light are classified as potentially hazardous and cannot be accepted back into our warehouse. Not eligible.",
  },
]

function answerFlow(answer) {
  const q = flowQuestions[flowStep.value]
  const outcome = answer ? q.yes : q.no
  if (outcome === 'notEligible') {
    flowResult.value = answer ? (q.yesReason || q.noReason) : (q.noReason || q.yesReason)
  } else {
    flowStep.value = outcome
  }
}

function resetFlow() {
  flowStep.value = 0
  flowResult.value = ''
}

const policies = [
  {
    icon: '📅',
    title: '30-Day Return Window',
    detail: 'Return any item within 30 days of purchase for a full refund.',
    catch: 'Window begins at date of manufacture. Full refund subject to restocking fee, inspection fee, Gerald\'s assessment, and general conditions.',
  },
  {
    icon: '📦',
    title: 'Original Packaging Required',
    detail: 'Items must be returned in original, undamaged packaging.',
    catch: "Packaging is removed and recycled by LolBuy at point of dispatch. Replacement packaging available for $18.99.",
  },
  {
    icon: '🚚',
    title: 'Free Return Shipping',
    detail: 'We cover the cost of return shipping on eligible items.',
    catch: '"Free" return label: $29.99. "Eligible items": none confirmed to date.',
  },
  {
    icon: '💳',
    title: 'Refund to Original Payment Method',
    detail: 'Approved refunds are returned to your original payment method within 5–10 days.',
    catch: 'Minus restocking fee (15%), inspection fee ($12.99), and a small administrative contribution to Gerald\'s pension.',
  },
  {
    icon: '🎁',
    title: 'Surprise Items Are Non-Returnable',
    detail: 'Items added to your order by LolBuy are considered gifts and cannot be returned.',
    catch: 'You are still charged for these.',
  },
]
</script>
