<template>
  <v-item :value="indexName" v-slot="{ active, toggle }">
    <v-card
        style="width: 100%; height:100%"
        :class="'ma-0 pa-0 '"
        :color="backgroundColor(active)"
        outlined
        flat
        elevation="0"
        @click="toggle"
    >
      <v-card-title style="position: relative" class="blue-grey darken-1 pa-0 flex-row text-center align-center justify-center">
        <span class="align-self-center text-center white--text pa-0 text-body-2">{{ labelName }}</span>
        <v-btn v-if="items[indexName] != null" style="position: absolute;right: 0;" icon x-small class="ml-auto" @click="$emit('clearSlot')">
          <v-icon
          x-small
          >
        mdi-close
      </v-icon></v-btn>
      </v-card-title>
      <v-sheet :color="backgroundColor(active)" class="justify-center align-center flex-row" height="40px">
        <v-img aspect-ratio="1" contain :src="iconUrl" height="32px" class="mt-1"></v-img>
      </v-sheet>
      <v-sheet style="width:100%;" class="blue-grey lighten-4 pa-0 text-center justify-center">
        <p style="height:18px; width:100%; white-space: nowrap;overflow: hidden; overflow-wrap: normal; text-overflow: ellipsis;" class="text-center blue-grey--text darken-3--text pl-1 pr-1 pa-0 ma-0 text-body-2">{{ itemName }}</p>
      </v-sheet>
    </v-card>
  </v-item>
</template>

<script lang="ts">
import xiUtils from "@/mixins/xiutils";
import {Component, Mixins, Prop} from "vue-property-decorator";
import {Equipment, EquipSet} from "@/@types/equip-set";

@Component
export default class EquipIconSlot extends Mixins(xiUtils) {
  name = "EquipIconSlot";

  @Prop() readonly items!: EquipSet;
  @Prop() readonly indexName!: string;
  @Prop() readonly dirty!: boolean;

  get labelName(){
    return this.$t('ui.equipSlot.' + this.indexName)
  }

  get itemName() {
    const item = this.items[this.indexName];
    if (item != null && Object.keys(item).length !== 0) {
      if(this.$i18n.locale == "ja")
      {
        return item["Jp"];
      }
      else
      {
        return item["En"];
      }
    } else {
      return null;
    }
  }

  public backgroundColor(active:boolean) {
    if(active)
    {
      return "orange lighten-3 ";
    }
    const item = this.items[this.indexName];
    if (item != null && Object.keys(item).length !== 0) {
      return "blue-grey lighten-3 ";
    } else {
      return "blue-grey lighten-5";
    }
  }

  get iconUrl() {
    if (this.items[this.indexName] === undefined || this.items[this.indexName] === null) {
      return "";
    }
    return this.getItemIconUrl(this.items[this.indexName].Id);
  }

}

</script>

<style scoped>
</style>
