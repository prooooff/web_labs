<script setup lang="ts">
import { reactive, watch } from 'vue'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const id = route.params.id

// Правила валідації Zod
const schema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  slug: z.string().optional()
})

const state = reactive({
  title: '',
  slug: ''
})

// Отримуємо поточні дані категорії
const { data: response } = await useFetch<any>(`http://localhost/api/admin/blog/categories/${id}`, {
  lazy: true, server: false
})

// Заповнюємо форму, коли дані прийдуть
watch(response, (newVal) => {
  if (newVal?.data) {
    state.title = newVal.data.title || ''
    state.slug = newVal.data.slug || ''
  }
}, { immediate: true })

async function onSubmit(event: any) {
  await $fetch(`http://localhost/api/admin/blog/categories/${id}`, {
    method: 'PUT',
    body: event.data
  })
  router.push('/BlogCategoriesUi') // Повертаємось до таблиці
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header><h2 class="font-bold text-xl">Редагування категорії</h2></template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Назва категорії" name="title">
          <UInput v-model="state.title" />
        </UFormGroup>

        <UFormGroup label="Slug" name="slug">
          <UInput v-model="state.slug" />
        </UFormGroup>

        <div class="flex gap-4 mt-4">
          <UButton type="submit" color="emerald">Зберегти зміни</UButton>
          <UButton to="/BlogCategoriesUi" color="gray" variant="ghost">Скасувати</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
