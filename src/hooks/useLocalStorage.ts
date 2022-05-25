import { ref } from 'vue'
import { isEmpty as checkIsEmpty } from '@/utils'
import { LocalStorages } from '@/types'

interface ReturnValues<T> {
  storage: T
  isEmptyStorage: boolean
  destroyStorage: () => void
}

export default function useLocalStorage<T>(key: LocalStorages, initialValue = {}): ReturnValues<T> {
  const storageValue = localStorage.getItem(key)
  let storage = createProxy(storageValue !== null ? JSON.parse(storageValue) : initialValue)
  const isEmpty = ref(checkIsEmpty(storageValue))

  function destroyStorage() {
    storage = createProxy(initialValue)
    isEmpty.value = true
    localStorage.removeItem(key)
  }

  function createProxy(initValue: any) {
    console.log(`createProxy: ${key}`, initValue)
    return new Proxy(initValue, {
      set(target, prop, val) {
        if (checkIsEmpty(target)) isEmpty.value = false

        target[prop] = val
        console.log('SET', val)
        console.log('TARGET', target)
        localStorage.setItem(key, JSON.stringify(target))

        return true
      },
      deleteProperty(target, prop) {
        delete target[prop]
        localStorage.setItem(key, JSON.stringify(target))

        if (!checkIsEmpty(target)) isEmpty.value = true

        return true
      },
    })
  }

  return {
    storage,
    isEmptyStorage: isEmpty.value,
    destroyStorage,
  }
}
