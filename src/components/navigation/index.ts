import { Component } from "project-f";

import template from "./template";

import { State } from "../../store";

export interface Props {
  getMenuItems: () => string[];
}

export class Navigation extends Component {
  onMount = () => {
    const { menuImages } = this.model.getState<State>();

    menuImages!.forEach((itm, i) => {
      const domRef: any = document.getElementById(`js-menu-item-${i + 1}`);

      domRef &&
        domRef.closest("li").addEventListener("click", this.handleMenuClick);
    });
  };

  onUnmount = () => {
    const { menuImages } = this.model.getState<State>();

    menuImages!.forEach((itm, i) => {
      const domRef: any = document.getElementById(`js-menu-item-${i + 1}`);

      domRef &&
        domRef.closest("li").removeEventListener("click", this.handleMenuClick);
    });
  };

  handleMenuClick = (e: any) => {
    const { currentPart } = this.model.getState();

    const parts = ["one", "two", "three", "four"];
    const clickedPart = Number(e.target.closest("li").dataset.idx);
    const differentPart = clickedPart + 1 !== currentPart;

    const deferRouteChange = () =>
      this.router.routeTo(`/${parts[clickedPart]}`);

    this.model.setState({ isMenuOpen: false });
    if (differentPart) setTimeout(deferRouteChange, 500);
  };

  getMenuItems = () => {
    const { currentPart, menuImages } = this.model.getState<State>();

    return menuImages!.map((itm, i) => {
      const isActive = currentPart === i + 1;
      const getClass = () => (isActive ? "list__item--active" : "");

      return `<li class="list__item ${getClass()}" data-idx=${i}>
            <a id="js-menu-item-${i + 1}">
              <span style="background:url(${itm})">${i + 1}</span>
            </a>
         </li>`;
    });
  };

  render() {
    return template({ getMenuItems: this.getMenuItems });
  }
}
