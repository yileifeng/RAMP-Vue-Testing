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
      <img src="../assets/view.png" class="rv-toggle-visibility" v-on:click="showVisibilityOptions" />
      <div class="expand-options" id="show-expand-options">
        <option class="expand-groups" v-on:click="expandGroups">Expand Groups</option>
        <option class="collapse-groups" v-on:click="collapseGroups">Collapse Groups</option>
      </div>
      <div class="visibility-options" id="show-visibility-options">
        <option class="show-all" v-on:click="showAll">Show All</option>
        <option class="hide-all" v-on:click="hideAll">Hide All</option>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "LegendHeader",
  data: function() {
    return {
      newEntryName: "",
      visibilityOptions: false,
      expandOptions: false };
  },
  computed: {
    allExpanded: function () {
      return this.$store.getters.getAllExpanded
    },
    allToggled: function() {
      return this.$store.getters.getAllToggled
    },
    allUntoggled: function() {
      return this.$store.getters.getAllUntoggled
    },
    allCollapsed: function() {
      return this.$store.getters.getAllCollapsed
    }
  },
  watch: {
    allExpanded: function (newValue, oldValue) {
      // console.log("allExpanded newValue -> oldValue", oldValue, newValue);
      const expandGroupsOption = document.querySelector(".expand-groups");
      newValue ? expandGroupsOption.disabled = true : expandGroupsOption.disabled = false;
    },
    allToggled: function (newValue, oldValue) {
      // console.log("allToggled newValue -> oldValue", newValue, oldValue);
      const showAllOption = document.querySelector(".show-all");
      newValue ? showAllOption.disabled = true : showAllOption.disabled = false;
    },
    allCollapsed: function (newValue, oldValue) {
      // console.log("allCollapsed newValue -> oldValue", newValue, oldValue);
      const showCollapseOption = document.querySelector(".collapse-groups");
      newValue ? showCollapseOption.disabled = true : showCollapseOption.disabled = false;
    },
    allUntoggled: function (newValue, oldValue) {
      // console.log("allUntoggled newValue -> oldValue", newValue, oldValue);
      const hideAllOption = document.querySelector(".hide-all");
      newValue ? hideAllOption.disabled = true : hideAllOption.disabled = false;
    }
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
      const showVisibleOptions = document.querySelector("#show-visibility-options");
      // hide visibility options if open
      if (this.visibilityOptions) {
        this.visibilityOptions = false;
        showVisibleOptions.className = "visibility-options";
      }

      // create popup options for collapse/expand all
      const showExpandOptions = document.querySelector("#show-expand-options");
      this.expandOptions
        ? (showExpandOptions.className = "expand-options")
        : (showExpandOptions.className += "show");
      this.expandOptions = !this.expandOptions;
    },

    showVisibilityOptions: function() {
      // TODO: make as actual popup like RAMP
      const showExpandOptions = document.querySelector("#show-expand-options");
      // hide expand options if open
      if (this.expandOptions) {
        this.expandOptions = false;
        showExpandOptions.className = "expand-options";
      }

      // create popup options for hide/show all
      const showVisibleOptions = document.querySelector("#show-visibility-options");
      this.visibilityOptions
        ? (showVisibleOptions.className = "visibility-options")
        : (showVisibleOptions.className += "show");
      this.visibilityOptions = !this.visibilityOptions;
    },

    expandGroups: function() {
      // expand all entries possible and set allExpanded property to true
      this.$store.dispatch("expandCollapseAll", "expand");
    },

    collapseGroups: function() {
      // collapse all entries possible and set allCollapsed property to true
      this.$store.dispatch("expandCollapseAll", "collapse");
    },

    showAll: function() {
      // toggle visibility on for all entries possible and set allToggled property to true
      this.$store.dispatch("toggleVisibilityAll", "visibilityOn");
    },

    hideAll: function() {
      // toggle visibility off for all entries possible and set allUntoggled property to true
      this.$store.dispatch("toggleVisibilityAll", "visibilityOff")
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
.expand-groups:enabled:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.collapse-groups:enabled:hover {
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
.show-all:enabled:hover {
  cursor: pointer;
  filter: brightness(90%);
  background: #eee;
}
.hide-all:enabled:hover {
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