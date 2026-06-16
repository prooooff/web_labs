<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const toast = useToast()

const schema = z.object({
  title:       z.string().min(5, 'Мінімум 5 символів'),
  slug:        z.string().optional(),
  description: z.string().min(3, 'Мінімум 3 символи').max(500, 'Максимум 500 символів').optional().or(z.literal('')),
  parent_id:   z.number().nullable().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  title:       '',
  slug:        '',
  description: '',
  parent_id:   null
})

// Завантажуємо всі категорії для вибору батьківської
const { data: categoriesResponse } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  query: { per_page: 999 },
  server: false
})

const parentOptions = computed(() => {
  const items = categoriesResponse.value?.data || []
  return [
    { label: '— Без батьківської —', value: null },
    ...items.map((c: any) => ({ label: c.title, value: c.id }))
  ]
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('http://localhost/api/admin/blog/categories', {
      method: 'POST',
      body: {
        ...event.data,
        parent_id: event.data.parent_id ?? null
      }
    })

    toast.add({
      title: 'Категорію створено',
      description: `"${event.data.title}" успішно додано.`,
      color: 'success'
    })

    router.push('/BlogCategoriesUi')
  } catch (error: any) {
    const message = error.response?._data?.message || 'Не вдалося створити категорію.'
    toast.add({
      title: 'Помилка',
      description: message,
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-bold text-xl">Створення нової категорії</h2>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormField label="Назва категорії" name="title" required>
          <UInput v-model="state.title" placeholder="Наприклад: Новини" class="w-full" />
        </UFormField>

        <UFormField label="Slug (необов'язково)" name="slug">
          <UInput v-model="state.slug" placeholder="novyny" class="w-full" />
          <template #hint>
            <span class="text-xs text-muted">Якщо не вказати — згенерується автоматично</span>
          </template>
        </UFormField>

        <UFormField label="Батьківська категорія" name="parent_id">
          <USelect
            v-model="state.parent_id"
            :items="parentOptions"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Опис (необов'язково)" name="description">
          <UTextarea v-model="state.description" placeholder="Короткий опис категорії..." :rows="3" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton type="submit" color="primary">Створити</UButton>
          <UButton to="/BlogCategoriesUi" color="neutral" variant="ghost">Скасувати</UButton>
        </div>

      </UForm>
    </UCard>
  </div>
</template>

