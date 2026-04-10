<script setup>
// Приймаємо стан перемикача з головної сторінки
const props = defineProps({
  isAnnual: {
    type: Boolean,
    default: true
  }
})

// Функція для очищення чисел від ком (напр. "1,188" -> 1188)
const getNum = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, ''));
}


const plans = [
  {
    id: 1,
    name: 'Starter - Annual',
    price: '83.25',
    originalPrice: '1,188',
    yearlyPrice: '999',
    savings: '189',
    topColor: 'bg-emerald-400',
    savingsColor: 'bg-emerald-100 text-emerald-700',
    features: [
      { text: 'Primary user only', subtext: '(extra team members for $35/month)' },
      { text: 'Save unlimited properties' },
      { text: '10,000 exports', subtext: '(additional exports at $0.02 each)' },
      { text: '500 free skip traces', subtext: '(additional skip tracing at $0.08 each)' },
      { text: 'Imports $0.01' }
    ]
  },
  {
    id: 2,
    name: 'Team - Annual',
    price: '207.50',
    originalPrice: '2,988',
    yearlyPrice: '2,490',
    savings: '498',
    topColor: 'bg-teal-400',
    savingsColor: 'bg-green-100 text-green-700',
    features: [
      { text: 'Primary user + 2 free team members', subtext: '(extra team members for $25/month)' },
      { text: 'Save unlimited properties' },
      { text: '50,000 exports', subtext: '(additional exports at $0.01 each)' },
      { text: '1,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)' },
      { text: 'Imports $0.01', subtext: '' },
      { text: 'FREE daily product trainings and support' },
      { text: 'Full suite of next-gen investing tools' },
      { text: 'Industry first AI powered comp tool' },
      { text: 'Includes dedicated support agent' }
    ]
  },
  {
    id: 3,
    name: 'Business - Annual',
    price: '457.50',
    originalPrice: '6,588',
    yearlyPrice: '5,490',
    savings: '1,098',
    topColor: 'bg-cyan-400',
    savingsColor: 'bg-cyan-100 text-cyan-700',
    features: [
      { text: 'Primary user + 6 free team members', subtext: '(extra team members for $20/month)' },
      { text: 'Save unlimited properties' },
      { text: '100,000 exports', subtext: '(additional exports at $0.01 each)' },
      { text: '2,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)' },
      { text: 'Imports $0.01' }
    ]
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-20 font-sans">
    <div
      v-for="plan in plans"
      :key="plan.name"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
    >
      <div class="absolute top-0 left-0 w-full h-1.5" :class="plan.topColor"></div>

      <h3 class="text-xl font-bold text-gray-900 mb-4 transition-colors">
        {{ isAnnual ? plan.name : plan.name.replace(' - Annual', '') }}
      </h3>

      <div class="inline-block bg-gray-100 text-gray-500 text-[11px] font-bold px-2 py-1 rounded mb-4 self-start">
        3-days free then:
      </div>

      <div class="mb-1">
        <span class="text-5xl font-extrabold text-gray-900 tracking-tight">
          ${{ isAnnual ? plan.price : (getNum(plan.originalPrice) / 12).toFixed(2) }}
        </span>
        <span class="text-gray-500 font-medium text-base">/month</span>
      </div>

      <p class="text-sm text-gray-500 mb-4 h-[20px] mt-1.5">
        <template v-if="isAnnual">
          billed yearly at <del class="text-gray-400">${{ plan.originalPrice }}</del> <span class="font-bold text-gray-700">${{ plan.yearlyPrice }}</span>
        </template>
        <template v-else>
          billed $<span class="font-bold text-gray-700">{{ plan.originalPrice }}</span> yearly
        </template>
      </p>

      <div class="mb-8 h-[28px]">
        <span
          v-if="isAnnual"
          class="inline-block text-xs font-bold px-3 py-1.5 rounded-md"
          :class="plan.savingsColor"
        >
          ${{ plan.savings }} in savings
        </span>
      </div>

      <NuxtLink
        :to="`/checkout?planId=${plan.id}&billing=${isAnnual ? 'annual' : 'monthly'}`"
        class="block w-full text-center py-3 bg-[#ff9900] hover:bg-[#e68a00] text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 mb-8 shadow-sm"
      >
        Try It Free
      </NuxtLink>

      <ul class="space-y-4 flex-1">
        <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start gap-3">
          <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <span class="text-sm font-semibold text-gray-700 block leading-tight">{{ feature.text }}</span>
            <span v-if="feature.subtext" class="text-xs text-gray-400 block mt-1">{{ feature.subtext }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
