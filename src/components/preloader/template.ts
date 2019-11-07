import { html } from "project-f";

import { Props } from "./index";

export default ({ loadStatus }: Props) =>
  html`
  <div class="page_preloader">
      <span class="page_preloader__counter">
            ${loadStatus < 10 ? "0" + loadStatus : loadStatus}
      </span>
  </div>
`;

// add smoke, sparks, flow
