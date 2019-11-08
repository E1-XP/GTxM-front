export interface ImageData {
  dir: string;
  thumbnail: string;
  id: number;
  likes: number;
}

export interface State {
  isLoading: boolean;
  loadStatus: number;
  isMenuOpen: boolean;
  isSliderRunning: boolean;
  isLightboxOpen: boolean;
  currentSlide: number;
  currentPart: number;
  images: ImageData[];
  menuImages: string[];
  extractedColors: any[];
  slideInterval: number;
}

export const initialState: Partial<State> = {
  isLoading: true,
  loadStatus: 0,
  isMenuOpen: false,
  isSliderRunning: false,
  isLightboxOpen: false,
  images: [],
  menuImages: [],
  currentSlide: 0,
  currentPart: 1,
  extractedColors: [],
  slideInterval: 4500
};
