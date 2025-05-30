import { create } from 'zustand'

interface MenuState {
	isOpenSearchModal: boolean;
	setOpenSearchMenu: () => void;
}

export const useSearchModal = create<MenuState>((set) => ({
	isOpenSearchModal: false,
	setOpenSearchMenu: () => set((state) => ({ isOpenSearchModal: !state.isOpenSearchModal })),
}));
