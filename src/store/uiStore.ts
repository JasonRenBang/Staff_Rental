import { create } from 'zustand'

interface UiState {

  defaultStoreLocation: string
  filterStatus: 'All' | 'Available' | 'Rented'
  isCreateProductOpen: boolean
  lastActionProductId: string | null

  isLoading: boolean
  

  setDefaultStoreLocation: (location: string) => void
  setFilterStatus: (status: 'All' | 'Available' | 'Rented') => void
  setCreateProductOpen: (open: boolean) => void
  setLastActionProductId: (id: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({

  defaultStoreLocation: 'CAR',
  filterStatus: 'All',
  isCreateProductOpen: false,
  lastActionProductId: null,
  isLoading: false,
  

  setDefaultStoreLocation: (location) => set({ defaultStoreLocation: location }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setCreateProductOpen: (open) => set({ isCreateProductOpen: open }),
  setLastActionProductId: (id) => set({ lastActionProductId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
}))