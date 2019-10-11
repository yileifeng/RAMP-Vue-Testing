<template>
  <div class="rv-legend-header">
    <div class="rv-header-icons">
      <img src="../assets/add.png" class="rv-add-layer" v-on:click="addEntry" />
      <input
        class="rv-new-entry"
        type="text"
        placeholder="Name of new entry"
        v-model="newEntryName"
        v-on:keyup.enter="addEntry"
      />
      <i
        id="icon"
        class="md-icon md-icon-font md-icon-image md-list-expand-icon md-theme-default"
        v-on:click="showGroupsOptions"
      >
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
          <path d="M0-.75h24v24H0z" fill="none" />
        </svg>
      </i>
      <div class="expand-options" id="show-expand-options">
        <option class="expand-groups" v-on:click="expandGroups">Expand Groups</option>
        <option class="collapse-groups" v-on:click="collapseGroups">Collapse Groups</option>
      </div>
      <img src="../assets/view.png" class="rv-toggle-visibility" v-on:click="showVisibilityOptions" />
      <div class="visibility-options" id="show-visibility-options">
        <option class="show-all" v-on:click="showAll">Show All</option>
        <option class="hide-all" v-on:click="hideAll">Hide All</option>
      </div>
    </div>
  </div>
</template>

<script>
import LegendComponent from "./LegendComponent";
import DropdownComponent from "./DropdownComponent";

export default {
  name: "LegendHeader",
  data: function() {
    return {
      newEntryName: "",
      expandVisibility: false,
      expandVisibilityDisabled: false,
      expandOptions: false,
      expandOptionsDisabled: false,
      expandDisabled: false,
      collapseDisabled: false,
      showAllDisabled: false,
      hideAllDisabled: false };
  },
  methods: {
    addEntry: function() {
      // clear entry and call action to add new legend entry
      if (this.newEntryName.trim() !== "") {
        this.$store.dispatch("addEntry", { name: this.newEntryName });
        this.newEntryName = "";
      }
    },
    showGroupsOptions: function() {
      // TODO: make as actual popup like RAMP
      if (!this.expandOptionsDisabled) {
        // create popup options for collapse/expand all
        const showExpandOptions = document.querySelector("#show-expand-options");
        this.expandOptions
          ? (showExpandOptions.className = "expand-options")
          : (showExpandOptions.className += "show");
        this.expandOptions = !this.expandOptions;
        // disabled visibility options if expand options is open
        this.expandOptions ? this.expandVisibilityDisabled = true : this.expandVisibilityDisabled = false;
      }
    },
    showVisibilityOptions: function() {
      // TODO: make as actual popup like RAMP
      if (!this.expandVisibilityDisabled) {
        // create popup options for hide/show all
        const showVisibleOptions = document.querySelector("#show-visibility-options");
        this.expandVisibility
          ? (showVisibleOptions.className = "visibility-options")
          : (showVisibleOptions.className += "show");
        this.expandVisibility = !this.expandVisibility;
        // disabled expand options if visibility options are open
        this.expandVisibility ? this.expandOptionsDisabled = true : this.expandOptionsDisabled = false;
      }
    },
    expandGroups: function() {
      const showVisibleOptions = document.querySelector(".expand-groups");
      if (!this.expandDisabled) {
        this.$store.dispatch("expandCollapseAll", "expand");
        this.expandDisabled = true;
        this.collapseDisabled = false;
      }
    },
    collapseGroups: function() {
      const showVisibleOptions = document.querySelector(".collapse-groups");
      if (!this.collapsedDisabled) {
        this.$store.dispatch("expandCollapseAll", "collapse");
        this.collapsedDisabled = true;
        this.expandDisabled = false;
      }
    },
    showAll: function() {
      const showVisibleOptions = document.querySelector(".show-all");
      if (!this.showAllDisabled) {
        this.$store.dispatch("toggleVisibilityAll", "visibilityOn");
        this.showAllDisabled = true;
        this.hideAllDisabled = false;
      }
    },
    hideAll: function() {
      const showVisibleOptions = document.querySelector(".hide-all");
      if (!this.hideAllDisabled) {
        this.$store.dispatch("toggleVisibilityAll", "visibilityOff")
        this.hideAllDisabled = true;
        this.showAllDisabled = false;
      }
    }
  }
};
</script>

<style scoped>
.rv-legend-header {
  padding: 2px;
  border-bottom: 1px solid #1f1b1b;
  margin: 10px 0px;
}
.rv-header-icons {
  padding: 5px;
}
.rv-new-entry {
  width: 65%;
  padding: 0.5rem;
  margin: 10px 8px;
  font-size: 1rem;
  outline: none;
  border-radius: 0.25rem;
  border-style: none;
  border: solid 1px lightgray;
  box-sizing: border-box;
  display: inline-block;
}
.rv-add-layer {
  display: inline-block;
  margin: 9px 3px 10px;
}
.rv-add-layer:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
#icon {
  display: inline-block;
  margin-left: 5px;
}
#icon:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.expand-options {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}
.expand-options .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}
.expand-groups:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.collapse-groups:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.rv-toggle-visibility {
  float: right;
  margin: 13px 5px 10px;
}
.rv-toggle-visibility:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.visibility-options {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}
.visibility-options .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}
.show-all:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.hide-all:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>