<template>
  <v-container class="pa-0 ma-0" style="width: 100%">
    <v-card :value="dirty" style="width: 100%">
      <v-data-table
        :disable-filtering="true"
        :disable-pagination="true"
        :headers="headers"
        :hide-default-footer="true"
        :items="calculatedInfo"
        class="elevation-1"
        dense
      ></v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Equipment, EquipSet } from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";

@Component
export default class EquipSetPerformanceView extends Mixins(xiUtils) {
  headers = [
    {
      text: "性能",
      align: "start",
      value: "NameWithUnit",
      width: 200,
    },
    { text: "累計", value: "TotalValue", width: 100 },
    { text: "サブ無", value: "WithoutSubValue", width: 100 },
  ];

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
        let slot: Equipment | null = this.equipSetInfo[slotName];
        if (slot == null) {
          continue;
        }
        let props = this.getPropertiesArray(slot);
        for (let prop of props) {
          let added = false;
          let nameWithUnit = prop.valueUnit
            ? prop.name + "(" + prop.valueUnit + ")"
            : prop.name;
          if (
            prop.name == "DMG" ||
            prop.name == "隔" ||
            prop.name == "Ｄ" ||
            prop.name == "Delay"
          ) {
            switch (slotName) {
              case "Main":
                nameWithUnit += "(主)";
                break;
              case "Sub":
                nameWithUnit += "(副)";
                break;
              case "Range":
                nameWithUnit += "(遠)";
                break;
              case "Ammo":
                nameWithUnit += "(弾)";
                break;
            }
          }
          for (let info of this.calculatedInfo) {
            if (
              info.NameWithUnit == nameWithUnit &&
              info.HasValue == prop.hasValue
            ) {
              if (prop.hasValue && prop.value !== undefined) {
                if (info.WithoutSubValue !== undefined && slotName !== "Sub") {
                  info.WithoutSubValue += prop.value;
                }
                if (info.TotalValue !== undefined) {
                  info.TotalValue += prop.value;
                }
              }
              added = true;
              break;
            }
          }
          if (!added) {
            this.calculatedInfo.push({
              NameWithUnit: nameWithUnit,
              HasValue: prop.hasValue,
              TotalValue: prop.hasValue ? prop.value : undefined,
              WithoutSubValue:
                prop.hasValue && slotName !== "Sub" ? prop.value : undefined,
            });
          }
        }
      }
    }
  }
}

interface CalculatedInfo {
  NameWithUnit: string;
  HasValue: boolean;
  TotalValue?: number;
  WithoutSubValue?: number;
}
</script>

<style scoped></style>
