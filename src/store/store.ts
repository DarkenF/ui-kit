import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Directory {}

export interface DirectoryStore {
  directory: Directory;
}

export const useDirectoryStore = create<DirectoryStore>()(
  immer(() => ({
    directory: {},
  })),
);
