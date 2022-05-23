import { BankAccount, Card } from '@/types'

export function getProtectedCardNumber(item: Card | BankAccount) {
  if ('cardNumber' in item) {
    return `**** **** **** ${item.cardNumber.toString().slice(12)}`
  }

  return `****** ${item.accountNumber.toString().slice(6)}`
}
