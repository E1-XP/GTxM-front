import { html } from "project-f";

import { Props } from "./index";

export default ({ value }: Props) =>
  html`
  <div class="page_preloader">
      <span class="page_preloader__counter">
            ${value}
      </span>
  </div>
`;
