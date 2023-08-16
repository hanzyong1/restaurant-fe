<template>
  <div class="page">
    <nav>
      <router-link :to="{ name: 'home' }">Home</router-link> |
      <router-link :to="{ name: 'addCategory' }">Add Category</router-link> |
      <router-link :to="{ name: 'addRestaurant' }">Add Restaurant</router-link>
      |
      <router-link :to="{ name: 'login' }">Login</router-link>
    </nav>
    <h1>RESTAURANTS</h1>
    <div class="category-buttons">
      <button @click="handleCategory('all')">All</button>
      <button
        v-for="category in categories"
        :key="category.id"
        @click="handleCategory(category.attributes.name)"
      >
        {{ category.attributes.name | capitalize }}
      </button>
    </div>
    <div class="main">
      <template v-for="restaurant in restaurants">
        <div
          class="card"
          v-bind:key="restaurant.id"
          @click="handleClick(restaurant.id)"
        >
          <div class="img-container">
            <img
              v-if="restaurant.attributes.image.data == null"
              src="../assets/Image_not_available.png"
              alt="Image not available"
            />
            <img
              v-else
              :src="
                baseUrl + restaurant.attributes.image.data[0].attributes.url
              "
              :alt="restaurant.attributes.image.data[0].attributes.name"
            />
          </div>
          <div class="text-container">
            <div class="name">
              {{ restaurant.attributes.name }}
            </div>
            <div class="description">
              {{ restaurant.attributes.description }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      baseUrl: process.env.VUE_APP_BASE_URL,
      restaurants: [],
      categories: [],
    };
  },
  methods: {
    handleClick(value) {
      this.$router.push({ name: "restaurant", params: { id: value } });
    },

    async handleCategory(category) {
      if (category == "all") {
        this.getCardData();
      } else {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/restaurants?filters[categories][name][$eqi]=${category}&populate=*`,
        });
        this.restaurants = response.data.data;
      }
    },

    async getCategoryData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/categories?populate[0]=name`,
        });
        this.categories = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getCardData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/restaurants?populate=*`,
        });
        this.restaurants = response.data.data;

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getCardData();
    this.getCategoryData();
  },
};
</script>

<style scoped>
.page {
  background-color: beige;
  min-height: 100dvh;
}

.category-buttons {
  display: flex;
  justify-content: end;
  margin: 20px;
  gap: 10px;
}

.category-buttons button {
  padding: 6px 8px;
  font-weight: bold;
}

.main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  padding-bottom: 50px;
}

nav {
  text-align: left;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 30px;
}
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  height: 300px;
  width: 350px;
  gap: 10px;
  overflow: hidden;
  padding: 10px;
  border-radius: 8px;
}

.card:hover {
  cursor: pointer;
  border: 1.5px solid black;
}
.img-container {
  min-height: 70%;
  margin-bottom: 5px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  text-align: start;
}
.text-container * {
  margin-left: 10px;
}

.name {
  font-weight: bold;
}
</style>
