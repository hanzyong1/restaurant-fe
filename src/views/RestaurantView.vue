<template>
  <div>
    <BackButton />
    <div class="restaurant">
      <div class="img-container">
        <img :src="imgUrl[currentIndex]" />
        <a class="prev" @click="previous">&#10094;</a>
        <a class="next" @click="next">&#10095;</a>
      </div>
      <div class="main">
        <div class="main-left">
          <div class="title">
            Restaurant Name:
            <div class="text">{{ name }}</div>
          </div>
          <div class="title">
            Description:
            <div class="text">{{ description }}</div>
          </div>
          <div class="title">
            Address:
            <div class="text">{{ address }}</div>
          </div>
        </div>
        <div class="main-right">
          <div class="title">
            Phone Number:
            <div class="text">
              {{ phone }}
            </div>
          </div>
          <div class="title">
            Website:
            <div class="text">
              {{ website }}
            </div>
          </div>
          <div class="title">
            Cuisine:
            <div class="text" v-for="category in categories" :key="category.id">
              {{ category.attributes.name }}
            </div>
          </div>
          <div class="title">
            Closed on:
            <div
              class="text"
              v-for="closingDay in closingDays"
              :key="closingDay.id"
            >
              {{ closingDay.attributes.day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackButton from "@/components/BackButton.vue";

export default {
  components: { BackButton },
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      baseUrl: process.env.VUE_APP_BASE_URL,
      restaurantId: this.$route.params.id,
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      categories: [],
      closingDays: [],
      menuImg: [],
      timer: null,
      currentIndex: 0,
      imgUrl: [],
    };
  },
  methods: {
    next() {
      if (this.currentIndex >= this.imgUrl.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.stopRotation();
    },
    previous() {
      if (this.currentIndex <= 0) {
        this.currentIndex = this.imgUrl.length - 1;
      } else {
        this.currentIndex--;
      }
      this.stopRotation();
    },
    startRotation() {
      this.timer = setInterval(this.next, 3000);
    },
    stopRotation() {
      clearInterval(this.timer);
      this.startRotation();
    },
  },
  async mounted() {
    const response = await axios({
      method: "get",
      url: `${this.apiUrl}/restaurants/${this.restaurantId}?populate=*`,
    });

    this.name = response.data.data.attributes.name;
    this.description = response.data.data.attributes.description;
    this.address = response.data.data.attributes.address;
    this.phone = response.data.data.attributes.phone;
    this.website = response.data.data.attributes.website;
    this.categories = response.data.data.attributes.categories.data;
    this.closingDays = response.data.data.attributes.closingDays.data;
    this.menuImg = response.data.data.attributes.menu.data;
    this.imgUrl = this.menuImg.map((menu) => {
      return `${this.baseUrl}${menu.attributes.url}`;
    });

    this.startRotation();
  },
};
</script>

<style scoped>
.restaurant {
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img-container {
  position: relative;
  margin-bottom: 50px;
}

.img-container img {
  max-width: 100%;
  max-height: auto;
  height: 300px;
  width: 450px;
  object-fit: contain;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: black;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

.prev {
  left: 0;
  border-radius: 3px 0 0 3px;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.main {
  display: flex;
  width: 100%;
  justify-content: space-around;
  flex-wrap: wrap;
}

.main-left,
.main-right {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
}

.main-left {
  border-right: 0.5px solid #ccc;
}

.title {
  font-size: large;
  margin: 10px;
}

.text {
  margin: 10px;
  font-size: larger;
  font-weight: bold;
}
</style>
