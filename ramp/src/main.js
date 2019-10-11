import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import App from './App.vue';
import { LayerState } from './classes/LayerState.js';

Vue.use(VueMaterial);
Vue.use(Vuex);

Vue.config.productionTip = false;

let root = new LayerState('Root', null);
let child = new LayerState('Child', root, { expanded: false });
child.addChild(new LayerState("Child's Child1", child));
child.addChild(new LayerState("Child's Child2", child));

let child2 = new LayerState('Child1', root);
child2.addChild(new LayerState("Child's Child1", child2));
child2.addChild(new LayerState("Child's Child2", child2));

root.addChild(child);
root.addChild(child2);

const store = new Vuex.Store({
  state: {
    legendComponents: root
  },
  getters: {
    getEntries: state => state.legendComponents
  },
  mutations: {
    ADD_ENTRY(state, payload) {
      // maybe need to check for duplicates
      state.legendComponents.addChild(new LayerState(payload.name, root));
    },
    TOGGLE_ALL_OPTIONS (state, option) {
      // DFS tree traversal to expand all groups (currently every entry is a group and is expandable)
      let stack = [];
      stack.push(state.legendComponents);
      while (stack) {
        let legendEntry = stack.pop();
        // 4 options that can be passed in: "expand", "collapse", "visibilityOn", "visibilityOff" (can probably add more here if needed)
        switch (option) {
          case "expand":
            // expand current legend entry
            legendEntry.expanded = true;
            break;
          case "collapse":
            // collapse current legend entry
            legendEntry.expanded = false;
            break;
          case "visibilityOn":
            // turn visibility on for current entry
            legendEntry.visible = true;
            break;
          case "visibilityOff":
            legendEntry.visible = false;
            break;
        }
        // add all child components to stack to be traversed next, if they exist
        if (legendEntry.children) {
          if (legendEntry.children.length > 0) {
          // in the future may need to add a set of check conditions here depending on what entries we want to traverse (e.g. is expandable or is toggleable)
          legendEntry.children.forEach(child => {
            stack.push(child);
          });
        }
        }
      }
    }
  },
  actions: {
    addEntry: (context, payload) => {
      context.commit('ADD_ENTRY', payload);
    },
    expandCollapseAll: (context, expandable) => {
      context.commit('TOGGLE_ALL_OPTIONS', expandable);
    },
    toggleVisibilityAll: (context, visible) => {
      context.commit('TOGGLE_ALL_OPTIONS', visible);
    }
  }
});

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
