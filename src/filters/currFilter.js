export default function currencyFilter(val,currency = 'UAH') {
  return Intl.NumberFormat('ru-RU',{
    style: 'currency',
    currency
  }).format(val)
}