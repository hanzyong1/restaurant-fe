<template>
  <div class="page">
    <BackButton />
    <div class="login">login / register</div>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: { BackButton },
  data() {
    return {};
  },
};
</script>

<style scoped>
.page {
  background-color: white;
  height: 100vh;
  text-align: left;
}
</style>
