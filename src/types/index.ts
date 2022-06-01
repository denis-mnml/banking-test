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
  cardNumber: string
  expiryDate: string
}

export type BankAccount = {
  id: number
  accountName: string
  accountNumber: string
  bsb: string
}

export interface SelectOption {
  title: string
  value: string | number
}

export interface SelectGroupOption {
  groupTitle: string
  options: SelectOption[]
}
