export default defineEventHandler(() => {
  return {
    offers: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: '$4.99',
        period: 'per month',
        description: 'A little magic every month',
        badge: null,
        billing: 'Billed monthly'
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: '$29.99',
        period: 'per year',
        description: 'The best value for your family',
        badge: 'SAVE 50%',
        billing: 'Just $2.50 per month'
      }
    ]
  }
})