export default defineEventHandler((event) => {
  const query = getQuery(event)
  const id = Number(query.id) || 1

  const allPlans = [
    {
      id: 1,
      name: 'Starter - Annual',
      price: 83.25,
      originalYearly: '1,188',
      yearlyPrice: 999,
      savings: 189,
      topColor: 'bg-emerald-400',
      features: ['Primary user only', 'Save unlimited properties', '10,000 exports']
    },
    {
      id: 2,
      name: 'Team - Annual',
      price: 207.50,
      originalYearly: '2,988',
      yearlyPrice: 2490,
      savings: 498,
      topColor: 'bg-teal-400',
      features: ['Primary user + 2 free team members', 'Save unlimited properties', '50,000 exports']
    },
    {
      id: 3,
      name: 'Business - Annual',
      price: 457.50,
      originalYearly: '6,588',
      yearlyPrice: 5490,
      savings: 1098,
      topColor: 'bg-cyan-400',
      features: ['Primary user + 6 free team members', 'Save unlimited properties', '100,000 exports']
    }
  ]

  return allPlans.find(p => p.id === id) || allPlans[0]
})
