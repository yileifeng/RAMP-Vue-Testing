<template>
  <ul style="list-style: none; margin: 8px; padding: 0px;">
    <li class="rvTreeComponent">
      <DropdownComponent :element="element" v-if="element.children">
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
    </li>
  </ul>
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
.rvTreeComponentLeaf {
  padding: 5px;
}
</style>