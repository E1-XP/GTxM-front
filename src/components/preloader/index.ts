import { Component } from "project-f";
import { State } from "./../../store";
import * as effects from "./../../effects";

import template from "./template";

export interface Props {
  value: string;
}

export class Preloader extends Component {
  props = ["loadStatus", "currentPart"];

  onMount() {
    const { currentPart } = this.model.getState();

    currentPart !== undefined && effects.getImages(currentPart);

    effects.populateLocalStorage();
  }

  computeText() {
    const { loadStatus } = <State>this.model.getState();
    return loadStatus < 10 ? `0${loadStatus}` : `${loadStatus}`;
  }

  render() {
    const value = this.computeText();

    return template({ value });
  }
}
