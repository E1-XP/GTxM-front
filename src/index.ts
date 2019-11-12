import { initApp } from "project-f";

import { initialState } from "./store";
import routes from "./routes";

import { App } from "./app";

initApp(<any>App, document.getElementById("root")!, routes, initialState);
