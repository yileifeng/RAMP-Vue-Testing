<template>
  <div class="rv-legend-header">
    <div class="rv-header-icons">
      <img src="../assets/add.png" class="rv-add-layer" v-on:click="displayAddOptions" />
      <div class="modal">
        <div class="modal-content">
          <img src="../assets/add.png" class="rv-add-layer" v-on:click="addEntry" />
          <span class="close-button" v-on:click="displayAddOptions">&times;</span>
          <input
            class="rv-new-entry"
            type="text"
            placeholder="Name of new entry"
            v-model="newEntryName"
            v-on:keyup.enter="addEntry"
          />
          <select class="rv-new-type" v-model="newEntryType">
            <option value="Single Entry">Single Entry</option>
            <option value="Group Entry">Group Entry</option>
          </select>
          <div class="rv-init-settings">
            <input type="checkbox" class="rv-init-visible" v-model="initVisibility" checked />Visible
            <input type="checkbox" class="rv-init-expandable" v-model="initExpanded" checked />Expanded
          </div>
          <div class="rv-group-children">
            <div class="group-entry-child">
              <h4>Child entry:</h4>
              <form v-on:submit="addNewChild">
                <input class="new-child" type="text" placeholder="Name of new child entry" />
                <input type="checkbox" checked />Visible
                <input type="checkbox" checked />Expanded
                <button type="submit" class="rv-add-child">
                  <img src="../assets/add.png" class="rv-add-layer" />
                </button>
              </form>
              <img src="../assets/remove.png" class="rv-add-layer" v-on:click="removeChild" />
            </div>
          </div>
        </div>
      </div>
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
      newEntryType: "",
      initVisibility: true,
      initExpanded: true,
      visibilityOptions: false,
      expandOptions: false
    };
  },
  computed: {
    allExpanded: function() {
      return this.$store.getters.getAllExpanded;
    },
    allToggled: function() {
      return this.$store.getters.getAllToggled;
    },
    allUntoggled: function() {
      return this.$store.getters.getAllUntoggled;
    },
    allCollapsed: function() {
      return this.$store.getters.getAllCollapsed;
    }
  },
  watch: {
    allExpanded: function(newValue, oldValue) {
      const expandGroupsOption = document.querySelector(".expand-groups");
      newValue
        ? (expandGroupsOption.disabled = true)
        : (expandGroupsOption.disabled = false);
    },
    allToggled: function(newValue, oldValue) {
      const showAllOption = document.querySelector(".show-all");
      newValue
        ? (showAllOption.disabled = true)
        : (showAllOption.disabled = false);
    },
    allCollapsed: function(newValue, oldValue) {
      const showCollapseOption = document.querySelector(".collapse-groups");
      newValue
        ? (showCollapseOption.disabled = true)
        : (showCollapseOption.disabled = false);
    },
    allUntoggled: function(newValue, oldValue) {
      const hideAllOption = document.querySelector(".hide-all");
      newValue
        ? (hideAllOption.disabled = true)
        : (hideAllOption.disabled = false);
    },
    // watch for the selected layer type changing and display different properties to fill out depending on the type
    newEntryType: function(newValue, oldValue) {
      const addChildren = document.querySelector(".rv-group-children");
      if (
        newValue !== oldValue &&
        (newValue === "Group Entry" || oldValue === "Group Entry")
      ) {
        addChildren.classList.toggle("show-children-option");
      }
    }
  },
  methods: {
    addEntry: function() {
      // clear entry and call action to add new legend entry
      if (this.newEntryName.trim() !== "") {
        if (this.newEntryType === "Group Entry") {
          // new entry to be passed as payload object
          const newEntry = {
            name: this.newEntryName,
            children: [],
            options: {
              expanded: this.initExpanded,
              toggled: this.initVisibility,
              userAdded: true
            }
          };
          const childNodes = document.querySelector(".rv-group-children");
          // for each child entry of the group check if name is not blank and push a new object otherwise
          for (let i = 0; i < childNodes.children.length; i++) {
            const curChild = childNodes.children[i].children[1];
            const curChildName = curChild.firstChild.value;
            if (curChildName.trim() !== "") {
              newEntry.children.push({
                name: curChildName,
                options: {
                  toggled: curChild.children[1].checked,
                  expanded: curChild.children[2].checked,
                  userAdded: true
                }
              });
            } else {
              throw new Error(`A child entry name was left blank!`);
            }
          }
          // dispatch action call to add new entry to legend
          this.$store.dispatch("addEntry", newEntry);
          this.newEntryName = "";
          this.removeAllChildren(childNodes);
        } else if (this.newEntryType === "Single Entry") {
          this.$store.dispatch("addEntry", {
            name: this.newEntryName,
            options: {
              expanded: this.initExpanded,
              toggled: this.initVisibility,
              userAdded: true
            }
          });
          this.newEntryName = "";
        } else {
          throw new Error(`No entry type was selected!`);
        }
      } else {
        throw new Error(`New entry name was left blank!`);
      }
    },
    displayAddOptions: function() {
      const modal = document.querySelector(".modal");
      modal.classList.toggle("show-modal");
    },
    addNewChild: function(e) {
      e.preventDefault();
      // add a new input entry for new child
      const groupChildren = e.target.parentNode.parentNode;
      if (
        e.target.children[0].value.trim() !== "" &&
        groupChildren.lastChild === e.target.parentNode
      ) {
        // clone an identical child form element
        const newChild = e.target.parentNode.cloneNode(true);
        newChild.children[1].firstChild.value = "";
        // not sure how to add vue attributes here (v-on:keyup.enter, v-on:click)
        newChild.children[1].onsubmit = this.addNewChild;
        newChild.lastChild.onclick = this.removeChild;
        groupChildren.appendChild(newChild);
      }
    },
    removeChild: function(e) {
      // remove a specified child input entry
      const groupChildren = document.querySelector(".rv-group-children");
      if (groupChildren.children.length > 1) {
        groupChildren.removeChild(e.target.parentNode);
      }
    },
    removeAllChildren: function(groupChildren) {
      while (groupChildren.children.length > 1) {
        // clear all child entries
        groupChildren.removeChild(groupChildren.lastChild);
      }
      // reset first child entry (can also reset checkboxes)
      groupChildren.firstChild.children[1].firstChild.value = "";
    },
    showGroupsOptions: function() {
      // TODO: make as actual popup like RAMP
      const showVisibleOptions = document.querySelector(
        "#show-visibility-options"
      );
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
      const showVisibleOptions = document.querySelector(
        "#show-visibility-options"
      );
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
      this.$store.dispatch("toggleVisibilityAll", "visibilityOff");
    }
  }
};
</script>

