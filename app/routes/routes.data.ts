import { Route } from "./routes.types";
import FormRouter from "../modules/form/form.routes";
import UserRouter from "../modules/user/user.routes";
import TrackRouter from "../modules/track/track.routes";
import RoleRouter from "../modules/role/role.routes";

export const routes = [
  new Route("/user", UserRouter),
  new Route("/form", FormRouter),
  new Route("/track", TrackRouter),
  new Route("/role", RoleRouter),
];

export const excludedPaths = [
  { method: "POST", route: "/user/login" },
  { method: "GET", route: "/user/display" },
  { method: "GET", route: "/role/display" },
  { method: "GET", route: "/track/display" },
];
