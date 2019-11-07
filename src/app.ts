import { run, html } from "project-f";

import { Component } from "project-f";

import { Preloader } from "./components/preloader";
import { Page } from "./components/page";

export class App extends Component {
  props = ["isLoading"];

  render(): HTMLTemplateElement {
    const { isLoading } = this.model.getState();

    return html`
        <div class="container">
            ${isLoading ? run(Preloader, "pr", this) : run(Page, "pa", this)}
        </div>`;
  }
}
