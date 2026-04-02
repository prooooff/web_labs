<script setup>
defineProps({
  billing: {
    type: String,
    default: 'annual'
  }
})

const { data: plans } = await useFetch('/api/plans')
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] w-full pb-12 px-4">

      <div
        v-for="plan in plans"
        :key="plan.title"
        class="relative bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden p-8 pt-10 hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col"
      >

        <div
          class="absolute top-0 left-0 w-full h-[6px]"
          style="background: linear-gradient(90deg, #39d353 0%, #26a641 50%, #00bcd4 100%);"
        ></div>

        <div class="mb-6">
          <h3 class="text-2xl font-bold text-[#24292f]">
            {{ plan.title }}
          </h3>
          <div class="mt-3">
            <span class="bg-[#f6f8fa] text-[#57606a] text-[13px] px-2.5 py-1 rounded-md border border-gray-200/50">
              3-days free then:
            </span>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-bold text-[#1f2328]">
              ${{ plan.price }}
            </span>
            <span class="text-[#57606a] text-base">
              /month
            </span>
          </div>
          <p class="text-[#57606a] text-sm mt-1 font-medium">
            billed yearly at
            <span class="line-through text-gray-400">
              {{ plan.oldPrice }}
            </span>
            {{ plan.discountPrice }}
          </p>
        </div>

        <div class="mb-8">
          <span class="text-[#2da44e] bg-[#dafbe1] font-bold text-[13px] px-2.5 py-1 rounded border border-[#2da44e]/20">
            {{ plan.savings }} in savings
          </span>
        </div>

        <div class="mb-8">
          <button
            class="w-full py-[13px] rounded-xl font-bold shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
            style="background: linear-gradient(90deg, #ffcc00 0%, #ff8c00 100%); color: #1f2328; font-size: 16px;"
          >
            Try It Free
          </button>
        </div>

        <hr class="border-gray-100 mb-8">

        <ul class="space-y-4 flex-grow">
          <li
            v-for="(feature, i) in plan.features"
            :key="i"
            class="flex items-start gap-3"
          >
            <svg
              class="mt-1 flex-shrink-0 text-[#a2f1a6]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12,1L14.5,9.5L23,12L14.5,14.5L12,23L9.5,14.5L1,12L9.5,9.5L12,1Z"/>
            </svg>

            <div
              class="text-[15px] text-[#24292f] leading-tight"
              v-html="feature"
            />
          </li>
        </ul>

      </div>

    </div>
  </div>
</template>
