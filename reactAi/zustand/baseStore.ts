import { create } from 'zustand';
import { ChatState } from '../src/types/chat';

export interface baseStoreState {
  userId: number;
  chatState: ChatState
  token: string;

  setUserId: (value: number) => void;
  setChatState: (value: ChatState) => void;
  setToken: (value: string) => void;
}

const useBaseStore = create<baseStoreState>((set) => ({
  userId: 0,
  chatState: ChatState.FREE,
  token: '',

  setUserId: (value: number) => set(() => ({ userId: value })),
  setChatState: (value: ChatState) => set(() => ({ chatState: value })),
  setToken: (value: string) => set(() => ({ token: value }))
}));

export default useBaseStore;