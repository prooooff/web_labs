<script setup>
const { data: productsData } = await useFetch('https://dummyjson.com/products?limit=0')
const allProducts = computed(() => productsData.value?.products || [])

const columns = [
  { id: 'thumbnail', accessorKey: 'thumbnail', header: 'Фото' },
  { id: 'title', accessorKey: 'title', header: 'Назва' },
  { id: 'price', accessorKey: 'price', header: 'Ціна' },
  { id: 'rating', accessorKey: 'rating', header: 'Оцінка' },
  { id: 'brand', accessorKey: 'brand', header: 'Бренд' },
  { id: 'category', accessorKey: 'category', header: 'Категорія' },
  { id: 'description', accessorKey: 'description', header: 'Опис' }
]

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const sortedAndFilteredProducts = computed(() => {
  let result = [...allProducts.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product =>
      Object.values(product).some(val => String(val).toLowerCase().includes(query))
    )
  }
  return result
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = currentPage.value * itemsPerPage.value
  return sortedAndFilteredProducts.value.slice(start, end)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Таблиця продуктів</h1>
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Пошук..."
        color="emerald"
        class="w-72"
      />
    </div>

    <UCard :ui="{ body: { padding: 'p-0' } }">
      <div class="overflow-x-auto">
        <UTable :data="paginatedRows" :columns="columns" class="w-full">
          <template #thumbnail-cell="{ row }">
            <img :src="row.original.thumbnail" class="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm" />
          </template>

          <template #title-cell="{ row }">
            <span class="font-bold text-gray-900">{{ row.original.title }}</span>
          </template>

          <template #price-cell="{ row }">
            <span class="font-bold text-gray-900">${{ row.original.price }}</span>
          </template>

          <template #rating-cell="{ row }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
              :class="row.original.rating < 4.5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"
            >
              {{ row.original.rating }}
            </span>
          </template>

          <template #description-cell="{ row }">
            <div class="max-w-[200px] truncate text-gray-500 text-sm" :title="row.original.description">
              {{ row.original.description }}
            </div>
          </template>

          <template #brand-cell="{ row }">
            <span class="text-gray-500 text-sm">{{ row.original.brand }}</span>
          </template>

          <template #category-cell="{ row }">
            <UBadge variant="subtle" color="gray" size="xs">{{ row.original.category }}</UBadge>
          </template>
        </UTable>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UPagination
            v-model:page="currentPage"
            :total="sortedAndFilteredProducts.length"
            :items-per-page="itemsPerPage"
            active-color="emerald"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
