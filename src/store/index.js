/** @format */

import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {findAuth, routesByRole} from '../Global';
import {isJwtExpired} from 'jwt-check-expiration';

import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    expired: true,

    isAdmin: false,
    isRecep: false,
    isHuesp: false,

    products: [],
    product: {},
    types: {},

    userdto: '',

    routes: [],
  },
  mutations: {
    setToken(state, status) {
      state.token = status;
    },
    setExpired(state, status) {
      state.expired = status;
    },

    setIsAdmin(state, status) {
      state.isAdmin = status;
    },
    setIsRecep(state, status) {
      state.isRecep = status;
    },
    setIsHuesp(state, status) {
      state.isHuesp = status;
    },
    setRoutes(state, status) {
      state.routes = status;
    },

    SET_PRODUCTS(state, status) {
      state.products = status;
    },
    SET_PRODUCT(state, status) {
      state.products.push(status);
    },

    SET_TYPES(state, status) {
      state.types = status;
    },

    SET_USERDTO(state, status) {
      state.userdto = status;
    },
  },
  actions: {
    async addToken({commit}, {token}) {
      commit('setToken', token);
      commit('setExpired', isJwtExpired(token));
    },

    async getType({commit}, {id}) {
      try {
        const response = await axios.get('/typeroom/' + id);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getTypes({commit}) {
      try {
        const response = await axios.get('/typeroom/');
        const array = response.data;

        commit('SET_TYPES', array);
      } catch (error) {
        console.error(error);
      }
    },

    async getProducts({commit}) {
      try {
        const response = await axios.get('/room/');
        const array = response.data;

        commit('SET_PRODUCTS', array);
      } catch (error) {
        console.error(error);
      }
    },

    async getProductsById({commit}, {id}) {
      try {
        const response = await axios.get('/room/findById/' + id);
        return response.data;
      } catch (error) {}
    },
    async addProduct({commit}, {product}) {
      try {
        const res = await axios.post('/room/save', {
          idroom: product.id,
          flat: product.flat,
          price: product.price,
          idtype: product.type,
          photo: product.photo,
          children: product.children,
        });

        return res.data.message;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async deleteProduct({commit}, {id}) {
      try {
        const res = await axios.delete('/room/deleteById/' + id);
        return res.data.message;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async changeState({commit}, {id}) {
      try {
        const res = await axios.put('/room/changeState/' + id);
        return res.data.message;
      } catch (error) {
        return error.response.data.message;
      }
    },

    async findUserByEmail({commit}, {xy}) {
      try {
        let email = jwt_decode(xy).sub;

        const response = await axios.get('/profile/findByEmail/' + email);
        commit('SET_USERDTO', response.data);
      } catch (error) {}
    },

    async clear({commit}) {
      commit('setExpired', true);
      commit('SET_USERDTO', '');
      commit('setToken', '');
    },

    async defineRoles({commit}, {roles}) {
      commit('setIsAdmin', findAuth('ROLE_ADMIN', roles));
      commit('setIsRecep', findAuth('ROLE_RECP', roles));
      commit('setIsHuesp', findAuth('ROLE_HUESPED', roles));
    },
    async defineRoutes({commit}) {
      commit('setRoutes', routesByRole());
    },

    async findByAvaliable({commit}, {from}) {
      try {
        const res = await axios.get(
          '/reservation/findByAvaliable/' +
            from.date1 +
            '/' +
            from.date2 +
            '/' +
            from.nguest +
            '/' +
            from.ischildren
        );
        return res.data;
      } catch (error) {}
    },
    async CalculateSelectedRoom({commit}, {from}) {
      try {
        const res = await axios.get(
          '/reservation/CalculateSelectedRoom/' + from.idroom + '/' + from.date1 + '/' + from.date2
        );
        return res.data.body;
      } catch (error) {}
    },
    async saveReservation({commit}, {guest, date1, date2, idroom, iduser, data, requirements}) {
      try {
        const res = await axios.post('/reservation/save', {
          dni: guest.dni,
          firtsname: guest.firtsname,
          lastname: guest.lastname,
          email: guest.email,
          phone: guest.phone,
          date_ini: date1,
          date_end: date2,
          idroom: idroom,
          iduser: iduser,
          subtotal: data.subtotal,
          tax: data.tax,
          total: data.total,
          requirements: requirements,
        });
        console.log(res.data.message);
        return res.data;
      } catch (error) {
        return error.response.data;
      }
    },
    async ChangeStateReservation({commit}, {id}) {
      try {
        const res = await axios.put('/reservation/ChangeStateReservation/' + id);
        return res.data.message;
      } catch (error) {
        return error.response.data;
      }
    },
    async ChangeStateUser({commit}, {id}) {
      try {
        const res = await axios.put('/user/changeState/' + id);
        return res.data.message;
      } catch (error) {
        return error.response.data;
      }
    },
    async findAllReservation({commit}) {
      try {
        const res = await axios.get('/reservation/');
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },

    async findById({commit}, {id}) {
      try {
        const response = await axios.get('/user/findById/' + id);
        return response.data;
      } catch (error) {}
    },
    async getUsers({commit}) {
      try {
        const response = await axios.get('/user/findAll');
        const array = response.data;
        return array;
      } catch (error) {}
    },
    async addUser({commit}, {user}) {
      try {
        const response = await axios.post('/user/save', {
          dni: user.dni,
          firtsname: user.firtsname,
          lastname: user.lastname,
          number: user.number,
          email: user.email,
        });
        return response.data.message;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async mostUsedRoomTypes({commit}) {
      try {
        const response = await axios.get('/report/mostUsedRoomTypes');
        return response.data.body;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async allReservations({commit}) {
      try {
        const response = await axios.get('/report/allReservations');
        return response.data.body;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async promReservationsTime({commit}) {
      try {
        const response = await axios.get('/report/promReservationsTime');
        return response.data.body;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async UserWithMoreReservations({commit}) {
      try {
        const response = await axios.get('/report/UserWithMoreReservations/ROLE_RECP');
        return response.data.body;
      } catch (error) {
        return error.response.data.message;
      }
    },
    async SeeEarningsByDate({commit}, {date1, date2}) {
      try {
        const response = await axios.get('/report/SeeEarningsByDate/' + date1 + '/' + date2);
        return response.data.body;
      } catch (error) {
        return error.response.data.message;
      }
    },

    async findByGuestDni({commit}, {dni}) {
      try {
        const response = await axios.get('/guest/findByDni/' + dni);
        console.log(response);
        return response.data;
      } catch (error) {}
    },
  },
  modules: {},
  plugins: [
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});
