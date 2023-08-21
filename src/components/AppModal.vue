<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <button class="btn-close" @click="close">X</button>
      </header>
      <div class="modal-body">
        <img :src="imgUrl[currentIndex]" />
        <a class="prev" @click="previous">&#10094;</a>
        <a class="next" @click="next">&#10095;</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["imgUrl", "selectedIndex"],
  data() {
    return {
      currentIndex: this.selectedIndex,
    };
  },
  methods: {
    // emit close modal to parent
    close() {
      this.$emit("close");
    },
    // image slider next button
    next() {
      if (this.currentIndex >= this.imgUrl.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    },

    // image slider previous button
    previous() {
      if (this.currentIndex <= 0) {
        this.currentIndex = this.imgUrl.length - 1;
      } else {
        this.currentIndex--;
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  height: 800px;
  width: 900px;
}

.modal-body img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  background: transparent;
  z-index: 9999;
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
</style>
