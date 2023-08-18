import Swal from "sweetalert2";
import router from "@/router";

export default {
  install(Vue) {
    Vue.prototype.$responseStatus = (value) => {
      if (value == 200) {
        Swal.fire("Success!", "Restaurant added!", "success").then(() => {
          router.push({ name: "home" });
        });
      } else {
        Swal.fire("Oops!", "Please try again", "error");
      }
    };
    Vue.prototype.$denyAccess = () => {
      Swal.fire("Denied!", "You do not have permission to do this", "error");
    };
  },
};
