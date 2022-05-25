enum LocalStoragesEnum {
  payFormDraft,
  contactFormDraft,
  cardFormDraft,
  bankAccountFormDraft,
  contacts,
  cards,
  bankAccounts,
}

export type LocalStorages = keyof typeof LocalStoragesEnum

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

export interface SelectOption {
  title: string
  value: string | number
}

export interface SelectGroupOptions {
  groupTitle: string
  options: SelectOption[]
}
