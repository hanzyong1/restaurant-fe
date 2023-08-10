<template>
  <button v-on:click="$router.go(-1)">Back</button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: start;
  padding: 5px 10px;
  margin: 20px;
}
</style>
