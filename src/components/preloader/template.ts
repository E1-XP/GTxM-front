import { html } from "project-f";

import { Props } from "./index";

export default ({ value }: Props) => {
  if (value === "00") {
    return html`
      <div class="page_preloader">
        <span class="page_preloader__content">
          Connecting...
        </span>
      </div>
    `;
  }

  return html`
    <div class="page_preloader">
      <span class="page_preloader__counter">
        ${value}
      </span>
    </div>
  `;
};
