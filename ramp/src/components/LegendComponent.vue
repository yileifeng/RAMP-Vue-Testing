<template>
  <div class="rvTreeComponent">
    <md-list v-if="element.children && element.type != 'text'">
      <md-list-item
        v-bind.sync="{ 'md-expanded': element.expanded == undefined ? true : element.expanded }"
        md-expand
      >
        <span class="md-list-item-text">{{ element.name }}</span>

        <md-list slot="md-expand">
          <LegendComponent
            class="md-inset"
            v-for="node in element.children"
            v-bind:key="node.name"
            :element="node"
          >{{ element.name }}</LegendComponent>
        </md-list>
      </md-list-item>
    </md-list>
    <div class="rvTreeComponentLeaf" v-else-if="element.type === 'text'">{{ element.text }}</div>
    <div class="rvTreeComponentLeaf" v-else>{{ element.name }}</div>
  </div>
</template>

<script>
export default {
  name: "LegendComponent",
  props: ["element"]
};
</script>

<style scoped>
.rvTreeComponent {
  padding-left: 10px;
}
.rvTreeComponentLeaf {
  padding: 20px;
}
</style>