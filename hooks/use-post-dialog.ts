import { create } from 'zustand';

interface PostDialogStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePostDialog = create<PostDialogStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
