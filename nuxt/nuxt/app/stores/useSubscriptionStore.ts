import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {

  const selectedPlan = ref(null)
  const isAnnualBilling = ref(true)


  function setSubscription(plan: any, isAnnual: boolean) {
    selectedPlan.value = plan
    isAnnualBilling.value = isAnnual
  }

  return {
    selectedPlan,
    isAnnualBilling,
    setSubscription
  }
})
