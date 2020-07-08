import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        honduras: [],
        salvador: [],
        belice: [],
        guatemala: [],
        nicaragua: []
    },
    mutations: {
        setBelice(state, payload) {
            state.belice.push(payload);
        },
        setGuatemala(state, payload) {
            state.guatemala.push(payload);
        },
        setHonduras(state, payload) {
            state.honduras.push(payload);
        },
        setNicaragua(state, payload) {
            state.nicaragua.push(payload);
        },
        setSalvador(state, payload) {
            state.salvador.push(payload);
        }
    },
    actions: {
        async cargarDatos({ commit }) {
            try {
                const urlBase = 'https://api.covid19api.com/country/'
                let datosPais = await axios.get(urlBase + 'honduras');
                datosPais.data.forEach(item => {
                    commit('setHonduras', item);
                });

                datosPais = await axios.get(urlBase + 'belize');
                datosPais.data.forEach(item => {
                    commit('setBelice', item);
                })

                datosPais = await axios.get(urlBase + 'guatemala');
                datosPais.data.forEach(item => {
                    commit('setGuatemala', item);
                })

                datosPais = await axios.get(urlBase + 'nicaragua');
                datosPais.data.forEach(item => {
                    commit('setNicaragua', item);
                })

                datosPais = await axios.get(urlBase + 'sv');
                datosPais.data.forEach(item => {
                    commit('setSalvador', item);
                })
            } catch (err) {
                console.log(err);
            }
        }
    },
    modules: {}
})