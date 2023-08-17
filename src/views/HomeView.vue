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
      <button @click="handleCategoryClick('all')">All</button>
      <button
        v-for="category in categories"
        :key="category.id"
        @click="handleCategoryClick(category.attributes.name)"
      >
        {{ category.attributes.name | capitalize }}
      </button>
    </div>

    <div class="main">
      <template v-for="restaurant in restaurants">
        <div
          class="card"
          v-bind:key="restaurant.id"
          @click="handleRestaurantClick(restaurant.id)"
        >
          <div class="img-container">
            <img
              v-if="restaurant.attributes.image.data == null"
              src="../assets/Image_not_available.png"
              alt="Image not available"
            />
            <img
              v-else
              :src="baseUrl + restaurant.attributes.image.data.attributes.url"
              :alt="restaurant.attributes.image.data.attributes.name"
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

    <div class="pagination-container">
      <button class="pagination-button" @click="prevPage">&lt;</button>
      <div class="pagination-numbers">
        <button
          class="pagination-number"
          v-for="number in numberOfPages"
          :key="number"
          :class="{ active: currentPage == number }"
          @click="setCurrentPage(number)"
        >
          {{ number }}
        </button>
      </div>
      <button class="pagination-button" @click="nextPage">&gt;</button>
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
      currentCategory: "all",
      pageSize: 6,
      numberOfPages: null,
      currentPage: 1,
    };
  },
  methods: {
    // route to individual restaurant page
    handleRestaurantClick(value) {
      this.$router.push({ name: "restaurant", params: { id: value } });
    },

    // display number of pages depending on category
    setNumberOfPages(restaurants) {
      this.numberOfPages = Math.ceil(restaurants.length / this.pageSize);
    },

    // previous page button
    prevPage() {
      this.currentPage -= 1;
      if (this.currentPage <= 0) {
        this.currentPage = 1;
      }
      this.setCurrentPage(this.currentPage);
    },

    // next page button
    nextPage() {
      this.currentPage += 1;
      if (this.currentPage >= this.numberOfPages) {
        this.currentPage = this.numberOfPages;
      }
      this.setCurrentPage(this.currentPage);
    },

    // get current page data
    setCurrentPage(page) {
      this.currentPage = page;
      this.getPageData(this.currentCategory);
    },

    // display restaurants based on category
    handleCategoryClick(category) {
      this.currentCategory = category;

      if (this.currentCategory == "all") {
        this.currentPage = 1;
        this.getAllRestaurantsData();
      }
      this.getPageData(this.currentCategory);

      this.setNumberOfPages(this.restaurants);
    },

    // get data for each category
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

    // get all restaurants data
    async getAllRestaurantsData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/restaurants?populate=*`,
        });
        // get total number of pages for all restaurants
        this.setNumberOfPages(response.data.data);
      } catch (error) {
        console.log(error);
      }
    },

    // get data for a single page
    async getPageData(category) {
      try {
        if (this.currentCategory == "all") {
          const response = await axios({
            method: "get",
            url: `${this.apiUrl}/restaurants?pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}&populate=*`,
          });
          // populate restaurants data for this page
          this.restaurants = response.data.data;
        } else {
          const response = await axios({
            method: "get",
            url: `${this.apiUrl}/restaurants?filters[categories][name][$eqi]=${category}&pagination[pageSize]=${this.pageSize}&pagination[page]=${this.currentPage}&populate=*`,
          });

          // populate restaurants data for this page for this category
          this.restaurants = response.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getAllRestaurantsData();
    this.getCategoryData();
    this.getPageData(this.currentCategory);
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

.main > * {
  flex: 0 0 25%;
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

.pagination-container {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  justify-content: center;
  margin: 10px;
}
.pagination-number,
.pagination-button {
  font-size: 1.1rem;
  background-color: transparent;
  border: none;
  margin: 0.25rem 0.25rem;
  cursor: pointer;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.2rem;
}
.pagination-number:hover,
.pagination-button:not(.disabled):hover {
  background: #bbb;
}
.pagination-number.active {
  color: #fff;
  background: #0085b6;
}
</style>
