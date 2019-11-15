import { Component } from "project-f";
import throttle from "lodash.throttle";

import template from "./template";

import { State } from "../../store";

export interface Props {
  getPartName: () => string;
  currentPart: number | undefined;
}

export class Header extends Component {
  props = ["currentPart"];

  menuBtn: HTMLElement | null = null;
  baSectionBtn: HTMLElement | null = null;
  headerAnchor: HTMLElement | null = null;

  isResizedBelow340px = window.innerWidth < 340;

  onMount() {
    this.menuBtn = document.getElementById("js-change-section");
    this.baSectionBtn = document.getElementById("js-before-after");
    this.headerAnchor = document.getElementById("js-header-logo");

    this.menuBtn &&
      this.menuBtn.addEventListener("click", this.handleMenuClick);
    this.baSectionBtn &&
      this.baSectionBtn.addEventListener("click", this.handleBaSectionClick);
    this.headerAnchor &&
      this.headerAnchor.addEventListener("click", this.handleHeaderLogoClick);

    window.addEventListener("resize", this.onResize);
  }

  onUnmount() {
    this.menuBtn &&
      this.menuBtn.removeEventListener("click", this.handleMenuClick);
    this.baSectionBtn &&
      this.baSectionBtn.removeEventListener("click", this.handleBaSectionClick);
    this.headerAnchor &&
      this.headerAnchor.removeEventListener(
        "click",
        this.handleHeaderLogoClick
      );

    window.removeEventListener("resize", this.onResize);
  }

  onResize = throttle(() => {
    const isSmallEnough = window.innerWidth < 340;

    if (isSmallEnough) {
      this.isResizedBelow340px = true;
      this.forceRerender();
    } else if (this.isResizedBelow340px) {
      this.isResizedBelow340px = false;
      this.forceRerender();
    }
  }, 1000 / 60);

  handleMenuClick = (e: any) => {
    const { isMenuOpen } = this.model.getState();
    this.model.setState(() => ({ isMenuOpen: !isMenuOpen }));
  };

  handleHeaderLogoClick = () => {
    this.router.routeTo("/");
  };

  handleBaSectionClick = () => {
    const { currentPart } = this.model.getState();

    this.router.routeTo(currentPart === 5 ? "/" : "/ba");
  };

  getPartName = () => {
    const { currentPart } = this.model.getState<State>();
    const partNames = ["One", "Two", "Three", "Four"];

    const isSmallEnough = window.innerWidth < 340;
    const partText = isSmallEnough
      ? currentPart
      : currentPart && partNames[currentPart - 1];

    return `Part ${partText}`;
  };

  render() {
    const { currentPart } = this.model.getState();

    return template({
      currentPart,
      getPartName: this.getPartName
    });
  }
}
