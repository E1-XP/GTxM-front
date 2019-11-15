import { html, Component } from "project-f";

import { State } from "../../store";

import config from "../../config";
const { API_URL: URL } = config;

export class SliderNavigation extends Component {
  props = ["images", "currentSlide", "currentPart"];
  images: HTMLImageElement[] = [];

  onMount() {
    this.observeThumbnails();
  }

  observeThumbnails() {
    const images = document.querySelectorAll(".image_slider__navigation img");

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          const element = entry.target;
          const src = element.getAttribute("data-src");

          const img = new Image();
          img.src = src!;

          const isImgLoadedBefore = this.images.find(img => img.src === src);
          if (!isImgLoadedBefore) this.images.push(img);

          const appendFullSrc = () => element.setAttribute("src", img.src);

          if (!isImgLoadedBefore) {
            img.addEventListener("load", appendFullSrc);
          } else appendFullSrc();
        }
      });
    });

    images && images.forEach(image => obs.observe(image));
  }

  getThumbnails = (isCompareSlider = false) => {
    const { images, currentSlide, currentPart } = this.model.getState<State>();
    const currSlide = isCompareSlider ? currentSlide! + 1 : currentSlide;

    const isImgActive = (idx: number) => currSlide === idx;
    const getModifier = (idx: number) => (isImgActive(idx) ? "active" : "");

    if (!images) return "";

    return images.map((itm, idx) => {
      if (isCompareSlider && !(idx % 2)) return "";

      const imgId = `img-thumb-${currentPart}-${idx}`;
      const lazySrc = `${URL}/${itm.lazy}`;
      const src = `${URL}/${itm.thumbnail}`;

      const isImgLoadedBefore = this.images.find(img => img.src === src);

      return html`
        <li class="navigation__item ${getModifier(idx)}" data-idx=${idx}>
          <span class="item__cover"></span>
          <img
            id="${imgId}"
            src="${isImgLoadedBefore ? src : lazySrc}"
            data-src="${src}"
            alt="gallery thumbnail"
          />
        </li>
      `;
    });
  };

  render() {
    const { images, currentPart } = this.model.getState<State>();
    const isCompareSlider = currentPart === 5;

    return html`
      <nav class="image_slider__navigation">
        <ul class="navigation__list">
          ${images && this.getThumbnails(isCompareSlider)}
        </ul>
      </nav>
    `;
  }
}
