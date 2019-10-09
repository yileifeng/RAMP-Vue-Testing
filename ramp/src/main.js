import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import App from './App.vue';

Vue.use(VueMaterial);
Vue.use(Vuex);

Vue.config.productionTip = false;

let root = [
  {
    name: 'Root',
    toggled: false,
    wasToggled: false,
    children: [
      {
        content: 'This is some text content.',
        infoType: 'text'
      },
      {
        content: 'https://i.imgur.com/ojcd4xn.png',
        infoType: 'image',
        name: 'This is an image'
      },
      {
        name: 'Child 1',
        toggled: false,
        wasToggled: false,
        children: [
          {
            name: "Child's Child 1"
          }
        ]
      },
      {
        name: 'Child 2',
        toggled: false,
        wasToggled: false,
        children: [
          {
            name: "Child's Child 2"
          }
        ]
      }
    ]
  }
];

const store = new Vuex.Store({
  state: {
    legendComponents: root
  }
});

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
