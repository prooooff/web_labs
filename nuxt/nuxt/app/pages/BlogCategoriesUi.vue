<script setup lang="ts">
import { h, resolveComponent, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')

const toast = useToast()

type Category = {
  id: number
  title: string
  slug: string | null
  description: string | null
  parent_id: number | null
  parent_title: string | null
}

const page = ref(1)
const search = ref('')

const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  lazy: true,
  server: false,
  query: { page, search },
  default: () => ({ data: [] })
})

const categories = computed<Category[]>(() => response.value?.data || [])
const total = computed(() => response.value?.meta?.total || 0)
const perPage = computed(() => response.value?.meta?.per_page || 15)

watch(search, () => { page.value = 1 })

const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'id',
    header: '#',
    size: 50
  },
  {
    accessorKey: 'title',
    header: 'Назва категорії',
    size: 220
  },
  {
    accessorKey: 'parent_title',
    header: 'Батьківська',
    size: 160,
    cell: ({ row }) => {
      const parent = row.original.parent_title
      return parent
        ? h(UBadge, { color: 'info', variant: 'subtle', class: 'text-xs' }, () => parent)
        : h('span', { class: 'text-muted italic text-sm' }, '—')
    }
  },
  {
    id: 'actions',
    header: 'Дії',
    size: 60,
    cell: ({ row }) => h(UDropdownMenu, {
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
            color: 'error',
            onSelect: async () => {
              if (confirm('Точно видалити цю категорію?')) {
                try {
                  await $fetch(`http://localhost/api/admin/blog/categories/${row.original.id}`, { method: 'DELETE' })

                  toast.add({
                    title: 'Успішно видалено',
                    description: `Категорію "${row.original.title}" було назавжди видалено.`,
                    color: 'success'
                  })

                  refresh()
                } catch (error: any) {
                  const errorMessage = error.response?._data?.message || 'Не вдалося видалити категорію.'

                  toast.add({
                    title: 'Помилка видалення',
                    description: errorMessage,
                    color: 'error'
                  })
                }
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
  <div class="w-full py-8 px-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Категорії</h1>
      <UButton to="/admin/blog/categories/create" color="primary" icon="i-heroicons-plus-20-solid">
        Додати категорію
      </UButton>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук категорій..."
          class="max-w-sm"
        />
      </template>

      <UTable :data="categories" :columns="columns" :loading="pending" />

      <template #footer>
        <div class="flex justify-end">
          <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
        </div>
      </template>
    </UCard>
  </div>
</template>
