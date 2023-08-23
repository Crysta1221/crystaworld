import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/view/home.vue";  // 追記
import About from "../components/view/about.vue"
import Works from "../components/view/works.vue"
import Info from "../components/view/info.vue"
import Contact from "../components/view/contact.vue"
import Privacy from "../components/view/privacy.vue"
import Terms from "../components/view/terms.vue"
import Donate from "../components/view/donate.vue"
import notfound from "../components/view/404.vue"


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/services",
    name: "Service",
    component: Works,
  },
  {
    path: "/info",
    name: "Info",
    component: Info,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/policy",
    name: "Privacy",
    component: Privacy,
  },
  {
    path: "/terms",
    name: "Terms",
    component: Terms,
  },
  {
    path: "/donate",
    name: "Donate",
    component: Donate,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: notfound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;