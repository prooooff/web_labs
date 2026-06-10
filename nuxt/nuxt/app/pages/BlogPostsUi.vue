<script setup lang="ts">
import { ref, computed } from 'vue'

// Додали id в кожну колонку, як у вашому минулому проєкті
const columns = [
  { id: 'id', accessorKey: 'id', header: '#' },
  { id: 'user', accessorKey: 'user', header: 'Автор' },
  { id: 'category', accessorKey: 'category', header: 'Категорія' },
  { id: 'title', accessorKey: 'title', header: 'Заголовок' },
  { id: 'published_at', accessorKey: 'published_at', header: 'Дата публікації' }
]

const page = ref(1)

// Nuxt 3 useFetch автоматично робить новий запит, якщо змінна у query (page) змінюється
const { data: response, pending } = await useFetch('http://localhost/api/admin/blog/posts', {
  query: { page }
})

// Laravel віддає дані у ключі data
const posts = computed(() => response.value?.data || [])

// Загальна кількість записів. Шукаємо універсально (залежно від того, як Laravel їх обгорнув)
const total = computed(() => response.value?.meta?.total || response.value?.total || 0)
const itemsPerPage = computed(() => response.value?.meta?.per_page || response.value?.per_page || 15)
</script>

<template>
  <div class="space-y-6 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

    <div class="flex justify-between items-center max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Керування публікаціями (Серверна пагінація)</h1>
      <UButton to="/admin/blog/posts/create" icon="i-heroicons-plus" color="emerald">
        Додати статтю
      </UButton>
    </div>

    <UCard :ui="{ body: { padding: 'p-0' } }" class="max-w-7xl mx-auto shadow-sm">
      <div class="overflow-x-auto">
        <UTable :data="posts" :columns="columns" :loading="pending" class="w-full">

          <template #user-cell="{ row }">
            <span class="font-medium text-gray-700">{{ row.original.user?.name || 'Невказано' }}</span>
          </template>

          <template #category-cell="{ row }">
            <UBadge variant="subtle" color="gray" size="xs">{{ row.original.category?.title || 'Невказано' }}</UBadge>
          </template>

          <template #title-cell="{ row }">
            <NuxtLink :to="'/admin/blog/posts/' + row.original.id + '/edit'" class="text-emerald-600 hover:text-emerald-800 hover:underline font-bold">
              {{ row.original.title }}
            </NuxtLink>
          </template>

          <template #published_at-cell="{ row }">
            <span class="text-sm text-gray-500">
              {{ row.original.published_at ? new Date(row.original.published_at).toLocaleDateString() : 'Чернетка' }}
            </span>
          </template>

        </UTable>
      </div>

      <template #footer>
        <div class="flex justify-center p-4">
          <UPagination
            v-model:page="page"
            :total="total"
            :items-per-page="itemsPerPage"
            active-color="emerald"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>
      </template>
    </UCard>

  </div>
</template>
