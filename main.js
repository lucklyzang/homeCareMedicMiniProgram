import Vue from 'vue'
import App from './App'
import store from './store'
import { getCache } from '@/common/js/utils'
import { noMultipleClicks } from '@/common/js/utils'
Vue.prototype.$noMultipleClicks = noMultipleClicks
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
	...App,
	store,
	created () {
	}
});
app.$mount();