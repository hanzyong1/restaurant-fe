import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddCategoryView from "../views/AddCategoryView.vue";
import AddRestaurantView from "../views/AddRestaurantView.vue";
import LoginView from "../views/LoginView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/add-category",
    name: "addCategory",
    component: AddCategoryView,
  },
  {
    path: "/add-restaurant",
    name: "addRestaurant",
    component: AddRestaurantView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
