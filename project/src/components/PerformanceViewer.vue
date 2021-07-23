<template>
  <v-card
    style="width: 100%; height: 100%"
    :class="'ma-0 pa-0 '"
    outlined
    flat
    elevation="0"
  >
    <v-card-title class="pa-0 pl-3 blue-grey darken-1 white--text">
      <v-icon left color="white"> mdi-calculator </v-icon>
      <span>{{ $t("ui.item.propertyViewer") }}</span>
    </v-card-title>
    <v-alert outlined dense type="warning" border="left" class="ma-2">
      {{ $t("ui.item.disclaimerViewer") }}
    </v-alert>
    <v-simple-table :dense="true" :fixed-header="true">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in calculatedInfo" v-bind:key="index">
            <td
              v-text="
                getSinglePropString(
                  $i18n.locale,
                  item.CateID,
                  item.PropID,
                  item.MainHand,
                  propDict,
                  cateDict
                )
              "
            ></td>
            <td v-text="item.Value == null ? '' : (item.Value + ((item.Unit==null)?'':item.Unit))"></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script lang="ts">
import xiUtils from "@/mixins/xiutils";
import { Component, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import {
  CalculatedAugInfo,
  CalculatedPropInfo,
  Equipment,
  EquipmentWithAug,
  EquipSet,
  Property,
} from "@/@types/equip-set";

@Component
export default class PerformanceViewer extends Mixins(xiUtils) {
  name = "PerformanceViewer";

  calculatedInfo: CalculatedPropInfo[] = [];

  @Prop({ default: null }) readonly equipSetInfo!: EquipSet | null;
  @Prop({ default: false }) readonly dirty!: boolean;
  @Prop() readonly propDict!: Map<string, string[]>;
  @Prop() readonly cateDict!: Map<string, string[]>;

  @Watch("dirty")
  @Watch("equipSetInfo", { immediate: true, deep: true })
  equipSetInfoChanged(): void {
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
        if (slot.Equip != null) {
          this.CalculateEquips(slot.Equip);
        }
        if (slot.Aug != null) {
          this.CalculateAugs(slot.Aug);
        }
      }
    }
  }

  public CalculateEquips(equip: Equipment): void {
    if (equip.Properties == null) {
      return;
    }
    for (const prop of equip.Properties) {
      this.CalculateProp(prop);
    }
  }

  public CalculateProp(prop: Property): void {
    let newProp: CalculatedPropInfo = {
      PropID: prop.PropID,
      CateID: prop.CatID ?? undefined,
      MinValue: prop.MinValue,
      Value: prop.Value,
      Unit: prop.Unit,
      MainHand: prop.MainHand,
      IsUnity: false,
    };
    this.AddInfo(newProp);
  }

  public CalculateAugs(augs: CalculatedAugInfo[]): void {
    for (const aug of augs) {
      this.CalculateAug(aug);
    }
  }

  public CalculateAug(aug: CalculatedAugInfo): void {
    let newProp: CalculatedPropInfo = {
      PropID: parseInt(aug.PropID),
      CateID: aug.CateID,
      Value: aug.Value,
      Unit: aug.Unit,
      MainHand: aug.MainHand,
      IsUnity: false,
    };
    this.AddInfo(newProp);
  }

  public AddInfo(info: CalculatedPropInfo): void {
    let added = false;
    for (let i = 0; i < this.calculatedInfo.length; ++i) {
      const orig = this.calculatedInfo[i];
      if (
        orig.CateID === info.CateID &&
        orig.PropID === info.PropID &&
        orig.Unit === info.Unit &&
          orig.MainHand == info.MainHand
      ) {
        added = true;
        if (info.Value == null) {
          Vue.set(this.calculatedInfo, i, orig);
          break;
        }
        if (orig.Value == null) {
          orig.Value = info.Value;
        } else {
          orig.Value += info.Value;
        }

        if (info.MinValue != null) {
          if (orig.MinValue == null) {
            orig.MinValue = info.MinValue;
          } else {
            orig.MinValue += info.MinValue;
          }
        } else {
          if (orig.MinValue == null) {
            orig.MinValue = info.Value;
          } else {
            orig.MinValue += info.Value;
          }
        }
        Vue.set(this.calculatedInfo, i, orig);
      }
    }

    if (!added) {
      if (info.MinValue == null && info.Value != null) {
        info.MinValue = info.Value;
      }
      this.calculatedInfo.push(info);
    }
  }
}
</script>

<style scoped></style>
