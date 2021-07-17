<template>
  <v-list-item :value="indexName" class="pa-0">
    <v-sheet
      style="width: 100%"
      class="ma-0 pa-0 fill-height"
      :color="backgroundColor"
      tile
    >
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-2" cols="3">
          <v-btn color="secondary" elevation="2" small width="95%"
            >{{ labelName }}
          </v-btn>
        </v-col>
        <v-col class="ma-0 pa-1 pr-2" cols="9">
          <v-row no-gutters>
            <v-text-field
              :hide-details="true"
              :label="indexName"
              :value="itemName"
              clearable
              background-color="transparent"
              dense
              flat
              readonly
              solo
              @click:clear="$emit('clearSlot')"
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-list-item>
</template>

<script>
export default {
  name: "EquipSlotSelector",
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
    },
    backgroundColor: function () {
      const item = this.items[this.indexName];
      if (item != null && Object.keys(item).length !== 0) {
        return "blue lighten-5";
      } else {
        return "blue-grey lighten-5";
      }
    },
  },
};
</script>

<style scoped>
</style>
