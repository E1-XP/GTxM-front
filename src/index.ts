import { initApp } from "project-f";

import { initialState } from "./store";
import routes from "./routes";

import { App } from "./app";

const rootNode = document.getElementById("root");

initApp(<any>App, routes, initialState).renderToDOM(rootNode!);
