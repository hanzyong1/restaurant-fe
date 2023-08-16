import Swal from "sweetalert2";

export default {
  install(Vue) {
    Vue.prototype.$responseStatus = (value) => {
      if (value == 200) {
        Swal.fire("Success!", "Restaurant added!", "success");
      } else {
        Swal.fire("Oops!", "Please try again", "error");
      }
    };
  },
};
