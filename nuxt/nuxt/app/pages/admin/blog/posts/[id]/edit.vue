<script setup lang="ts">
import { reactive, watch } from 'vue'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const id = route.params.id

// Схема валідації Zod
const schema = z.object({
  title: z.string().min(5, 'Заголовок має містити мінімум 5 символів'),
  slug: z.string().optional(),
  category_id: z.number({ invalid_type_error: "Оберіть категорію" }).min(1, 'Оберіть категорію'),
  content_raw: z.string().min(10, 'Текст має бути довшим за 10 символів'),
  is_published: z.boolean()
})

const state = reactive({
  title: '',
  slug: '',
  category_id: 1, // Значення за замовчуванням
  content_raw: '',
  is_published: false
})

// Отримуємо дані статті
const { data: response } = await useFetch<any>(`http://localhost/api/admin/blog/posts/${id}`, {
  lazy: true, server: false
})

watch(response, (newVal) => {
  if (newVal?.data) {
    state.title = newVal.data.title || ''
    state.slug = newVal.data.slug || ''
    state.category_id = Number(newVal.data.category_id) || 1
    state.content_raw = newVal.data.content_raw || ''
    state.is_published = newVal.data.is_published === true
  }
}, { immediate: true })

async function onSubmit(event: any) {
  await $fetch(`http://localhost/api/admin/blog/posts/${id}`, {
    method: 'PUT',
    body: event.data
  })
  router.push('/BlogPostsUi')
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <UCard>
      <template #header><h2 class="font-bold text-xl">Редагування статті</h2></template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
        <UFormGroup label="Заголовок" name="title">
          <UInput v-model="state.title" />
        </UFormGroup>

        <UFormGroup label="Slug" name="slug">
          <UInput v-model="state.slug" />
        </UFormGroup>

        <UFormGroup label="ID Категорії" name="category_id">
          <UInput type="number" v-model.number="state.category_id" />
        </UFormGroup>

        <UFormGroup label="Текст статті" name="content_raw">
          <UTextarea v-model="state.content_raw" :rows="8" />
        </UFormGroup>

        <UFormGroup name="is_published">
          <UCheckbox v-model="state.is_published" label="Опублікувати статтю" color="emerald" />
        </UFormGroup>

        <div class="flex gap-4">
          <UButton type="submit" color="emerald">Зберегти</UButton>
          <UButton to="/BlogPostsUi" color="gray" variant="ghost">Скасувати</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
