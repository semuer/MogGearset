<template>
  <v-item :value="indexName" class="">
    <v-card
      style="width: 100%"
      class="ma-0 pa-1"
      :color="backgroundColor"
      tile
      outlined
    >
      <v-img  aspect-ratio="1" contain :src="iconUrl" height="32px"></v-img>
    </v-card>
  </v-item>
</template>

<script>
import xiUtils from "@/mixins/xiutils";

export default {
  name: "EquipIconSlotSelector",
  mixins: [xiUtils],
  data: () => ({}),
  props: {
    labelName: String,
    items: Object,
    indexName: String,
    dirty: Boolean,
  },


  computed: {
    itemName: function () {
      const item = this.items[this.indexName];
      if (item != null && Object.keys(item).length !== 0) {
        return item["Jp"];
      } else {
        return null;
      }
    },
    backgroundColor: function () {
      const item = this.items[this.indexName];
      if (item != null && Object.keys(item).length !== 0) {
        return "blue lighten-5";
      } else {
        return "blue-grey lighten-5";
      }
    },
    iconUrl: function(){
      if(this.items[this.indexName] === undefined || this.items[this.indexName] === null)
      {
        return "";
      }
      return this.getItemIconUrl(this.items[this.indexName].Id);
    }
  },
};
</script>

<style scoped></style>
