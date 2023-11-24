import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import service from './service.js';
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
		service
  }
});