<template>
  <div class="page">
    <BackButton />
    <div class="login">
      <h1>LOGIN</h1>
      <form ref="form" v-on:submit.prevent="">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />

        <label for="password">Password:</label>
        <input type="text" id="password" v-model="password" />

        <div class="buttons">
          <button @click="resetForm">Reset</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: { BackButton },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
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
  align-items: start;
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
}

button {
  padding: 10px;
  font-weight: bold;
}
</style>
