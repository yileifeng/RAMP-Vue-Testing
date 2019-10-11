<template>
  <ul style="list-style: none; margin: 8px; padding: 0px;">
    <li class="rvTreeComponent">
      <DropdownComponent :element="element" v-if="element.children.length > 0">
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
      <LeafComponent :element="element" v-else>{{ element.name }}</LeafComponent>
    </li>
  </ul>
</template>

<script>
import DropdownComponent from "./DropdownComponent";
import LeafComponent from "./LeafComponent";

export default {
  name: "LegendComponent",
  props: ["element"],
  components: {
    DropdownComponent,
    LeafComponent
  }
};
</script>

<style scoped>
.rvTreeComponentLeaf {
  padding: 5px;
}
</style>