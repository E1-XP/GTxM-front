import { Component, IComponent } from "project-f";

import { State } from "./../../store";
import { addLike, ImgLikesData } from "./../../effects";

import template from "./template";

import config from "./../../config";
const { API_URL: URL } = config;

export interface Props {
  images: any[] | undefined;
  currentSlide: number | undefined;
  isSliderRunning: boolean | undefined;
  isLightboxOpen: boolean | undefined;
  getImageList: () => string[] | string;
  getLikes: (idx: number) => string;
  checkIfLiked: (idx: number) => boolean;
  parentRef: IComponent;
}

export class Slider extends Component {
  props = ["images", "currentSlide", "isSliderRunning", "isLightboxOpen"];

  backBtn: HTMLElement | null = null;
  stopStartBtn: HTMLElement | null = null;
  getFullSizeBtn: HTMLElement | null = null;
  toggleLightboxBtn: HTMLElement | null = null;
  lightboxElem: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;
  likeBtn: HTMLElement | null = null;
  progressBar: HTMLElement | null = null;

  onMount() {
    this.backBtn = document.getElementById("js-slider-back");
    this.stopStartBtn = document.getElementById("js-slider-stop");
    this.getFullSizeBtn = document.getElementById("js-slider-getimg");
    this.nextBtn = document.getElementById("js-slider-next");
    this.lightboxElem = document.getElementById("js-lightbox")!;
    this.toggleLightboxBtn = document.getElementById("js-slider-fullscreen");
    this.likeBtn = document.getElementById("js-likes-btn");
    this.progressBar = document.querySelector(".navigation__progress");

    this.appendListeners();
    this.stopStartSlider();
  }

  onUnmount() {
    this.stopSlider();
    this.detachListeners();
  }

  onUpdate<State>(prevS: any, state: any) {
    const { isLightboxOpen, isSliderRunning, currentSlide } = state;

    if (isLightboxOpen) {
      this.lightboxElem?.addEventListener("click", this.toggleLightbox);
    } else {
      this.lightboxElem?.removeEventListener("click", this.toggleLightbox);
    }

    const shouldTriggerReflow = currentSlide !== prevS.currentSlide;

    if (isSliderRunning) {
      this.progressBar?.classList.remove("is-open");
      shouldTriggerReflow && void this.progressBar?.offsetWidth;

      this.progressBar?.classList.add("is-open");
    } else {
      this.progressBar?.classList.remove("is-open");
    }
  }

  appendListeners = () => {
    this.backBtn?.addEventListener("click", this.prevSlide);
    this.stopStartBtn?.addEventListener("click", this.stopStartSlider);
    this.toggleLightboxBtn?.addEventListener("click", this.toggleLightbox);
    this.getFullSizeBtn?.addEventListener("click", this.getFullImage);
    this.nextBtn?.addEventListener("click", this.nextSlide);
    this.likeBtn?.addEventListener("click", this.handleLikeClick);

    document.addEventListener("keydown", this.enableKeySteering);
    this.addThumbnailListeners();
  };

  detachListeners = () => {
    const { isLightboxOpen } = this.model.getState();

    this.backBtn?.removeEventListener("click", this.prevSlide);
    this.stopStartBtn?.removeEventListener("click", this.stopStartSlider);
    this.toggleLightboxBtn?.removeEventListener("click", this.toggleLightbox);
    this.getFullSizeBtn?.removeEventListener("click", this.getFullImage);
    this.nextBtn?.removeEventListener("click", this.nextSlide);
    this.likeBtn?.removeEventListener("click", this.handleLikeClick);
    isLightboxOpen &&
      this.lightboxElem?.removeEventListener("click", this.toggleLightbox);

    document.removeEventListener("keydown", this.enableKeySteering);

    this.removeThumbnailListeners();
  };

  nextSlide = (e: any) => {
    const { currentSlide, images, isSliderRunning } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const onLastSlide = currentSlide >= images.length - 1;

    if (e.type !== "click" || (e.screenX && e.screenY)) {
      this.stopSlider();
    }

    this.model.setState(() => ({
      currentSlide: onLastSlide ? 0 : currentSlide + 1
    }));
  };

  prevSlide = () => {
    const { currentSlide, images } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const inFirstSlide = currentSlide === 0;

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }

