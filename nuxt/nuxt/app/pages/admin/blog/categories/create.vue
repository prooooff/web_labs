<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'

const router = useRouter()

const schema = z.object({
  title: z.string().min(5, 'Назва має містити мінімум 5 символів'),
  slug: z.string().optional()
})

const title = ref('')
const slug = ref('')
const errors = ref<Record<string, string>>({})

async function onSubmit() {
  const result = schema.safeParse({ title: title.value, slug: slug.value })
  if (!result.success) {
    errors.value = {}
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }
  errors.value = {}
  await $fetch('http://localhost/api/admin/blog/categories', {
    method: 'POST',
    body: { ...result.data, parent_id: null }
  })
  router.push('/BlogCategoriesUi')
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-bold text-xl">Створення нової категорії</h2>
      </template>

      <div class="space-y-4">
        <UFormField label="Назва категорії" name="title" :error="errors.title">
          <UInput v-model="title" placeholder="Наприклад: Новини" class="w-full" />
        </UFormField>

        <UFormField label="Slug (необов'язково)" name="slug" :error="errors.slug">
          <UInput v-model="slug" placeholder="novyny" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton color="primary" @click="onSubmit">Створити</UButton>
          <UButton to="/BlogCategoriesUi" color="neutral" variant="ghost">Скасувати</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
