import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddCategoryView from "../views/AddCategoryView.vue";
import AddRestaurantView from "../views/AddRestaurantView.vue";
import LoginView from "../views/LoginView.vue";
import RestaurantView from "../views/RestaurantView.vue";
import EditRestaurantView from "../views/EditRestaurantView.vue";
import Swal from "sweetalert2";

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
    path: "/edit-restaurant/:id",
    name: "editRestaurant",
    component: EditRestaurantView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/restaurant/:id",
    name: "restaurant",
    component: RestaurantView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  let isAuthenticated = localStorage.getItem("token");
  if (
    !isAuthenticated &&
    (to.name === "addCategory" ||
      to.name === "addRestaurant" ||
      to.name === "editRestaurant")
  ) {
    Swal.fire("Denied", "Please log in!", "error");
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
