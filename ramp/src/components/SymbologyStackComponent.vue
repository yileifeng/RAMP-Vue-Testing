<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect" v-on:click="click">
      <!-- icon -->
      <md-button id="icon" class="md-icon-button md-primary md-flat" v-if="element.expanded">
        <md-icon class="md-icon-small" style="width: 20px; height: 20px;">clear</md-icon>
      </md-button>
      <SymbologyStackIcon :stack="element.symbologyStack" v-else></SymbologyStackIcon>

      <!-- name -->
      <span>{{ element.name }}</span>

      <!-- icon -->
      <div v-if="element.toggleable">
        <md-button id="icon" class="md-icon-button md-primary md-flat" v-on:click="toggle">
          <md-icon
            class="md-icon-small"
            v-if="element.toggled"
            style="width: 20px; height: 20px;"
          >check_box</md-icon>
          <md-icon class="md-icon-small" v-else>check_box_outline_blank</md-icon>
        </md-button>
      </div>
    </div>
    <div class="rvDropdownContent" :class="{ 'hidden' : !element.expanded}">
      <div v-for="symbol in element.symbologyStack" :key="symbol.text" style="display: flex; align-items: center; padding: 5px;">
        <div class="symbologyIcon">
          <img :src="symbol.image" />
        </div>
        {{ symbol.text }}
      </div>
    </div>
  </div>
</template>

<script>
import SymbologyStackIcon from "./SymbologyStackIcon";

export default {
  name: "SymbologyStackComponent",
  props: ["element"],
  components: {
    SymbologyStackIcon
  },
  data: function() {
    return {
      clickedToggle: false
    };
  },
  methods: {
    click: function() {
      if (!this.clickedToggle) {
        this.element.expanded = !this.element.expanded;
      }
      this.clickedToggle = false;
      if (this.element.expanded) {
        this.$store.getters.getEntries.allCollapsed = false;
        this.$store.dispatch("updateHeaderOption", "expanded");
      } else {
        this.$store.getters.getEntries.allExpanded = false;
        this.$store.dispatch("updateHeaderOption", "collapsed");
      }
    },
    toggle: function() {
      this.clickedToggle = true;
      this.element.toggle();
      if (this.element.toggled) {
        this.$store.getters.getEntries.allUntoggled = false;
        this.$store.dispatch("updateHeaderOption", "toggled");
      } else {
        this.$store.getters.getEntries.allToggled = false;
        this.$store.dispatch("updateHeaderOption", "untoggled");
      }
    }
  }
};
</script>

<style scoped>
.rvDropdown {
  transition: 0.8s;
  font-weight: 500;
}

.hidden {
  display: none;
  transition: 0.3s;
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
.md-icon-button {
  display: block;
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
.md-icon {
  color: #666666;
}
.md-icon-small {
  font-size: 20px !important;
  opacity: 0.62;
}
.md-icon-small:hover {
  opacity: 1;
}
.symbologyIcon {
  width: 32px;
  height: 32px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.symbologyIcon img {
  width: 28px;
}
</style>