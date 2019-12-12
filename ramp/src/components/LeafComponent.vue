<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect">
      <!-- name -->
      <div style="display: flex;" v-if="element.icon">
        <div class="symbologyIcon">
          <img :src="element.icon" />
        </div>
      </div>

      <span v-on:click="openTable">{{ element.name }}</span>

      <!-- icon -->
      <div id="icon">
        <md-menu style="z-index: 10;" md-size="auto" :md-offset-x="-180" :md-offset-y="-30">
          <md-icon class="md-icon-small" md-menu-trigger>more_horiz</md-icon>

          <md-menu-content>
            <md-menu-item v-on:click="openTable"><img src="../assets/datatable.png">Datatable</md-menu-item>
            <md-menu-item v-on:click="remove" :disabled='!element.userAdded'><img src="../assets/remove.png">Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
      <div v-if="element.toggleable && !element.isSet" v-on:click="clickedButton = true">
        <md-button id="icon" class="md-icon-button md-primary md-flat" v-on:click="toggle">
          <md-icon
            class="md-icon-small"
            v-if="element.toggled"
            style="width: 20px; height: 20px;"
          >check_box</md-icon>
          <md-icon class="md-icon-small" v-else>check_box_outline_blank</md-icon>
        </md-button>
      </div>
      <div v-else-if="element.toggleable && element.isSet" v-on:click="clickedButton = true">
        <md-button id="icon" class="md-icon-button md-primary md-flat" v-on:click="toggle">
          <md-icon
            class="md-icon-small"
            v-if="element.toggled"
            style="width: 20px; height: 20px;"
          >radio_button_checked</md-icon>
          <md-icon class="md-icon-small" v-else>radio_button_unchecked</md-icon>
        </md-button>
      </div>
    </div>
    <GridComponent :element="element" v-if="element.tableOpen"></GridComponent>
  </div>
</template>

<script>
import GridComponent from "./GridComponent";

export default {
  name: "LeafComponent",
  props: ["element"],
  components: {
    GridComponent
  },
  data: function() {
    return {
      toggled: false
    };
  },
  methods: {
    toggle: function() {
      this.element.toggle();
      if (this.element.toggled) {
        this.$store.getters.getEntries.allUntoggled = false;
        this.$store.dispatch("updateHeaderOption", "toggled");
      } else {
        this.$store.getters.getEntries.allToggled = false;
        this.$store.dispatch("updateHeaderOption", "untoggled");
      }
    },
    openTable: function() {
      let currentTable = this.$store.getters.getOpenTable;

      if(currentTable != null && currentTable !== this.element) {
        currentTable.tableOpen = false;
      }

      this.element.tableOpen = !this.element.tableOpen;
      this.$store.commit('SET_OPEN_TABLE', this.element);
    },
    remove: function() {
      let node = this.element.parent.children.findIndex(c => c === this.element);
      this.element.parent.children.splice(node, 1);
    }
  }
};
</script>

<style scoped>
.rvDropdown {
  transition: 0.8s;
  font-weight: 500;
}
.rv-focused {
  background: #eee;
}
.rotate-180 {
  transform: rotate(-180deg);
}
.hidden {
  display: none;
  transition: 0.3s;
}
.md-icon-button {
  display: block;
}
.rvDropdownTitle {
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0px;
}
.rvDropdownTitle:hover {
  background: #eee;
}
.rvDropdownTitle span {
  display: inline-block;
  width: 100%;
  flex: 1;
}
.rvDropdownTitle #icon {
  transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
  margin-right: 20px;
}
.rvDropdownContent {
  transition: max-height 0.7s ease-in;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}
.md-icon-small {
  color: #666666;
  font-size: 20px !important;
  opacity: 0.62;
}
.md-icon-small:hover {
  opacity: 1;
}
.md-icon {
  color: #666666;
}
.symbologyIcon {
  background: white;
  width: 32px;
  height: 32px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}
.symbologyIcon img {
  width: 28px;
}
</style>