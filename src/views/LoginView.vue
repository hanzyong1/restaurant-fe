<template>
  <div class="page">
    <BackButton />
    <div class="login">
      <h1>Login</h1>
      <form ref="form" v-on:submit.prevent="loginRequest">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />

        <label for="email">Email:</label>
        <input type="text" id="email" v-model="email" required />

        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" minlength="6" />

        <div class="buttons">
          <button @click="resetForm">Reset</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
    <div class="logout-button">
      <p v-if="token">You are logged in!</p>
      <p v-else>You are not logged in</p>
      <button @click="logoutRequest">Logout</button>
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: { BackButton },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    // reset form input fields
    resetForm() {
      this.$refs.form.reset();
    },

    // login authorization
    async loginRequest() {
      try {
        const response = await axios({
          method: "post",
          url: `/auth/local`,
          data: {
            identifier: this.username,
            password: this.password,
          },
        });
        localStorage.setItem("token", response.data.jwt);
        await Swal.fire("Success!", "You have logged in", "success");
        this.$router.push({ name: "home" });
      } catch (error) {
        Swal.fire("Denied!", "Incorrect login credentials", "error");
      }
    },

    async logoutRequest() {
      localStorage.removeItem("token");
      await Swal.fire("Success!", "You have logged out", "success");
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
.page {
  background-color: white;
  height: 100dvh;
  text-align: left;
}

h1 {
  text-align: center;
  margin-bottom: 50px;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 500px;
}

input {
  margin-bottom: 20px;
  width: 100%;
  padding: 5px;
}

label {
  font-weight: bold;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-bottom: 50px;
}

button {
  padding: 10px;
  font-weight: bold;
}
.logout-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.logout-button p {
  font-weight: bold;
}

.logout-button button:hover {
  background-color: red;
}
</style>
