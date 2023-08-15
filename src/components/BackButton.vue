<template>
  <button v-on:click="$router.go(-1)">Back</button>
</template>

<style scoped>
button {
  padding: 5px 10px;
  margin: 20px;
}
</style>
