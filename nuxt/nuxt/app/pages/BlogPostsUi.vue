<script setup lang="ts">
import { h, resolveComponent, ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Post = {
  id: number
  title: string
  category_title: string
}

// Завантажуємо ВСІ пости одразу (без серверної пагінації)
const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/posts', {
  lazy: true,
  server: false,
  default: () => ({ data: [] })
})

const allPosts = computed<Post[]>(() => response.value?.data ?? [])

// Клієнтська пагінація
const page = ref(1)
const pageSize = ref(10)

const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 }
]

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return allPosts.value.slice(start, start + pageSize.value)
})

function onPageSizeChange(val: number) {
  pageSize.value = Number(val)
  page.value = 1
}

const columns: TableColumn<Post>[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: 'Заголовок статті' },
  { accessorKey: 'category_title', header: 'Категорія' },
  {
    id: 'actions',
    header: 'Дії',
    cell: ({ row }) => h(UDropdownMenu, {
      items: [
        [
          { label: 'Редагувати', icon: 'i-heroicons-pencil-square-20-solid', onSelect: () => navigateTo(`/admin/blog/posts/${row.original.id}/edit`) },
          { label: 'Переглянути', icon: 'i-heroicons-eye-20-solid', onSelect: () => navigateTo(`/posts/${row.original.id}`) }
        ],
        [
          {
            label: 'Видалити', icon: 'i-heroicons-trash-20-solid', onSelect: async () => {
              if (confirm('Точно видалити цю статтю?')) {
                await $fetch(`http://localhost/api/admin/blog/posts/${row.original.id}`, { method: 'DELETE' })
                refresh()
              }
            }
          }
        ]
      ]
    }, () => h(UButton, {
      icon: 'i-heroicons-ellipsis-horizontal-20-solid',
      color: 'neutral',
      variant: 'ghost',
      'aria-label': 'Дії'
    }))
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Статті блогу</h1>
      <UButton to="/admin/blog/posts/create" color="primary" icon="i-heroicons-plus-20-solid">
        Додати статтю
      </UButton>
    </div>
    <UCard>
      <UTable :data="paginatedPosts" :columns="columns" :loading="pending" />
      <div class="flex items-center justify-between px-4 py-4 border-t border-default">
        <div class="flex items-center gap-2">
          <span class="text-sm">Показувати по:</span>
          <select
            :value="pageSize"
            class="border border-gray-300 rounded px-2 py-1 text-sm"
            @change="onPageSizeChange(Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="opt in pageSizeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <UPagination v-model:page="page" :total="allPosts.length" :items-per-page="pageSize" />
      </div>
    </UCard>
  </div>
</template>
