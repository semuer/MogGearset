<template>
  <v-container>
    <v-list-item
      v-for="limiter in limiters"
      v-bind:key="limiter.index"
      class="ma-0 pa-0"
    >
      <!-- Property Filter -->
      <v-row v-if="limiter.isProp" class="align-center pt-0" no-gutters>
        <v-col cols="1">
          <v-checkbox
            :input-value="true"
            class=""
            @change="
              $emit('activeChanged', { index: limiter.index, isActive: $event })
            "
          />
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            :filter="autoCompleteFilter"
            :items="propsArray"
            class="mr-2"
            clearable
            dense
            hide-details
            label="性能"
            outlined
            style="min-width: 50px"
            type="text"
            @change="
              $emit('valueChanged', { index: limiter.index, property: $event })
            "
            @click:clear="
              $emit('valueChanged', { index: limiter.index, property: '' })
            "
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            class="pr-0 mr-2"
            clearable
            dense
            hide-details
            label="最小値"
            outlined
            type="number"
            value="0"
            v-on:clear="
              $emit('valueChanged', { index: limiter.index, minValue: 0 })
            "
            v-on:input="
              $emit('valueChanged', { index: limiter.index, minValue: $event })
            "
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            color="red lighten-2"
            dark
            elevation="1"
            fab
            x-small
            v-on:click="$emit('delete', limiter.index)"
            >✖
          </v-btn>
        </v-col>
      </v-row>
      <!-- Text Filter -->
      <v-row v-if="limiter.isText" class="align-center pt-0" no-gutters>
        <v-col cols="1">
          <v-checkbox
            :input-value="true"
            class=""
            @change="
              $emit('activeChanged', { index: limiter.index, isActive: $event })
            "
          />
        </v-col>
        <v-col cols="10">
          <v-text-field
            class="mr-2"
            clearable
            dense
            hide-details
            label="テキスト"
            outlined
            style="min-width: 50px"
            type="text"
            @input="
              $emit('valueChanged', { index: limiter.index, property: $event })
            "
            @click:clear="
              $emit('valueChanged', { index: limiter.index, property: '' })
            "
          />
        </v-col>
        <v-col cols="1">
          <v-btn
            color="red lighten-2"
            dark
            elevation="1"
            fab
            x-small
            v-on:click="$emit('delete', limiter.index)"
            >✖
          </v-btn>
        </v-col>
      </v-row>
      <!-- Sorting -->
      <v-row
        v-if="limiter.isSort && !limiter.isText"
        class="align-center pt-0"
        no-gutters
      >
        <v-col cols="1">
          <v-checkbox
            :input-value="true"
            class=""
            @change="
              $emit('activeChanged', { index: limiter.index, isActive: $event })
            "
          />
        </v-col>
        <v-col cols="7">
          <v-autocomplete
            :filter="autoCompleteFilter"
            :items="propsArray"
            class="mr-2"
            clearable
            dense
            hide-details
            label="並べ替え基準性能"
            outlined
            style="min-width: 50px"
            type="text"
            @change="
              $emit('valueChanged', { index: limiter.index, property: $event })
            "
            @click:clear="
              $emit('valueChanged', { index: limiter.index, property: '' })
            "
          />
        </v-col>
        <v-col cols="3">
          <v-checkbox
            :input-value="false"
            class=""
            label="昇順"
            @change="
              $emit('sortOrderChanged', { index: limiter.index, isAsc: $event })
            "
          ></v-checkbox>
        </v-col>
        <v-col cols="1">
          <v-btn
            color="red lighten-2"
            dark
            elevation="1"
            fab
            x-small
            v-on:click="$emit('delete', limiter.index)"
            >✖
          </v-btn>
        </v-col>
      </v-row>
    </v-list-item>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Limiter } from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";

@Component
export default class EquipmentPropertyLimitUnit extends Mixins(xiUtils) {
  @Prop() readonly limiters!: Limiter[];
  @Prop() readonly propsArray!: string[];

  public autoCompleteFilter(item: string, queryText: string, itemText: string) {
    const normalizedItemText = this.kataToHira(
      this.fullWidthStrToHalfWidthStr(itemText.toLowerCase())
    );
    const normalizedQueryText = this.kataToHira(
      this.fullWidthStrToHalfWidthStr(queryText.toLowerCase())
    );

    return normalizedItemText.indexOf(normalizedQueryText) > -1;
  }
}
</script>

<style scoped></style>
