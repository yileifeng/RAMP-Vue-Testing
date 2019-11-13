<template>
  <div v-if="element.isRoot">
    <LegendComponent
      v-for="node in element.children"
      :key="node.name"
      :element="node"
    >{{ element.name }}</LegendComponent>
  </div>
  <ul style="list-style: none; margin-left: 8px; padding: 0px;" v-else>
    <li class="rvTreeComponent">
      <div class="rvTreeComponentLeaf" v-if="element.infoType === 'text'">{{ element.content }}</div>
      <div class="rvTreeComponentLeaf" v-else-if="element.infoType === 'image'">
        <img :src="element.content" :alt="element.name" :title="element.name" />
      </div>
      <SymbologyStackComponent :element="element" v-else-if="element.symbologyStack"></SymbologyStackComponent>
      <DropdownComponent :element="element" v-else-if="element.children.length > 0">
        <LegendComponent
          class="md-inset"
          v-for="node in element.children"
          :key="node.name"
          :element="node"
        >{{ element.name }}</LegendComponent>
      </DropdownComponent>
      <LeafComponent :element="element" v-else>{{ element.name }}</LeafComponent>
    </li>
  </ul>
</template>

<script>
import DropdownComponent from "./DropdownComponent";
import LeafComponent from "./LeafComponent";
import SymbologyStackComponent from "./SymbologyStackComponent";

export default {
  name: "LegendComponent",
  props: ["element"],
  components: {
    DropdownComponent,
    LeafComponent,
    SymbologyStackComponent
  }
};
</script>

<style scoped>
.rvTreeComponentLeaf {
  padding: 5px;
}
</style>