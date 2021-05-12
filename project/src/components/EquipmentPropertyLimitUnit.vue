<template>
  <v-container>
    <v-list-item
        v-for="limiter in limiters"
        v-bind:key="limiter.index"
        class=""
        no-gutters>
      <v-row>
      <v-col cols="1">
      <v-checkbox
          :input-value="true"
          class="pt-0"
          @change="$emit('activeChanged', {index:limiter.index, isActive:$event})" />
      </v-col>
      <v-col cols="11">
      <v-autocomplete :items="propsArray"
                      :filter="autoCompleteFilter"
                      label="性能"
                      type="text"
                      class="mr-2"
                      @click:clear="$emit('valueChanged', {index:limiter.index, property:''})"
                      @change="$emit('valueChanged', {index:limiter.index, property:$event})"
                      outlined
                      clearable
                      hide-details
                      dense
                      style="min-width:50px"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
      <v-text-field
          label="最小値"
          outlined
          dense
          value="0"
          type="number"
          hide-details
          class="pr-0 mr-2"
          v-on:input="$emit('valueChanged', {index:limiter.index, minValue:$event})"
          v-on:clear="$emit('valueChanged', {index:limiter.index, minValue:0});"
          clearable
      ></v-text-field>
      </v-col>
      <v-col cols="2">
      <v-btn v-on:click="$emit('delete',limiter.index)" elevation="1"
             x-small fab dark color="red lighten-2">✖</v-btn>
      </v-col>
    </v-row>
    </v-list-item>
  </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import {Limiter} from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";

@Component
export default class EquipmentPropertyLimitUnit extends Mixins(xiUtils) {
  @Prop() readonly limiters!: Limiter[];
  @Prop() readonly propsArray! : string[];

  public autoCompleteFilter (item:string, queryText:string, itemText:string) {
    const normalizedItemText = this.kataToHira(this.fullWidthStrToHalfWidthStr(itemText.toLowerCase()));
    const normalizedQueryText = this.kataToHira(this.fullWidthStrToHalfWidthStr(queryText.toLowerCase()));

    return normalizedItemText.indexOf(normalizedQueryText) > -1
  }
}
</script>

<style scoped>

</style>
