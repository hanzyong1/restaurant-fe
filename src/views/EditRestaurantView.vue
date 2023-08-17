<template>
  <div class="page">
    <BackButton />
    <h1>Edit Restaurant</h1>
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
              <img class="preview" :src="this.previewMainImage.url" />
              <div class="delete-image-button" @click="deleteMainImage">
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
                <img :src="image.url" class="preview" />
                <div
                  class="delete-image-button"
                  @click="deleteMenuImages(index, image.id)"
                >
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
    <button class="delete-button" @click="responseStatusDelete(restaurantId)">
      DELETE
    </button>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import axios from "axios";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDelete } from "@mdi/js";
import Swal from "sweetalert2";

export default {
  components: { BackButton, SvgIcon },
  data() {
    return {
      path: mdiDelete,
      apiUrl: process.env.VUE_APP_API_URL,
      baseUrl: process.env.VUE_APP_BASE_URL,
      restaurantId: this.$route.params.id,
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
      previewMainImage: {},
      previewMenuImages: [],
      filesToDelete: [],
    };
  },
  methods: {
    // delete restaurant in backend
    async deleteRestaurant(id) {
      try {
        const response = await axios({
          method: "delete",
          url: `${this.apiUrl}/restaurants/${id}`,
        });
        if (response.request.status == 200) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      } catch (error) {
        console.log(error);
      }
    },

    // sweetalert confirming delete
    responseStatusDelete(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteRestaurant(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          this.$router.push({ name: "home" });
        }
      });
    },

    // send delete request to backend
    async deleteFileRequest(id) {
      try {
        await axios({
          method: "delete",
          url: `${this.apiUrl}/upload/files/${id}`,
        });
      } catch (error) {
        console.log(error);
      }
    },

    // user clicks delete button for main image
    deleteMainImage() {
      this.filesToDelete.push(this.previewMainImage.id);
      this.uploadedMainImage = null;
      this.previewMainImage = null;
    },

    // user clicks delete button for menu images
    deleteMenuImages(index, id) {
      this.filesToDelete.push(id);
      this.previewMenuImages.splice(index, 1);
    },

    // when user uploads main image
    handleMainChange(event) {
      this.uploadedMainImage = event.target.files[0];
      this.previewMainImage = {
        url: URL.createObjectURL(this.uploadedMainImage),
      };
    },

    // when user uploads menu images
    handleMenuChange(event) {
      this.uploadedMenuImages.push(event.target.files[0]);
      this.previewMenuImages.push({
        url: URL.createObjectURL(event.target.files[0]),
      });
    },

    // get category data
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

    // get closing days data
    async getDaysData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/days?populate[0]=day`,
        });

        this.closingDays = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    // reset form input fields
    resetForm() {
      this.$refs.form.reset();
    },

    async postRestaurantData() {
      try {
        // delete files from backend using file id
        this.filesToDelete.forEach((file) => {
          this.deleteFileRequest(file);
        });

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

        // update restaurant info
        const response = await axios({
          method: "put",
          url: `${this.apiUrl}/restaurants/${this.restaurantId}`,
          data: fd,
        });

        this.$responseStatus(response.request.status);
      } catch (error) {
        console.log(error.response.data);
      }
    },

    // get restaurant data for edit
    async getRestaurantData() {
      try {
        const response = await axios({
          method: "get",
          url: `${this.apiUrl}/restaurants/${this.restaurantId}?populate=*`,
        });

        const data = response.data.data;

        // populate input fields with restaurant info
        this.name = data.attributes.name;
        this.description = data.attributes.description;
        this.address = data.attributes.address;
        this.phone = data.attributes.phone;
        this.website = data.attributes.website;
        data.attributes.categories.data.map((category) => {
          this.selectedCategories.push(category.id);
        });
        data.attributes.closingDays.data.map((day) => {
          this.selectedClosingDays.push(day.id);
        });

        // get main id and image
        if (data.attributes.image.data == null) {
          this.previewMainImage = null;
        } else {
          this.previewMainImage = {
            id: data.attributes.image.data.id,
            url: `${this.baseUrl}${data.attributes.image.data.attributes.url}`,
          };
        }

        // get menu id and images
        data.attributes.menu.data.map((menu) => {
          let obj = {
            id: menu.id,
            url: `${this.baseUrl}${menu.attributes.url}`,
          };
          this.previewMenuImages.push(obj);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getCategoryData();
    this.getDaysData();
    this.getRestaurantData();
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

.delete-image-button {
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

.delete-button {
  margin: auto;
  display: flex;
  justify-content: center;
}

.delete-button:hover {
  background-color: red;
}
</style>
