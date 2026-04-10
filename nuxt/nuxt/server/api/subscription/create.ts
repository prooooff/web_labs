export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.consent) {
    throw createError({ statusCode: 400, statusMessage: 'Consent is required' })
  }


  return {
    message: 'Підписку успішно оформлено! Ваш 3-денний безкоштовний пробний період розпочато.'
  }
})
