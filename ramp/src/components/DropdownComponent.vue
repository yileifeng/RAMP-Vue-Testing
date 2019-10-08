<template>
  <li class="rvDropdown" style="list-style:none;margin: 0px;padding:0px;">
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
      <span>{{ title }}</span>
    </div>
    <ul style="margin:0px;padding:5px;" class="rvDropdownContent" :class="{ 'hidden' : !expanded}">
      <slot></slot>
    </ul>
  </li>
</template>

<script>
export default {
  name: "DropdownComponent",
  props: ["title"],
  data: function() {
    return {
      expanded: true
    };
  },
  methods: {
    click: function() {
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style scoped>
.rvDropdown {
  transition: 0.8s;
  font-weight: 500;
  padding: 10px;
}
.rvDropdownTitle #icon {
  transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
  margin-right: 20px;
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
  display: block;
  padding: 10px;
  flex: 1;
}
.rvDropdownTitle:hover {
  background: #eee;
}
.rvDropdownTitle span {
  display: inline-block;
  flex: 1;
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
</style>