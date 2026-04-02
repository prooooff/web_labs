<script setup>
useHead({ title: 'Тарифи' })
</script>

<template>
  <div class="max-w-[1200px] mx-auto pt-10 px-4">
    <div class="flex justify-between items-end mb-12">
      <h1 class="text-[32px] font-bold text-[#1f2328] tracking-tight">
        Start Your 3 Day Free Trial
      </h1>

      <div class="flex flex-col items-end gap-2 relative">
        <div class="flex items-center gap-1 text-[#2da44e] text-[13px] font-bold absolute -top-6 right-0">
          <span>Save up to 20%</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="rotate-12">
            <path d="M10 14c2-2 4-4 7-2M17 12l2 2-2 2" />
          </svg>
        </div>
        <div class="inline-flex p-1 bg-[#f6f8fa] border border-gray-200 rounded-lg">
          <button class="px-5 py-1.5 bg-white text-[#1f2328] font-bold rounded-md shadow-sm border border-gray-200 text-[14px]">Annual</button>
          <button class="px-5 py-1.5 text-[#57606a] font-medium text-[14px] hover:text-[#1f2328] transition-colors">Monthly</button>
        </div>
      </div>
    </div>

    <PricingPlans />
  </div>
</template>
