<template>
  <div class="page">
    <BackButton />
    <div class="add-category">
      <h1>Add a Category</h1>
      <form ref="form" v-on:submit.prevent="postCategoryData">
        <label for="newCategory">Category Name: </label>
        <input type="text" id="newCategory" v-model="newCategory" required />

        <div class="select">
          <p class="title">Select a Restaurant</p>
          <select v-model="selectedRestaurantId">
            <option disabled value="">Select a restaurant</option>
            <option
              v-for="restaurant in restaurants"
              :key="restaurant.id"
              :value="restaurant.id"
            >
              {{ restaurant.attributes.name }}
            </option>
          </select>
        </div>

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
import axios from "axios";

export default {
  components: { BackButton },
  data() {
    return {
      newCategory: "",
      restaurants: [],
      selectedRestaurantId: "",
    };
  },
  methods: {
    // get all restaurants to allow for select
    async getRestaurantsData() {
      try {
        const response = await axios({
          method: "get",
          url: `/restaurants?fields[0]=name`,
        });
        this.restaurants = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    // add new category to backend
    async postCategoryData() {
      try {
        const response = await axios({
          method: "post",
          url: `/categories`,
          data: {
            data: {
              name: this.newCategory,
              restaurants: {
                set: [
                  {
                    id: this.selectedRestaurantId,
                  },
                ],
              },
            },
          },
        });
        this.$responseStatus(response.request.status);
        console.log(response);
      } catch (error) {
        this.$denyAccess();
      }
    },

    // reset input fields
    resetForm() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    this.getRestaurantsData();
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

.add-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form,
.select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 500px;
}

.select {
  margin-bottom: 50px;
}

input {
  margin-bottom: 20px;
  width: 100%;
  padding: 5px;
}

label,
.title {
  font-weight: bold;
}

select {
  padding: 5px;
  width: 100%;
}

.select p {
  margin-bottom: 5px;
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
