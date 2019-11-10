import { html, run } from "project-f";

import { Props } from "./index";

import { SliderNavigation } from "../sliderNavigation";

export default ({
  images,
  getImageList,
  currentSlide,
  parentRef
}: Props) => html`
  <div class="image_slider">
    <figure class="image_slider__content">
      ${images && getImageList()}
      <nav class="content__navigation"></nav>
    </figure>
    <section class="image_slider__info">
      <div class="info__slide_count">
        ${images &&
          currentSlide !== undefined &&
          currentSlide / 2 + 1 + " / " + images.length / 2}
      </div>
      <p class="info__description--ba">test description</p>
    </section>
    ${run(SliderNavigation, "basn", parentRef)}
  </div>
`;
