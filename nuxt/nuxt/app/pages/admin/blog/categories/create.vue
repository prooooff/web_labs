<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'

const router = useRouter()

// Правила валідації Zod
const schema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  slug: z.string().optional()
})

const state = reactive({
  title: '',
  slug: ''
})

async function onSubmit(event: any) {
  await $fetch('http://localhost/api/admin/blog/categories', {
    method: 'POST',
    body: event.data
  })
  router.push('/BlogCategoriesUi') // Повертаємось до таблиці
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header><h2 class="font-bold text-xl">Створення нової категорії</h2></template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Назва категорії" name="title">
          <UInput v-model="state.title" placeholder="Наприклад: Новини" />
        </UFormGroup>

        <UFormGroup label="Slug (необов'язково)" name="slug">
          <UInput v-model="state.slug" placeholder="novyny" />
        </UFormGroup>

        <UButton type="submit" color="emerald">Створити</UButton>
      </UForm>
    </UCard>
  </div>
</template>
