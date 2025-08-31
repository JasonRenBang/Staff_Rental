import { describe, it, expect, beforeEach } from 'vitest'
import { useUiStore } from '@/store/uiStore'

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUiStore.setState({
      defaultStoreLocation: 'CAR',
      filterStatus: 'All',
      isCreateProductOpen: false,
      lastActionProductId: null,
      isLoading: false,
    })
  })

  it('should have initial state', () => {
    const state = useUiStore.getState()

    expect(state.defaultStoreLocation).toBe('CAR')
    expect(state.filterStatus).toBe('All')
    expect(state.isCreateProductOpen).toBe(false)
    expect(state.lastActionProductId).toBeNull()
    expect(state.isLoading).toBe(false)
  })

  it('should update default store location', () => {
    const { setDefaultStoreLocation } = useUiStore.getState()

    setDefaultStoreLocation('SYD')

    expect(useUiStore.getState().defaultStoreLocation).toBe('SYD')
  })

  it('should update filter status', () => {
    const { setFilterStatus } = useUiStore.getState()

    setFilterStatus('Available')

    expect(useUiStore.getState().filterStatus).toBe('Available')
  })

  it('should manage create product dialog state', () => {
    const { setCreateProductOpen } = useUiStore.getState()

    setCreateProductOpen(true)
    expect(useUiStore.getState().isCreateProductOpen).toBe(true)

    setCreateProductOpen(false)
    expect(useUiStore.getState().isCreateProductOpen).toBe(false)
  })

  it('should manage last action product ID', () => {
    const { setLastActionProductId } = useUiStore.getState()

    setLastActionProductId('test-product-id')
    expect(useUiStore.getState().lastActionProductId).toBe('test-product-id')

    setLastActionProductId(null)
    expect(useUiStore.getState().lastActionProductId).toBeNull()
  })

  it('should manage loading state', () => {
    const { setLoading } = useUiStore.getState()

    setLoading(true)
    expect(useUiStore.getState().isLoading).toBe(true)

    setLoading(false)
    expect(useUiStore.getState().isLoading).toBe(false)
  })

  it('should handle multiple state updates', () => {
    const { setDefaultStoreLocation, setFilterStatus, setLastActionProductId, setLoading } =
      useUiStore.getState()

    setDefaultStoreLocation('MEL')
    setFilterStatus('Rented')
    setLastActionProductId('action-product-id')
    setLoading(true)

    const state = useUiStore.getState()
    expect(state.defaultStoreLocation).toBe('MEL')
    expect(state.filterStatus).toBe('Rented')
    expect(state.lastActionProductId).toBe('action-product-id')
    expect(state.isLoading).toBe(true)
  })
})
