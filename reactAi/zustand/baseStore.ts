import { create } from 'zustand';
import { ChatState } from '../src/types/chat';

export interface baseStoreState {
  userId: number;
  setUserId: (value: number) => void;
  chatState: ChatState
  setChatState: (value: ChatState) => void;
}

const useBaseStore = create<baseStoreState>((set) => ({
  userId: 0,
  setUserId: (value: number) => set(() => ({ userId: value })),
  chatState: ChatState.FREE,
  setChatState: (value: ChatState) => set(() => ({ chatState: value }))
}));

export default useBaseStore;