import { create } from 'zustand';

export interface baseStoreState {
    userId: number;
    setUserId: (value: number) => void;
  }

const useBaseStore = create<baseStoreState>((set) => ({
  userId: 0,
  setUserId: (value: number) => set(() => ({ userId: value })), 
}));

export default useBaseStore;