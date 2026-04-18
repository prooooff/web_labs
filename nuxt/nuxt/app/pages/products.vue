<script setup>
import { useSubscriptionStore } from '~/stores/useSubscriptionStore'
import { storeToRefs } from 'pinia'

useHead({ title: 'Таблиця' })


const store = useSubscriptionStore()

const { selectedPlan } = storeToRefs(store)
</script>

<template>
  <div class="max-w-[1200px] mx-auto pt-10 px-4 pb-20">

    <div
      v-if="selectedPlan"
      class="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between shadow-sm transition-all"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-500" />
        <span class="text-emerald-800 font-medium text-sm">
          У вас є неоформлене замовлення на тариф: <strong class="text-emerald-900">{{ selectedPlan.name }}</strong>
        </span>
      </div>
      <NuxtLink
        to="/checkout"
        class="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Завершити оплати
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold text-gray-900 mb-8">Таблиця продуктів</h1>
    <ProductTable />
  </div>
</template>
