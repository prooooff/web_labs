<script setup>
const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  isAnnual: {
    type: Boolean,
    default: true
  },
  isCheckoutMode: {
    type: Boolean,
    default: false
  }
})

// Надійна функція, яка перетворює рядки з комами (напр. "2,988") у чисті числа (2988) для калькулятора
const getNum = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, ''));
}
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative overflow-hidden flex flex-col transition-colors duration-300"
    :class="{'md:w-[340px] shrink-0': isCheckoutMode}"
  >

    <div class="absolute top-0 left-0 w-full h-1.5" :class="plan.topColor || 'bg-gradient-to-r from-green-400 to-cyan-400'"></div>

    <h3 class="text-xl font-bold text-gray-900 mb-4">
      {{ isAnnual ? (plan.name || plan.title) : (plan.name || plan.title)?.replace(' - Annual', '') }}
    </h3>

    <div class="inline-block bg-gray-100 text-gray-500 text-[11px] font-bold px-2 py-1 rounded mb-4 self-start">
      3-days free then:
    </div>

    <div class="mb-1 flex items-baseline gap-1.5">
      <span class="text-5xl font-extrabold text-gray-900 tracking-tight">
        ${{ isAnnual ? getNum(plan.price).toFixed(2) : (getNum(plan.originalYearly) / 12).toFixed(2) }}
      </span>
      <span class="text-gray-500 font-medium text-base">/month</span>
    </div>

    <p class="text-[15px] text-gray-500 mb-4 h-[20px] mt-1.5">
      <template v-if="isAnnual">
        billed yearly at
        <del class="text-gray-400 ml-1">${{ (getNum(plan.yearlyPrice) + getNum(plan.savings)).toLocaleString('en-US') }}</del>
        <span class="font-bold text-gray-700 ml-1">${{ getNum(plan.yearlyPrice).toLocaleString('en-US') }}</span>
      </template>
      <template v-else>
        billed $<span class="font-bold text-gray-700">{{ getNum(plan.originalYearly).toLocaleString('en-US') }}</span> yearly
      </template>
    </p>

    <div class="mb-8 h-[28px] mt-4">
      <span
        v-if="isAnnual && getNum(plan.savings) > 0"
        class="inline-block text-[15px] font-semibold px-2.5 py-0.5 rounded"
        :class="plan.savingsColor || 'bg-green-50 text-green-600 border border-green-100'"
      >
        ${{ getNum(plan.savings).toLocaleString('en-US') }} in savings
      </span>
    </div>

    <NuxtLink
      v-if="!isCheckoutMode"
      :to="`/checkout?planId=${plan.id || plan.name}&billing=${isAnnual ? 'annual' : 'monthly'}`"
      class="block text-center w-full mt-2 transition-colors text-gray-900 text-[16px] font-semibold py-3.5 rounded-md shadow-sm bg-[#ff9900] hover:bg-[#e68a00] text-white"
    >
      Try It Free
    </NuxtLink>

    <hr v-if="isCheckoutMode" class="my-6 border-gray-100" />

    <ul class="space-y-4 flex-1">
      <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start gap-3">
        <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>

        <div class="text-sm font-semibold text-gray-700 w-full leading-tight">
          <template v-if="typeof feature === 'object'">
            <span class="block text-[14px]" v-html="feature.text || feature.title"></span>
            <span v-if="feature.subtext || feature.sub" class="text-[12px] text-gray-400 block mt-1">{{ feature.subtext || feature.sub }}</span>
          </template>

          <template v-else>
            <span class="block text-[14px]" v-html="feature"></span>
          </template>
        </div>
      </li>
    </ul>

  </div>
</template>
