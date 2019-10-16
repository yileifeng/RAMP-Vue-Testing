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
child.addChild(new LayerState("Child's Child1", child, { toggled: false }));
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
      // toggle by calling method on root
      state.legendComponents.toggleAllOptions(option);
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
