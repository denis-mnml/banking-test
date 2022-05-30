import useLocalStorage from '@/hooks/useLocalStorage'
import { BankAccount, Card, Contact, LocalStorages } from '@/types'

export const useContactsStore = defineStorage<Contact[]>('contacts', [])
export const useCardsStore = defineStorage<Card[]>('cards', [])
export const useBankAccountsStore = defineStorage<BankAccount[]>('bankAccounts', [])

function defineStorage<T>(name: LocalStorages, initialValue?: any) {
  const { storage, isEmptyStorage, destroyStorage } = useLocalStorage<T>(name, initialValue)

  return () => ({
    storage,
    isEmptyStorage,
    destroyStorage,
  })
}
