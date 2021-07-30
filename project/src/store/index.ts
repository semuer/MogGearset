import Vue from "vue";
import Vuex from "vuex";
import { EquipSetSaveData } from "@/@types/equip-set";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentEquipSet: { name: "", data: {} },
    savedEquipSets: [],
  },
  getters: {
    getEquipSetByName: (state) => (name: string) => {
      return state.savedEquipSets.find((set) => set["name"] === name) as
        | EquipSetSaveData
        | undefined;
    },
    getSavedEquipNameList: (state) => {
      const result = state.savedEquipSets
        .filter((set) => set["name"] != undefined)
        .map((set) => set["name"] as string);
      return result ?? [];
    },
    getCurrentEquipSetName: (state) => {
      return state.currentEquipSet.name;
    },
  },
  mutations: {
    setCurrentEquipSetName(state, payload) {
      Vue.set(state.currentEquipSet, "name", payload.name);
    },
    saveEquipSet(state, payload) {
      const savedSets = state.savedEquipSets as unknown as EquipSetSaveData[];
      let saved = false;
      for (let i = 0; i < savedSets.length; i++) {
        if (savedSets[i].name === payload.name) {
          savedSets.splice(i, 1, JSON.parse(JSON.stringify(payload)));
          saved = true;
        }
      }
      if (!saved) {
        savedSets.push(JSON.parse(JSON.stringify(payload)));
      }
    },
    loadEquipSetByName(state, payload) {
      const savedSets = state.savedEquipSets as unknown as EquipSetSaveData[];
      for (let i = 0; i < savedSets.length; i++) {
        if (savedSets[i].name === payload.name) {
          Vue.set(state.currentEquipSet, "name", savedSets[i].name);
          Vue.set(
            state.currentEquipSet,
            "data",
            JSON.parse(JSON.stringify(savedSets[i].data))
          );
        }
      }
    },
    deleteEquipSetByName(state, payload) {
      const savedSets = state.savedEquipSets as unknown as EquipSetSaveData[];
      for (let i = 0; i < savedSets.length; i++) {
        if (savedSets[i].name === payload.name) {
          savedSets.splice(i, 1);
        }
      }
    },
    clearCurrentEquipSetSlot(state, payload) {
      Vue.set(state.currentEquipSet.data, payload.slot, null);
    },
    setCurrentEquipSetSlot(state, payload) {
      Vue.set(state.currentEquipSet.data, payload.slot, payload.data);
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({ key: "mgs" })],
});
