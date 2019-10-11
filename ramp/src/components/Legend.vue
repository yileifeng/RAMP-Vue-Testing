<template>
  <div class="rv-legend">
    <LegendHeader></LegendHeader>
    <LegendComponent :element="root"></LegendComponent>

    <!--
    <DropdownComponent title="Root">
      <DropdownComponent title="Header One">This is some content.</DropdownComponent>
      <DropdownComponent title="Header Two">
        <DropdownComponent title="Subheader One">Test</DropdownComponent>
      </DropdownComponent>
    </DropdownComponent>
    -->
  </div>
</template>

<script>
import LegendHeader from "./LegendHeader";
import LegendComponent from "./LegendComponent";

export default {
  name: "Legend",
  props: {
    msg: String,
    entries: Array
  },
  components: {
    LegendComponent,
    LegendHeader
  },
  data: function() {
    return {
      root: this.$store.state.legendComponents
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rv-legend {
  width: 400px;
  height: 98vh;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.rv-legend h3 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 0px;
}
.md-list > .md-icon {
  float: left;
}
</style>
