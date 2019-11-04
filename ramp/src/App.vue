<template>
  <div id="app">
    <Legend />
  </div>
</template>

<script>
import Legend from "./components/Legend.vue";
import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";

Vue.use(VueMaterial);

export default {
  name: "app",
  components: {
    Legend
  }
};
</script>

<style>
#app {
  margin: 10px;
}
</style>
