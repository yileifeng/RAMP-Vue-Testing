<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect" v-on:click="click">
      <!-- icon -->
      <md-icon id="icon" :class="{ 'rotate-180': element.expanded }">expand_more</md-icon>

      <!-- name -->
      <span>{{ element.name }}</span>

      <!-- icon -->
      <div id="icon" v-on:click="clickedButton = true">
        <md-menu style="z-index: 10;" md-size="auto" :md-offset-x="-180" :md-offset-y="-30">
          <md-icon class="md-icon-small" md-menu-trigger>more_horiz</md-icon>

          <md-menu-content>
            <md-menu-item v-on:click="remove" :disabled="!element.userAdded">Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
      <div v-if="element.toggleable" v-on:click="clickedButton = true">
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
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownComponent",
  props: ["element"],
  data: function() {
    return {
      clickedButton: false
    };
  },
  methods: {
    click: function() {
      if (!this.clickedButton) {
        this.element.expanded = !this.element.expanded;
      }
      this.clickedButton = false;
      if (this.element.expanded) {
        this.$store.dispatch("toggleOffOption", "allCollapsed");
        this.$store.dispatch("updateHeaderOption", "expanded");
      } else {
        this.$store.dispatch("toggleOffOption", "allExpanded");
        this.$store.dispatch("updateHeaderOption", "collapsed");
      }
    },
    toggle: function() {
      this.element.toggle();
      if (this.element.toggled) {
        this.$store.dispatch("toggleOffOption", "allUntoggled");
        this.$store.dispatch("updateHeaderOption", "toggled");
      } else {
        this.$store.dispatch("toggleOffOption", "allToggled");
        this.$store.dispatch("updateHeaderOption", "untoggled");
      }
    },
    remove: function() {
      // first remove children node
      for (let i = this.element.children.length - 1; i >= 0; i--) {
        this.element.children.splice(i, 1);
      }

      // remove this node from the parent
      let node = this.element.parent.children.findIndex(c => {
        return c === this.element;
      });
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
</style>