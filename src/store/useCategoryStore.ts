import { create } from 'zustand'

type CategoryStore = {
	selectedId: string | null | number
	setSelectedId: (id: string | null | number) => void
	clearSelectedId: () => void
}

export const useCategoryStore = create<CategoryStore>(set => ({
	selectedId: "",
	setSelectedId: id => set({ selectedId: id }),
	clearSelectedId: () => set({ selectedId: "" }),
}))
