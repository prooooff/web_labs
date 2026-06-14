<script setup lang="ts">
const columns = [
  { id: 'id', key: 'id', accessorKey: 'id', label: '#', header: '#' },
  { id: 'title', key: 'title', accessorKey: 'title', label: 'Назва категорії', header: 'Назва категорії' },
  { id: 'slug', key: 'slug', accessorKey: 'slug', label: 'Slug', header: 'Slug' },
  { id: 'actions', key: 'actions', label: 'Дії', header: 'Дії' }
]

const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  lazy: true, server: false
})

const categories = computed(() => response.value?.data || [])

const items = (row: any) => [
  [
    { label: 'Редагувати', icon: 'i-heroicons-pencil-square-20-solid', click: () => navigateTo(`/admin/blog/categories/${row.id}/edit`) }
  ],
  [
    { label: 'Видалити', icon: 'i-heroicons-trash-20-solid', click: async () => {
        if (confirm('Точно видалити цю категорію?')) {
          await $fetch(`http://localhost/api/admin/blog/categories/${row.id}`, { method: 'DELETE' })
          refresh()
        }
      }
    }
  ]
]
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Категорії</h1>
      <UButton to="/admin/blog/categories/create" color="emerald">Додати категорію</UButton>
    </div>
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <UTable :rows="categories" :columns="columns" :loading="pending">
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
