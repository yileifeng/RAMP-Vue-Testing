<template>
  <div class="rvTreeComponent">
    <DropdownComponent :title="element.name" v-if="element.children">
      <LegendComponent
        class="md-inset"
        v-for="node in element.children"
        :key="node.name"
        :element="node"
      >{{ element.name }}</LegendComponent>
    </DropdownComponent>
    <div class="rvTreeComponentLeaf" v-else-if="element.infoType === 'text'">{{ element.content }}</div>
    <div class="rvTreeComponentLeaf" v-else-if="element.infoType === 'image'">
      <img :src="element.content" :alt="element.name" :title="element.name" />
    </div>
    <div class="rvTreeComponentLeaf" v-else>{{ element.name }}</div>
  </div>
</template>

<script>
import DropdownComponent from "./DropdownComponent";

export default {
  name: "LegendComponent",
  props: ["element"],
  components: {
    DropdownComponent
  }
};
</script>

<style scoped>
.rvTreeComponent {
  padding: 2px;
}
.rvTreeComponentLeaf {
  padding: 5px;
}
</style>