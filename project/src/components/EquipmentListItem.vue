<template>
  <div>
  <v-list-item
      two-line
      :value="source"
      class="align-center"
  >

    <v-list-item-content>
      <v-list-item-title class="align-center">{{source.JpFull}}
        <v-chip v-if="isRare" x-small label color="yellow" text-color="white" class="mr-1">Rare</v-chip>
        <v-chip v-if="isEx" x-small label color="green" text-color="white" class="mr-1">Ex</v-chip>
        <v-chip x-small label color="pink" text-color="white" class="mr-1">{{"Lv."+source.Level}}</v-chip>
        <v-chip v-if="source.ItemLevel !== undefined" x-small label color="purple" text-color="white" class="mr-1">{{"IL."+source.ItemLevel}}</v-chip>
        <v-chip v-if="source.SuLevel !== undefined" x-small label color="blue" text-color="white" class="mr-1">{{"Su"+source.SuLevel}}</v-chip>
      </v-list-item-title>
      <v-list-item-subtitle class="text-wrap"> <text-highlight :queries="highlightArray" :wholeWordMatch=true>{{source.JpDescription}}</text-highlight></v-list-item-subtitle>

    </v-list-item-content>
    <v-list-item-icon class="pr-0 mr-3">
      <v-btn v-on:click="onSelectItem"
             elevation="1"
             x-small fab dark color="blue lighten-2"
             class="mt-2"
      >✓</v-btn>
    </v-list-item-icon>
  </v-list-item>
  <v-divider/>
  </div>
</template>

<script lang="ts">

import {Component, Mixins, Prop} from "vue-property-decorator";
import scrollerUtils from "@/mixins/scrollerUtils";
import {Equipment, Limiter} from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";

@Component
export default class EquipmentListItem extends Mixins(scrollerUtils,xiUtils) {
  @Prop() readonly index!: number;
  @Prop() readonly source!: Equipment;
  @Prop() readonly limiters!: Limiter[];

  get isRare():boolean{
    return this.source.Flags == undefined ? false : this.IsRare(this.source.Flags);
  }
  get isEx():boolean{
    return this.source.Flags !== undefined && this.IsEx(this.source.Flags)
  }

  get highlightArray()
  {
      let result = [];
      for (let limiter of this.limiters) {
        if (limiter.property !== "" && limiter.isActive) {
          let propName = limiter.property;
          let propNameMatches = propName.match(/[:：](.+)/);
          if (propNameMatches != null && propNameMatches.length > 1) {
            propName = propNameMatches[1];
          }
          result.push(new RegExp("(^|[ \n\b:：])" + propName + "(?=[\n +\\-\b0-9])", "i"));
        }
      }
      return result;
  }

  public onSelectItem(){
    this.dispatch('EquipmentList','select', this.source);
  }
}
</script>

<style scoped>

</style>
