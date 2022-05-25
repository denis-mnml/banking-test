import { BankAccount, Card } from '@/types'

export function getProtectedCardNumber(item: Card | BankAccount) {
  if ('cardNumber' in item) {
    return `**** **** **** ${item.cardNumber.toString().slice(12)}`
  }

  return `****** ${item.accountNumber.toString().slice(6)}`
}

export function isEmpty(value: any) {
  if (value === null) {
    return true
  }

  if (Array.isArray(value) || typeof value === 'string') {
    return !value.length
  }

  if (typeof value === 'object') {
    return !Object.keys(value).length
  }

  return true
}
