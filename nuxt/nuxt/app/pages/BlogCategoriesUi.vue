<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Category = {
  id: number
  title: string
  slug: string
}

const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  lazy: true,
  server: false
})

const categories = computed<Category[]>(() => response.value?.data || [])

const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'title',
    header: 'Назва категорії'
  },
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    id: 'actions',
    header: 'Дії',
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: 'Редагувати',
                icon: 'i-heroicons-pencil-square-20-solid',
                onSelect: () => navigateTo(`/admin/blog/categories/${row.original.id}/edit`)
              }
            ],
            [
              {
                label: 'Видалити',
                icon: 'i-heroicons-trash-20-solid',
                onSelect: async () => {
                  if (confirm('Точно видалити цю категорію?')) {
                    await $fetch(`http://localhost/api/admin/blog/categories/${row.original.id}`, { method: 'DELETE' })
                    refresh()
                  }
                }
              }
            ]
          ]
        },
        () => h(UButton, {
          icon: 'i-heroicons-ellipsis-horizontal-20-solid',
          color: 'neutral',
          variant: 'ghost',
          'aria-label': 'Дії'
        })
      )
    }
  }
]
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Категорії</h1>
      <UButton to="/admin/blog/categories/create" color="primary" icon="i-heroicons-plus-20-solid">
        Додати категорію
      </UButton>
    </div>
    <UCard>
      <UTable :data="categories" :columns="columns" :loading="pending" />
    </UCard>
  </div>
</template>
