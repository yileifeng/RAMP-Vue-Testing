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
    children: [
      {
        text: 'This is some text content.',
        type: 'text'
      },
      {
        name: 'Child 1',
        children: [
          {
            name: "Child's Child 1"
          }
        ]
      },
      {
        name: 'Child 2',
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
