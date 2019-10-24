<template>
  <div style="display: flex;">
    <div
      v-for="(item, index) in display"
      :key="index"
      :class="'symbol-'+index"
      :style="{ zIndex: 8000 - index }"
      class="symbologyIcon"
    >
      <img :src="item.image" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SymbologyStackIcon",
  props: ["stack"],
  data: function() {
    return {
      display: this.stack.slice(0, 3)
    };
  }
};
</script>

<style scoped>
.symbologyIcon {
  background: white;
  width: 32px;
  height: 32px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.symbologyIcon img {
  width: 28px;
}
.symbol-1 {
  margin-left: -30px;
  margin-top: 2px;
}
.symbol-2 {
  margin-left: -30px;
  margin-top: 4px;
}
</style>