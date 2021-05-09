import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'

import TextHighlight from 'vue-text-highlight';

Vue.component('text-highlight', TextHighlight);

//Vue.prototype.$loki = loki;// '$loki', { value: loki });
Vue.config.productionTip = false
Vue.use(VueVirtualScroller)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

