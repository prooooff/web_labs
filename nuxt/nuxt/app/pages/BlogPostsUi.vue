<script setup lang="ts">
import { h, resolveComponent, ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')

const toast = useToast()

type Post = {
  id: number
  title: string
  slug: string | null
  category_title: string
  is_published: boolean
  date_published: string | null
  author_name: string
}

const page = ref(1)
const search = ref('')

const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/posts', {
  lazy: true,
  server: false,
  query: { page, search },
  default: () => ({ data: [] })
})

const posts = computed<Post[]>(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta?.total || 0)
const perPage = computed(() => response.value?.meta?.per_page || 20)

watch(search, () => { page.value = 1 })

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const columns: TableColumn<Post>[] = [
  {
    accessorKey: 'id',
    header: '#',
    size: 50
  },
  {
    accessorKey: 'title',
    header: 'Заголовок статті',
    size: 250
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    size: 150,
    cell: ({ row }) => {
      const slug = row.original.slug
      return slug
        ? h(UBadge, { color: 'neutral', variant: 'subtle', class: 'max-w-[140px] truncate block text-xs' }, () => slug)
        : h('span', { class: 'text-muted italic text-sm' }, '—')
    }
  },
  {
    accessorKey: 'category_title',
    header: 'Категорія',
    size: 150
  },
  {
    accessorKey: 'author_name',
    header: 'Автор',
    size: 120
  },
  {
    accessorKey: 'is_published',
    header: 'Статус',
    size: 130,
    cell: ({ row }) => {
      const published = row.original.is_published
      return h(UBadge, {
        color: published ? 'success' : 'warning',
        variant: 'subtle'
      }, () => published ? 'Опубліковано' : 'Чернетка')
    }
  },
  {
    accessorKey: 'date_published',
    header: 'Дата публікації',
    size: 130,
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDate(row.original.date_published))
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
            onSelect: () => navigateTo(`/admin/blog/posts/${row.original.id}/edit`)
          }
        ],
        [
          {
            label: 'Видалити',
            icon: 'i-heroicons-trash-20-solid',
            color: 'error',
            onSelect: async () => {
              if (confirm('Точно видалити цю статтю?')) {
                try {
                  await $fetch(`http://localhost/api/admin/blog/posts/${row.original.id}`, { method: 'DELETE' })

                  toast.add({
                    title: 'Успішно видалено',
                    description: `Статтю "${row.original.title}" було назавжди видалено.`,
                    color: 'success'  // FIX: було 'green' — не є валідним значенням Nuxt UI v3
                  })

                  refresh()
                } catch (error: any) {
                  const errorMessage = error.response?._data?.message || 'Не вдалося видалити статтю.'

                  toast.add({
                    title: 'Помилка видалення',
                    description: errorMessage,
                    color: 'error'  // FIX: було 'red' — не є валідним значенням Nuxt UI v3
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
      <h1 class="text-2xl font-bold">Статті блогу</h1>
      <UButton to="/admin/blog/posts/create" color="primary" icon="i-heroicons-plus-20-solid">
        Додати статтю
      </UButton>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук за заголовком..."
          class="max-w-sm"
        />
      </template>

      <UTable :data="posts" :columns="columns" :loading="pending" />

      <template #footer>
        <div class="flex justify-end">
          <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
        </div>
      </template>
    </UCard>
  </div>
</template>
