<template>
  <v-card style="width: 100%; height:100%"
          :class="'ma-0 pa-0 '"
          outlined
          flat
          elevation="0">
    <v-card-title class="pa-0 pl-3 blue-grey darken-1 white--text">
      <v-icon
          left
          color="white"
      >
        mdi-calculator
      </v-icon>
      <span>装備セット性能 ver.α</span>
    </v-card-title>
    <v-alert
        outlined
        dense
        type="warning"
        border="left"
        class="ma-2 mb-2"
    >
      {{$t('ui.item.disclaimerViewer')}} </v-alert>
  </v-card>
</template>

<script lang="ts">
import xiUtils from "@/mixins/xiutils";
import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import {Equipment, EquipmentWithAug, EquipSet} from "@/@types/equip-set";
import EquipIconSlot from "@/components/EquipIconSlot.vue";

@Component
export default class PerformanceViewer extends Mixins(xiUtils) {
  name = "PerformanceViewer";

  calculatedInfo: CalculatedInfo[] = [];

  @Prop({ default: null }) readonly equipSetInfo!: EquipSet | null;
  @Prop({ default: false }) readonly dirty!: boolean;

  @Watch("dirty")
  @Watch("equipSetInfo", { immediate: true, deep: true })
  equipSetInfoChanged() {
    this.calculatedInfo = [];
    if (this.equipSetInfo == null) {
      return;
    }

    for (let slotName in this.equipSetInfo) {
      if (Object.prototype.hasOwnProperty.call(this.equipSetInfo, slotName)) {
        let slot: EquipmentWithAug | null = this.equipSetInfo[slotName];
        if (slot == null) {
          continue;
        }

      }
    }
  }
}


interface CalculatedInfo {
  CateID?: number;
  PropID: string;
  Value?: number;
  Unit?: string;
}

</script>

<style scoped>
</style>
