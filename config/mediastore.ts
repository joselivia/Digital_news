import { create } from "zustand";
interface Media {
  images: string[];
  videos: string[];
}

interface MediaStore {
  mediaMap: Record<number, Media>;
  setMedia: (postId: number, media: Media) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  mediaMap: {},
  setMedia: (postId, media) =>
    set((state) => ({
      mediaMap: {
        ...state.mediaMap,
        [postId]: media,
      },
    })),
}));
