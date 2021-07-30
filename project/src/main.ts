import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueVirtualScroller from "vue-virtual-scroller";

import TextHighlight from "vue-text-highlight";
import i18n from "./i18n";
import store from './store'

Vue.component("text-highlight", TextHighlight);

//Vue.prototype.$loki = loki;// '$loki', { value: loki });
Vue.config.productionTip = false;
Vue.use(VueVirtualScroller);
Vue.prototype.$propertyDict = new Map<number, string[]>();
Vue.prototype.$categoryDict = new Map<number, string[]>();

new Vue({
  vuetify,
  i18n,
  store,
  render: (h) => h(App)
}).$mount("#app");