    this.model.setState(() => ({
      isSliderRunning: false,
      currentSlide: inFirstSlide ? images.length - 1 : currentSlide + -1
    }));
  };

  stopStartSlider = () => {
    const { isSliderRunning, slideInterval } = this.model.getState();
    const handleClick = () => this.nextBtn && this.nextBtn.click();

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    } else {
      (<any>window).sliderInterval = setInterval(handleClick, slideInterval);
    }

    this.model.setState<State>(state => ({
      isSliderRunning: !state.isSliderRunning
    }));
  };

  stopSlider = () => {
    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }

    this.model.setState(() => ({ isSliderRunning: false }));
  };

  enableKeySteering = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 39:
        this.nextSlide(e);
        return;
      case 37:
        this.prevSlide();
        return;
      case 32:
        this.stopStartSlider();
        return;
      default:
        return;
    }
  };

  getFullImage = (e: any) => {
    const img: any = document.querySelector(
      ".image_slider__content .content__item.active img"
    );
    img && window.open(img.src, "_blank");
  };

  toggleLightbox = () => {
    const { isLightboxOpen } = this.model.getState();
    this.model.setState(() => ({ isLightboxOpen: !isLightboxOpen }));
  };

  getClassNames = (length: number, idx: number) => {
    const { currentSlide } = this.model.getState<State>();
    const currElem: any = document.querySelector(
      ".image_slider .content__list .active"
    );

    if (currentSlide === undefined) {
      throw new Error("store probably crashed");
    }

    // its taken from DOM before update occurs
    const prevActiveIdx = currElem
      ? Number(currElem.dataset.idx)
      : currentSlide;

    const isCurrent = idx === currentSlide;
    const isDecremented =
      (prevActiveIdx === 0 && currentSlide === length - 1) ||
      currentSlide < prevActiveIdx;

    const getBackSlideIdx = (idx: number) => {
      const equals = (val: number) => val === idx;

      if (Math.abs(currentSlide - prevActiveIdx) > 1) {
        return equals(prevActiveIdx);
      }
      return equals(isDecremented ? currentSlide + 1 : currentSlide - 1);
    };

    return `content__item${isCurrent ? " active" : ""}${
      getBackSlideIdx(idx) ? " back" : ""
    }`;
  };

  getImageList = () => {
    const { images } = this.model.getState<State>();

    if (!images) return "";

    return images.map(
      (itm, i, arr) =>
        `<li class="${this.getClassNames(arr.length, i)}" data-idx="${i}">
            <img src="${URL}/${itm.dir}" alt="high performance vehicle"> 
         </li>` // TODO alt attr can be taken from image description
    );
  };

  addThumbnailListeners = () => {
    const domRefs = document.querySelectorAll(
      ".image_slider__navigation .item__cover"
    );

    domRefs &&
      Array.from(domRefs).forEach(ref => {
        ref.addEventListener("click", this.handleThumbnailClick);
      });
  };

  removeThumbnailListeners = () => {
    const domRefs = document.querySelectorAll(
      ".image_slider__navigation .item__cover"
    );

    domRefs &&
      Array.from(domRefs).forEach(ref => {
        ref.removeEventListener("click", this.handleThumbnailClick);
      });
  };

  handleThumbnailClick = (e: any) => {
    const currentSlide = Number(e.target.closest("li").dataset.idx);

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }

    this.model.setState(() => ({ currentSlide, isSliderRunning: false }));
  };

  handleLikeClick = () => {
    const { currentPart, currentSlide } = this.model.getState<State>();

    if (!this.checkIfLiked(currentSlide!)) {
      addLike(currentPart!, currentSlide!);
    }
  };

  checkIfLiked = (slideNum: number) => {
    const { currentPart } = this.model.getState<State>();

    const stringified = localStorage.getItem("data");
    if (!stringified) return false;

    const data: ImgLikesData = JSON.parse(stringified);
    return data[currentPart!][slideNum];
  };

  getLikes = (idx: number) => {
    const { images } = this.model.getState();
    if (!images) return "0";

    return Number(images[idx].likes).toString();
  };

  render(): HTMLTemplateElement {
    const {
      images,
      currentSlide,
      isSliderRunning,
      isLightboxOpen
    } = this.model.getState<State>();

    return template({
      images,
      currentSlide,
      isSliderRunning,
      isLightboxOpen,
      getImageList: this.getImageList,
      getLikes: this.getLikes,
      checkIfLiked: this.checkIfLiked,
      parentRef: this
    });
  }
}
