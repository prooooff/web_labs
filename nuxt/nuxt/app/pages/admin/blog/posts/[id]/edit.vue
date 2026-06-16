<script setup lang="ts">
import { reactive, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { data: catResponse } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  lazy: true, server: false
})

const categoryOptions = computed(() =>
  (catResponse.value?.data || []).map((c: any) => ({ label: c.title, value: c.id }))
)

const schema = z.object({
  title: z.string().min(5, 'Мінімум 5 символів'),
  slug: z.string().optional(),
  category_id: z.number().min(1, 'Оберіть категорію'),
  content_raw: z.string().min(10, 'Мінімум 10 символів'),
  is_published: z.boolean()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  title: '',
  slug: '',
  category_id: 0,
  content_raw: '',
  is_published: false
})

const { data: response } = await useFetch<any>(`http://localhost/api/admin/blog/posts/${id}`, {
  lazy: true, server: false
})

watch(response, (newVal) => {
  if (newVal?.data) {
    state.title = newVal.data.title || ''
    state.slug = newVal.data.slug || ''
    state.category_id = Number(newVal.data.category_id) || 0
    state.content_raw = newVal.data.content_raw || ''
    state.is_published = newVal.data.is_published === true
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
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
      <template #header>
        <h2 class="font-bold text-xl">Редагування статті</h2>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <UFormField label="Заголовок" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="Slug" name="slug">
          <UInput v-model="state.slug" class="w-full" />
        </UFormField>

        <UFormField label="Категорія" name="category_id">
          <USelect v-model="state.category_id" :items="categoryOptions" placeholder="Оберіть категорію" class="w-full" />
        </UFormField>

        <UFormField label="Текст статті" name="content_raw">
          <UTextarea v-model="state.content_raw" :rows="8" class="w-full" />
        </UFormField>

        <UFormField name="is_published">
          <UCheckbox v-model="state.is_published" label="Опублікувати статтю" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton type="submit" color="primary">Зберегти</UButton>
          <UButton to="/BlogPostsUi" color="neutral" variant="ghost">Скасувати</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
