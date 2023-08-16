<template>
  <div class="page">
    <BackButton />
    <div class="add-restaurant">
      <h1>Add a New Restaurant</h1>
      <form ref="form" v-on:submit.prevent="postRestaurantData">
        <label for="name">Name: </label>
        <input type="text" id="name" v-model="restaurant.name" required />

        <label for="description">Description: </label>
        <textarea
          id="description"
          v-model.trim="restaurant.description"
          rows="3"
        ></textarea>

        <label for="address">Address: </label>
        <input type="text" id="address" v-model="restaurant.address" />

        <label for="phone">Phone: </label>
        <input name="phone" type="text" id="phone" v-model="restaurant.phone" />

        <label for="website">Website: </label>
        <input type="text" id="website" v-model="restaurant.website" />

        <label for="mainImage">Upload Main Image</label>
        <input type="file" id="mainImage" @change="handleMainChange" />

        <label for="menuImage">Upload Menu Images</label>
        <input type="file" id="menuImage" @change="handleMenuChange" multiple />

        <div class="checkboxes">
          <p class="title">Cuisine:</p>
          <div class="checkboxes-flex">
            <div v-for="category in restaurant.categories" :key="category.id">
              <label for="category.attributes.name">
                {{ category.attributes.name | capitalize }}
              </label>
              <input
                type="checkbox"
                :id="category.attributes.name"
                :value="category.id"
                v-model="restaurant.selectedCategories"
              />
            </div>
          </div>
        </div>

        <div class="checkboxes">
          <p class="title">Closed On:</p>
          <div class="checkboxes-flex">
            <div v-for="day in restaurant.closingDays" :key="day.id">
              <label for="day.attributes.day">
                {{ day.attributes.day | capitalize }}
              </label>
              <input
                type="checkbox"
                :id="day.attributes.day"
                :value="day.id"
                v-model="restaurant.selectedClosingDays"
              />
            </div>
          </div>
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
      apiUrl: process.env.VUE_APP_API_URL,
      restaurant: {
        name: "",
        description: "",
        address: "",
        phone: "",
        website: "",
        uploadedMainImage: null,
        uploadedMenuImages: [],
        categories: [],
        selectedCategories: [],
        closingDays: [],
        selectedClosingDays: [],
      },
    };
  },
  methods: {
    handleMainChange(event) {
      this.restaurant.uploadedMainImage = event.target.files[0];
    },

    handleMenuChange(event) {
      this.restaurant.uploadedMenuImages.push(event.target.files[0]);
    },

    async getCategoryData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/categories?populate[0]=name`,
        });

        this.restaurant.categories = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getDaysData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/days?populate[0]=day`,
        });

        this.restaurant.closingDays = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    resetForm() {
      this.$refs.form.reset();
    },

    async postRestaurantData() {
      try {
        const fd = new FormData();

        // main image
        fd.append("files.image", this.restaurant.uploadedMainImage);

        // menu images
        this.restaurant.uploadedMenuImages.forEach((file) => {
          fd.append("files.menu", file);
        });

        // text data
        fd.append(
          "data",
          JSON.stringify({
            name: this.restaurant.name,
            description: this.restaurant.description,
            address: this.restaurant.address,
            phone: this.restaurant.phone,
            website: this.restaurant.website,
            categories: { set: this.restaurant.selectedCategories },
            closingDays: { set: this.restaurant.selectedClosingDays },
          })
        );

        const response = await axios({
          method: "post",
          url: `${this.apiUrl}/restaurants`,
          data: fd,
        });
        this.$responseStatus(response.request.status);
      } catch (error) {
        console.log(error.response.data);
      }
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
  height: 100dvh;
  text-align: left;
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
  margin-bottom: 20px;
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

p {
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
