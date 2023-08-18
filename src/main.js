import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import $responseStatus from "../plugins/plugin";
import $denyAccess from "../plugins/plugin";
import axios from "axios";

Vue.config.productionTip = false;

// Global Axios defaults
axios.defaults.baseURL = "http://localhost:1337/api";

// Axios interceptors
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

// Plugins
Vue.use($responseStatus);
Vue.use($denyAccess);

// Filters
Vue.filter("capitalize", function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