<style scoped>
h4 {
  display: inline;
  padding-right: 5px;
}
.rv-legend-header {
  padding: 2px;
  border-bottom: 1px solid #1f1b1b;
  margin: 10px 0px;
}
.rv-header-icons {
  padding: 5px;
}
.rv-new-entry {
  width: 50%;
  padding: 0.5rem;
  margin: 10px 8px;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: solid 1px lightgray;
  box-sizing: border-box;
  display: inline-block;
}
.rv-new-type {
  width: 20%;
  padding: 0.5rem;
  margin: 10px 0;
  font-size: 1rem;
  border-radius: 0.25rem;
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
.rv-init-settings {
  display: inline-block;
  padding-left: 1rem;
}
#icon {
  display: inline-block;
  margin-top: 9px;
  margin-bottom: 10px;
  margin-left: 240px;
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
  margin: 10px 5px;
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
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}
.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 55%;
  border-radius: 0.5rem;
}
.close-button {
  float: right;
  width: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
}
.close-button:hover {
  background-color: darkgray;
}
.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  z-index: 1000;
}
.rv-group-children {
  visibility: hidden;
}
.show-children-option {
  visibility: visible;
}
form {
  display: inline-block;
}
.new-child {
  border: 1px solid lightgray;
}
.rv-add-child {
  background-color: white;
  border: none;
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