<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '~/stores/useSubscriptionStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

useHead({
  title: 'Checkout | Оплата підписки'
})

const store = useSubscriptionStore()
const router = useRouter()


const { selectedPlan: plan, isAnnualBilling: isAnnual } = storeToRefs(store)


onMounted(() => {
  if (!plan.value) {
    router.push('/')
  }
})

const form = ref({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: '',
  address: '',
  consent: false
})

const isSubmitting = ref(false)

const getNum = (val) => Number(String(val || 0).replace(/,/g, ''))

// Перерахунок суми залишається без змін, бо змінні plan і isAnnual зберегли свої імена
const orderTotal = computed(() => {
  if (!plan.value) return 0
  return isAnnual.value
    ? getNum(plan.value.yearlyPrice)
    : getNum(plan.value.originalYearly || plan.value.originalPrice)
})

const formatCardNumber = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  form.value.cardNumber = val.match(/.{1,4}/g)?.join(' ') || val
}

const formatExpiry = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  if (val.length >= 2) {
    val = val.substring(0, 2) + ' / ' + val.substring(2, 4)
  }
  form.value.expiry = val
}

const formatCVC = (e) => {
  form.value.cvc = e.target.value.replace(/\D/g, '').substring(0, 4)
}

const submitForm = async () => {
  if (!form.value.consent) return
  isSubmitting.value = true
  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: {
        ...form.value,
        planName: plan.value.name, // Додано ім'я плану для API
        billing: isAnnual.value ? 'annual' : 'monthly'
      }
    })
    alert(response?.message || 'Success!')
  } catch (error) {
    alert('Помилка сервера. Спробуйте пізніше.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="plan" class="min-h-screen bg-white dark:bg-[#121212] pb-12 font-sans transition-colors duration-300">
    <div class="bg-[#333333] dark:bg-black text-white text-center py-4 text-lg font-bold mb-8 shadow-md">
      Checkout
    </div>

    <div class="max-w-[1000px] mx-auto px-4">
      <NuxtLink to="/" class="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white hover:underline mb-6 inline-block transition-all">
        &lt;&lt; back
      </NuxtLink>

      <h1 class="text-[22px] font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
        You're Almost In - Start Your 3-Day Free Trial Now!
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8 text-[15px]">
        Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days
      </p>

      <div class="flex flex-col md:flex-row gap-8 items-start">

        <PricingCard :plan="plan" :is-annual="isAnnual" :is-checkout-mode="true" />

        <div class="flex-1 bg-white dark:bg-[#1e1e1e] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 w-full transition-all">

          <h3 class="text-[17px] font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Order Summary</h3>

          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-4 px-1">
            <div class="flex justify-between">
              <span class="font-medium">{{ isAnnual ? plan.name : plan.name?.replace(' - Annual', '') }} - {{ isAnnual ? 'Annual' : 'Monthly' }} Plan</span>
              <span class="font-bold text-gray-900 dark:text-white">${{ orderTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
            </div>
            <div class="flex justify-between text-gray-900 dark:text-white border-t dark:border-gray-700 pt-2">
              <span class="font-bold">Total Due <span class="text-[10px] font-normal text-gray-400 ml-1">(*not including sales tax)</span></span>
              <span class="font-extrabold text-lg">${{ orderTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
            </div>
            <div class="flex justify-between font-bold text-green-600 pt-1">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800/50 text-center py-3 rounded-lg text-[13px] text-gray-500 dark:text-gray-400 font-bold mb-8">
            Includes 3-Day Free Trial
          </div>

          <h3 class="text-[17px] font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Billing Information</h3>

          <form @submit.prevent="submitForm">
            <div class="mb-5">
              <label class="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">Card Details</label>
              <div class="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-[#2a2a2a] focus-within:ring-2 focus-within:ring-orange-300 transition-all">
                <input type="text" v-model="form.cardNumber" @input="formatCardNumber" placeholder="Number" maxlength="19" class="w-full p-3 text-sm bg-transparent outline-none dark:text-white" required />
                <input type="text" v-model="form.expiry" @input="formatExpiry" placeholder="MM / YY" maxlength="7" class="w-24 p-3 text-sm border-l border-gray-300 dark:border-gray-600 bg-transparent outline-none dark:text-white text-center" required />
                <input type="text" v-model="form.cvc" @input="formatCVC" placeholder="CVC" maxlength="4" class="w-20 p-3 text-sm border-l border-gray-300 dark:border-gray-600 bg-transparent outline-none dark:text-white text-center" required />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-[13px] font-bold text-gray-600 dark:text-gray-400 mb-1">Address</label>
              <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50/50 dark:bg-[#2a2a2a]/50">
                <input type="text" v-model="form.fullName" placeholder="Full name" class="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md mb-3 bg-white dark:bg-[#1e1e1e] outline-none focus:border-orange-400 transition-all dark:text-white" required />
                <input type="text" v-model="form.address" placeholder="Address" class="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1e1e1e] outline-none focus:border-orange-400 transition-all dark:text-white" required />
              </div>
            </div>

            <div class="flex items-start gap-2.5 mb-8 px-1">
              <input type="checkbox" v-model="form.consent" id="consent" class="mt-1 w-4 h-4 cursor-pointer accent-orange-500" />
              <label for="consent" class="text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer text-justify leading-relaxed">
                I consent to <a href="#" class="font-bold underline text-gray-700 dark:text-gray-300">Terms of Use</a> and understand my 3-day free trial will automatically convert to
                <span class="font-bold text-gray-900 dark:text-white">${{ orderTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                per {{ isAnnual ? 'year' : 'month' }} starting on the end of the trial.
              </label>
            </div>

            <button
              type="submit"
              :disabled="!form.consent || isSubmitting"
              class="font-extrabold py-3.5 px-10 rounded-lg transition-all duration-300 ease-in-out text-[15px] w-full md:w-auto shadow-md transform hover:scale-105 active:scale-95"
              :class="form.consent ? 'bg-[#f8981d] text-white hover:bg-[#e0891a] hover:shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
            >
              {{ isSubmitting ? 'Processing...' : 'Try It Free' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
