<template>
  <v-list-item :value="indexName" class="pa-0">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-2" cols="4">
        <v-btn color="secondary" elevation="2" small width="95%"
          >{{ labelName }}
        </v-btn>
      </v-col>
      <v-col class="ma-0 pa-1 pr-2">
        <v-row no-gutters>
          <v-text-field
            :hide-details="true"
            :label="indexName"
            :value="itemName"
            clearable
            dense
            flat
            readonly
            solo
            @click:clear="$emit('clearSlot')"
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
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
        return item["Jp"];
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped></style>
