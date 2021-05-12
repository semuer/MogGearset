<template>
  <v-list-item class="pa-0" :value="labelName">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-2" cols="4">
        <v-btn color="secondary"
               elevation="2"
               width="95%"
               small>{{ labelName }}
        </v-btn>
      </v-col>
      <v-col class="ma-0 pa-1 pr-2">
        <v-row no-gutters>
        <v-text-field
            :value="itemName"
            :label="labelName"
            :hide-details="true"
            readonly
            solo
            dense
            clearable
            flat
            @click:clear="$emit('clearSlot')"
        ></v-text-field></v-row>
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
    item: Object,
    dirty: Boolean
  },
  computed: {
    itemName: function () {
      console.log("computed" + this.item)
      if (this.item != null && Object.keys(this.item).length !== 0) {
        return this.item["Jp"];
      } else {
        return null;
      }
    }
  }
}
</script>

<style scoped>

</style>