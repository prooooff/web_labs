<script setup lang="ts">
import { reactive, watch } from 'vue'
import * as z from 'zod/v4'
import type { FormSubmitEvent } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const schema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  slug: z.string().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({ title: '', slug: '' })

const { data: response } = await useFetch<any>(`http://localhost/api/admin/blog/categories/${id}`, {
  lazy: true, server: false
})

watch(response, (newVal) => {
  if (newVal?.data) {
    state.title = newVal.data.title || ''
    state.slug = newVal.data.slug || ''
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch(`http://localhost/api/admin/blog/categories/${id}`, {
    method: 'PUT',
    body: { ...event.data, parent_id: null }
  })
  router.push('/BlogCategoriesUi')
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-bold text-xl">Редагування категорії</h2>
      </template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Назва категорії" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="Slug" name="slug">
          <UInput v-model="state.slug" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton type="submit" color="primary">Зберегти зміни</UButton>
          <UButton to="/BlogCategoriesUi" color="neutral" variant="ghost">Скасувати</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
