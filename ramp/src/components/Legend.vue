<template>
  <div class="rv-legend">
    <h3>Legend</h3>
    <md-list>
      <md-list-item md-expand>
        <span class="md-list-item-text">News</span>

        <md-list slot="md-expand">
          <md-list-item class="md-inset">World</md-list-item>
          <md-list-item class="md-inset">Europe</md-list-item>
          <md-list-item class="md-inset">South America</md-list-item>
        </md-list>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
export default {
  name: "Legend",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rv-legend {
  width: 400px;
  padding: 4px 10px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.rv-legend h3 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 0px;
}
</style>
