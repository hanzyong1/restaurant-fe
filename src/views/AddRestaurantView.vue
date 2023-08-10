<template>
  <div class="add-restaurant">
    <BackButton />
    <h1>Add a New Restaurant</h1>
    <form>
      <label for="name">Name: </label>
      <input type="text" id="name" v-model="restaurant.name" />
      <label for="description">Description: </label>
      <textarea
        id="description"
        v-model.trim="restaurant.description"
      ></textarea>
      <label for="address">Address: </label>
      <input type="text" id="address" />
      <label for="phone">Phone: </label>
      <input type="text" id="phone" />
      <label for="website">Website: </label>
      <input type="text" id="website" />
    </form>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: { BackButton },
  data() {
    return {
      restaurant: {
        name: "",
        description: "",
        address: "",
        phone: "",
        website: "",
      },
    };
  },
};
</script>

<style scoped>
h1 {
  display: flex;
  justify-content: center;
}
</style>
