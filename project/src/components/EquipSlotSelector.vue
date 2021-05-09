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
        <v-text-field
            :value="itemName"
            :label="labelName"
            :hide-details="true"
            readonly
            solo
            dense
            flat
        ></v-text-field>
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
      if (this.item != null) {
        return this.item["Jp"];
      } else {
        return "装備なし"
      }
    }
  }
}
</script>

<style scoped>

</style>