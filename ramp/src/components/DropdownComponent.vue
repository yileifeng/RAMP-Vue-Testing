<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect" v-on:click="click">
      <!-- icon -->
      <i
        id="icon"
        :class="{ 'rotate-180' : expanded }"
        class="md-icon md-icon-font md-icon-image md-list-expand-icon md-theme-default"
      >
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
          <path d="M0-.75h24v24H0z" fill="none" />
        </svg>
      </i>

      <!-- name -->
      <span>{{ element.name }}</span>

      <!-- icon -->
      <i
        id="icon"
        class="md-icon md-icon-font md-icon-image md-list-expand-icon md-theme-default"
        v-on:click="toggle"
        v-if="element.toggled"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
      </i>
      <i
        id="icon"
        class="md-icon md-icon-font md-icon-image md-list-expand-icon md-theme-default"
        v-on:click="toggle"
        v-else
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </i>
    </div>
    <div class="rvDropdownContent" :class="{ 'hidden' : !expanded}">
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
      expanded: false,
      toggled: false,
      clickedToggle: false
    };
  },
  methods: {
    click: function() {
      if (!this.clickedToggle) {
        this.expanded = !this.expanded;
      }
      this.clickedToggle = false;
    },
    toggle: function() {
      this.clickedToggle = true;
      this.wasToggled = false;
      this.element.toggled = !this.element.toggled;

      // determines whether any children were toggled on prior to this element being toggled off
      const toggledChildren = this.element.children
        ? this.element.children.some(
            child => child.children && child.wasToggled
          )
        : false;

      if (this.element.toggled) {
        // handles cases where the parent is toggled ON
        this.element.children.forEach(child => {
          if (!toggledChildren) {
            child.toggled = true;
          } else if (child.wasToggled) {
            child.toggled = this.element.toggled;
          } else {
            child.wasToggled = false;
          }
        });
      } else {
        // handles cases where the parent is toggled OFF
        this.element.children.forEach(child => {
          if (child.toggled) {
            child.wasToggled = true;
          }
          child.toggled = false;
        });
        this.element.wasToggled = false;
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
.md-icon {
  color: #666666;
}
</style>