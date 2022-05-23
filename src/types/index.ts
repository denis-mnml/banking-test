export type Contact = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type Card = {
  id: number
  fullName: string
  cardNumber: number
  expiryDate: string
}

export type BankAccount = {
  id: number
  accountName: string
  accountNumber: number
  bsb: string
}

export type SelectOption = {
  title: string
  value: string | number
}

export type SelectGroupOptions = {
  groupTitle: string
  options: SelectOption[]
}