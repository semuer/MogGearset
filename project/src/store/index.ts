import Vue from "vue";
import Vuex from "vuex";
import { EquipSetSaveData } from "@/@types/equip-set";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentEquipSet: null,
    savedEquipSets: [],
  },
  getters: {
    getEquipSetByName: (state) => (name: string) => {
      return state.savedEquipSets.find((set) => set["name"] === name) as
        | EquipSetSaveData
        | undefined;
    },
    getSavedEquipNameList: (state) => {
      return state.savedEquipSets.map((set) => set["name"] as string);
    },
  },
  mutations: {
    saveEquipSet(state, payload) {
      const savedSets = state.savedEquipSets as unknown as EquipSetSaveData[];
      let saved = false;
      for (let i = 0; i < savedSets.length; i++) {
        if (savedSets[i].name === payload.name) {
          savedSets.splice(i, 1, payload.data);
          saved = true;
        }
      }
      if (!saved) {
        savedSets.push(payload);
      }
    },
    loadEquipSetByName(state, payload) {
      const savedSets = state.savedEquipSets as unknown as EquipSetSaveData[];
      for (let i = 0; i < savedSets.length; i++) {
        if (savedSets[i].name === payload.name) {
          state.currentEquipSet = payload;
        }
      }
    },
  },
  actions: {},
  modules: {},
});
