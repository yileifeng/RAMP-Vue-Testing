import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import App from './App.vue';
import { LayerState, VisibilitySet } from './classes/LayerState.js';

Vue.use(VueMaterial);
Vue.use(Vuex);

Vue.config.productionTip = false;

let symbStack = [
  {
    image: 'http://i.imgur.com/GLFe2mB.png',
    text: 'British Columbia'
  },
  {
    image: 'https://i.imgur.com/4fHLsIB.gif',
    text: 'Alberta'
  },
  {
    image: 'https://i.imgur.com/71tMSkW.gif',
    text: 'Saskatchewan'
  },
  {
    image: 'https://i.imgur.com/ojwsueg.gif',
    text: 'Manitoba'
  },
  {
    image: 'https://i.imgur.com/Q808QXd.gif',
    text: 'Ontario'
  }
];

let root = new LayerState("Root", null);
let child = new LayerState("Symbology Stack", root, [], { expanded: false });
child.symbologyStack = symbStack;

let textChild = {
  infoType: 'text',
  content: 'This is an example of some text content directly on the legend.'
}

let imageChild = {
  infoType: 'image',
  name: 'Cat.',
  content: 'https://i.imgur.com/Tch3WoG.png'
}


let child2 = new LayerState("Child1", root);
child2.addChild(new LayerState("Child's Child1", child2, [], { icon: 'https://i.imgur.com/q5vvj6u.png' }));
child2.addChild(new LayerState("Child's Child2", child2, [], { icon: 'https://i.imgur.com/bJKYzI1.png' }));

// visibility set
let child3 = new VisibilitySet("Visibility Set", root);
child3.addChild(new LayerState("Set Child1", child3, [], { icon: 'https://i.imgur.com/5MJhYas.png' }));
child3.addChild(new LayerState("Set Child2", child3, [], { icon: 'https://i.imgur.com/X5DO36e.jpg' }));
child3.addChild(new LayerState("Set Child3", child3, [], { icon: 'https://i.imgur.com/Sndb557.png' }));
// let subChild3 = new LayerState("Set Group Child", child3);
// subChild3.addChild(new LayerState("Set SubChild1", subChild3));
// subChild3.addChild(new LayerState("Set SubChild2", subChild3));
// child3.addChild(subChild3);
root.addChild(textChild);
root.addChild(imageChild);

root.addChild(child);
root.addChild(child2);
root.addChild(child3);

const store = new Vuex.Store({
  state: {
    legendComponents: root
  },
  getters: {
    getEntries: state => state.legendComponents,
    getAllToggled: state => state.legendComponents.allToggled,
    getAllUntoggled: state => state.legendComponents.allUntoggled,
    getAllExpanded: state => state.legendComponents.allExpanded,
    getAllCollapsed: state => state.legendComponents.allCollapsed
  },
  mutations: {
    ADD_ENTRY(state, payload) {
      // maybe need to check for duplicates
      state.legendComponents.addChild(new LayerState(payload.name, root, payload.children, payload.options));
    },
    TOGGLE_ALL_OPTIONS (state, option) {
      // toggle by calling method on root
      state.legendComponents.toggleAllOptions(option);
    },
    UPDATE_HEADER_OPTIONS (state, option) {
      state.legendComponents.updateHeaderOption(option);
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
    },
    updateHeaderOption: (context, option) => {
      context.commit('UPDATE_HEADER_OPTIONS', option);
    }
  }
});

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
