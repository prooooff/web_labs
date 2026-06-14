<script setup lang="ts">
const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Заголовок статті' },
  { key: 'category_title', label: 'Категорія' },
  { key: 'actions', label: 'Дії' }
]

// Отримуємо список статей
const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/posts', {
  lazy: true, server: false
})

const posts = computed(() => response.value?.data || [])

// Випадаюче меню дій для кожної строки
const items = (row: any) => [
  [
    { label: 'Редагувати', icon: 'i-heroicons-pencil-square-20-solid', click: () => navigateTo(`/admin/blog/posts/${row.id}/edit`) },
    { label: 'Переглянути', icon: 'i-heroicons-eye-20-solid', click: () => navigateTo(`/posts/${row.id}`) }
  ],
  [
    { label: 'Видалити', icon: 'i-heroicons-trash-20-solid', click: async () => {
        if (confirm('Точно видалити цю статтю?')) {
          await $fetch(`http://localhost/api/admin/blog/posts/${row.id}`, { method: 'DELETE' })
          refresh() // Оновлюємо таблицю після видалення
        }
      }
    }
  ]
]
</script>

<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Статті блогу</h1>
      <UButton to="/admin/blog/posts/create" color="emerald">Додати статтю</UButton>
    </div>
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <UTable :rows="posts" :columns="columns" :loading="pending">
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
