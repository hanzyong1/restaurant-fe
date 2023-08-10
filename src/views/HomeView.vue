<template>
  <div class="home">
    <nav>
      <router-link :to="{ name: 'home' }">Home</router-link> |
      <router-link :to="{ name: 'addCategory' }">Add Category</router-link> |
      <router-link :to="{ name: 'addRestaurant' }">Add Restaurant</router-link>
      |
      <router-link :to="{ name: 'login' }">Login</router-link>
    </nav>
    <h1>RESTAURANTS</h1>
    <div class="main">
      <div
        class="card"
        v-for="restaurant in restaurants"
        v-bind:key="restaurant.id"
        @click="handleClick(restaurant.id)"
      >
        <div class="img-container">
          <img
            :src="baseUrl + restaurant.attributes.image.data[0].attributes.url"
            :alt="restaurant.attributes.image.data[0].attributes.name"
          />
        </div>
        <div class="text-container">
          <div class="name">
            {{ restaurant.attributes.name }}
          </div>
          <div class="description">{{ restaurant.attributes.description }}</div>
        </div>
      </div>
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
    };
  },
  methods: {
    handleClick(value) {
      this.$router.push({ name: "restaurant", params: { id: value } });
    },

    async getCardData() {
      const response = await axios({
        method: "get",
        url: `${this.apiUrl}/restaurants?populate=*`,
      });
      this.restaurants = response.data.data;
    },
  },
  mounted() {
    this.getCardData();
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
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
  height: 70%;
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
  /* border: 1px solid red; */
  margin-left: 10px;
}

.name {
  font-weight: bold;
}
</style>
