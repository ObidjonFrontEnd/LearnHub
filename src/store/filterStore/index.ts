import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
  selectedMajors: string[]
  selectedRegions: string[]
  setSelectedMajors: (majors: string[]) => void
  setSelectedRegions: (regions: string[]) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      selectedMajors: [],
      selectedRegions: [],
      setSelectedMajors: (majors) => set({ selectedMajors: majors }),
      setSelectedRegions: (regions) => set({ selectedRegions: regions }),
      clearFilters: () => set({ selectedMajors: [], selectedRegions: [] }),
    }),
    {
      name: 'filter-storage',
    }
  )
)