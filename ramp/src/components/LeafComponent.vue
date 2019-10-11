<template>
  <div class="rvDropdown">
    <div class="rvDropdownTitle noselect">
      <!-- name -->
      <span>{{ element.name }}</span>

      <!-- icon -->
      <div v-if="element.toggleable">
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
    </div>
    <div class="rvDropdownContent" :class="{ 'hidden' : !expanded}">
      <slot></slot>
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