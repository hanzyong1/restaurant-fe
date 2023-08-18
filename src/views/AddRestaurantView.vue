<template>
  <div class="page">
    <BackButton />
    <h1>Add a New Restaurant</h1>
    <form ref="form" v-on:submit.prevent="postRestaurantData">
      <div class="add-restaurant">
        <div class="left">
          <label for="name">Name: </label>
          <input type="text" id="name" v-model="name" required />

          <label for="description">Description: </label>
          <textarea
            id="description"
            v-model.trim="description"
            rows="3"
          ></textarea>

          <label for="address">Address: </label>
          <input type="text" id="address" v-model="address" />

          <label for="phone">Phone: </label>
          <input name="phone" type="text" id="phone" v-model="phone" />

          <label for="website">Website: </label>
          <input type="text" id="website" v-model="website" />

          <div class="checkboxes">
            <p class="title">Cuisine:</p>
            <div class="checkboxes-flex">
              <div v-for="category in categories" :key="category.id">
                <label for="category.attributes.name">
                  {{ category.attributes.name | capitalize }}
                </label>
                <input
                  type="checkbox"
                  :id="category.attributes.name"
                  :value="category.id"
                  v-model="selectedCategories"
                />
              </div>
            </div>
          </div>

          <div class="checkboxes">
            <p class="title">Closed On:</p>
            <div class="checkboxes-flex">
              <div v-for="day in closingDays" :key="day.id">
                <label for="day.attributes.day">
                  {{ day.attributes.day | capitalize }}
                </label>
                <input
                  type="checkbox"
                  :id="day.attributes.day"
                  :value="day.id"
                  v-model="selectedClosingDays"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="right">
          <div class="right-container">
            <label for="mainImage">Upload Main Image</label>
            <input type="file" id="mainImage" @change="handleMainChange" />
            <div v-if="previewMainImage" class="delete-button-container">
              <img class="preview" :src="this.previewMainImage" />
              <div class="delete-button" @click="deleteMainImage">
                <svg-icon type="mdi" :path="path"></svg-icon>
              </div>
            </div>
          </div>

          <div>
            <label for="menuImage">Upload Menu Images</label>
            <input
              type="file"
              id="menuImage"
              @change="handleMenuChange"
              multiple
            />
            <div
              class="preview-menu-container"
              v-if="previewMenuImages.length != 0"
            >
              <div
                class="delete-button-container"
                v-for="(image, index) in previewMenuImages"
                :key="image.id"
              >
                <img :src="image" class="preview" />
                <div class="delete-button" @click="deleteMenuImages(index)">
                  <svg-icon type="mdi" :path="path"></svg-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button @click="resetForm">Reset</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import axios from "axios";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDelete } from "@mdi/js";

export default {
  components: { BackButton, SvgIcon },
  data() {
    return {
      path: mdiDelete,
      baseUrl: process.env.VUE_APP_BASE_URL,
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      categories: [],
      selectedCategories: [],
      closingDays: [],
      selectedClosingDays: [],
      uploadedMainImage: null,
      uploadedMenuImages: [],
      previewMainImage: null,
      previewMenuImages: [],
    };
  },
  methods: {
    // user clicks delete button for main image
    deleteMainImage() {
      this.uploadedMainImage = null;
      this.previewMainImage = null;
    },

    // user clicks delete button for menu image
    deleteMenuImages(index) {
      this.uploadedMenuImages.splice(index, 1);
      this.previewMenuImages.splice(index, 1);
    },

    // when user uploads files
    handleMainChange(event) {
      this.uploadedMainImage = event.target.files[0];
      this.previewMainImage = URL.createObjectURL(this.uploadedMainImage);
    },

    // when user uploads files
    handleMenuChange(event) {
      this.uploadedMenuImages.push(event.target.files[0]);
      this.previewMenuImages.push(URL.createObjectURL(event.target.files[0]));
    },

    // populate categories available
    async getCategoryData() {
      try {
        const response = await axios({
          method: "get",
          url: `/categories?populate[0]=name`,
        });

        this.categories = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    // populate days available
    async getDaysData() {
      try {
        const response = await axios({
          method: "get",
          url: `/days?populate[0]=day`,
        });

        this.closingDays = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    // reset all input fields
    resetForm() {
      this.$refs.form.reset();
    },

    // create new restaurant entry to backend
    async postRestaurantData() {
      try {
        const fd = new FormData();

        // main image
        fd.append("files.image", this.uploadedMainImage);

        // menu images
        this.uploadedMenuImages.forEach((file) => {
          fd.append("files.menu", file);
        });

        // text data
        fd.append(
          "data",
          JSON.stringify({
            name: this.name,
            description: this.description,
            address: this.address,
            phone: this.phone,
            website: this.website,
            categories: { set: this.selectedCategories },
            closingDays: { set: this.selectedClosingDays },
          })
        );

        const response = await axios({
          method: "post",
          url: `/restaurants`,
          data: fd,
        });

        this.$responseStatus(response.request.status);
      } catch (error) {
        this.$denyAccess();
        console.log(error);
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

h1 {
  text-align: center;
  margin-bottom: 50px;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.add-restaurant {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
  margin-bottom: 30px;
}

.left,
.right {
  width: 500px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.right-container {
  height: 200px;
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

.preview-menu-container {
  display: flex;
  flex-wrap: wrap;
}

.delete-button-container {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
}

.preview {
  height: 100%;
  width: 100%;
}

.delete-button {
  position: absolute;
  bottom: 0;
  right: 0;
  color: crimson;
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
</style>
