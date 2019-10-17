<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect">
      <!-- name -->
      <span>{{ element.name }}</span>

      <!-- icon -->
      <div v-if="element.toggleable">
        <div id="icon" v-on:click="toggle">
          <md-icon class="md-icon-small" v-if="element.toggled">check_box</md-icon>
          <md-icon class="md-icon-small" v-else>check_box_outline_blank</md-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeafComponent",
  props: ["element"],
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
        this.$store.dispatch("updateHeaderOption", "untoggled")
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
.rvDropdownTitle {
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
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
</style>