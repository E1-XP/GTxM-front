import { Component, html } from "project-f";

import { icon } from "./../shared";
import { scrollTo } from "./../../helpers";

export class Footer extends Component {
  props = [];

  onMount() {
    const btn = document.getElementById("js-to-top");
    btn && btn.addEventListener("click", this.handleClick);
  }

  onUnmount() {
    const btn = document.getElementById("js-to-top");
    btn && btn.removeEventListener("click", this.handleClick);
  }

  handleClick = () => {
    scrollTo(document.querySelector("html")!, 0, 500);
  };

  render() {
    return html`
      <footer class="page_footer">
        <p class="page_footer__text">
          &copy ${new Date().getFullYear()} GTxMotorsports. All rights reserved.
        </p>
        <a class="page_footer__link" id="js-to-top"
          >${icon("arrow_drop_up")} To Top</a
        >
      </footer>
    `;
  }
}
