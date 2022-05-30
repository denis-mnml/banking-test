import { computed, reactive, Ref, UnwrapNestedRefs, watch } from 'vue'
import { isEmpty as checkIsEmpty } from '@/utils'
import { LocalStorages } from '@/types'

interface ReturnValues<T> {
  storage: UnwrapNestedRefs<T>
  isEmptyStorage: Ref<boolean>
  destroyStorage: () => void
}

export default function useLocalStorage<T extends {} | []>(key: LocalStorages, initialValue?: any): ReturnValues<T> {
  const localStorageValue = localStorage.getItem(key)
  const storage = reactive<T>(localStorageValue !== null ? JSON.parse(localStorageValue) : initialValue || {})
  const isEmpty = computed(() => checkIsEmpty(storage))

  console.log(`storage: ${key}`, storage)

  watch(storage, (val, old) => {
    console.log('WATCH STORAGE', val, storage)
    if (val) {
      localStorage.setItem(key, JSON.stringify(storage))
    } else if (old && !val) {
      localStorage.setItem(key, JSON.stringify(storage))
    }
  })

  function clearStorage() {
    if (Array.isArray(storage)) {
      storage.splice(0, 0)
    } else {
      Object.keys(storage).forEach((key) => {
        // @ts-ignore
        delete storage[key]
      })
    }
  }

  function destroyStorage() {
    clearStorage()
    localStorage.removeItem(key)
  }

  return {
    storage,
    isEmptyStorage: isEmpty,
    destroyStorage,
  }
}
