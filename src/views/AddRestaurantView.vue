<template>
  <div class="page">
    <BackButton />
    <div class="add-restaurant">
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
        <input type="text" id="address" v-model="restaurant.address" />
        <label for="phone">Phone: </label>
        <input type="text" id="phone" v-model="restaurant.phone" />
        <label for="website">Website: </label>
        <input type="text" id="website" v-model="restaurant.website" />
        <div class="checkboxes">
          <p class="title">Cuisine:</p>
          <div class="checkboxes-flex">
            <div v-for="category in restaurant.categories" :key="category.id">
              <label for="category.attributes.name">{{
                category.attributes.name
              }}</label>
              <input
                type="checkbox"
                :id="category.attributes.name"
                :value="category.attributes.name"
                v-model="restaurant.selectedCategories"
              />
            </div>
          </div>
        </div>
        <div class="checkboxes">
          <p class="title">Closed On:</p>
          <div class="checkboxes-flex">
            <div v-for="day in restaurant.closingDays" :key="day.id">
              <label for="day.attributes.day">{{ day.attributes.day }}</label>
              <input
                type="checkbox"
                :id="day.attributes.day"
                :value="day.attributes.day"
                v-model="restaurant.selectedClosingDays"
              />
            </div>
          </div>
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
      apiUrl: process.env.VUE_APP_API_URL,
      restaurant: {
        name: "",
        description: "",
        address: "",
        phone: "",
        website: "",
        categories: [],
        selectedCategories: [],
        closingDays: [],
        selectedClosingDays: [],
      },
    };
  },
  methods: {
    async getCategoryData() {
      const response = await axios({
        method: "get",
        url: `${this.apiUrl}/categories?populate[0]=name`,
      });

      this.restaurant.categories = response.data.data;
    },

    async getDaysData() {
      const response = await axios({
        method: "get",
        url: `${this.apiUrl}/days?populate[0]=day`,
      });

      this.restaurant.closingDays = response.data.data;
    },
  },
  mounted() {
    this.getCategoryData();
    this.getDaysData();
  },
};
</script>

<style scoped>
.page {
  background-color: white;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
}
.add-restaurant {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
h1 {
  text-align: center;
  margin-bottom: 50px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 500px;
}

input,
textarea {
  margin-bottom: 20px;
  width: 100%;
  padding: 5px;
}

label,
.title {
  font-weight: bold;
}

.checkboxes {
  text-align: left;
  width: 100%;
}

.checkboxes-flex {
  display: flex;
  column-gap: 20px;
  flex-wrap: wrap;
  padding-left: 20px;
}

.checkboxes-flex div {
  display: flex;
  flex-direction: column;
}
</style>
