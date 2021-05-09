<template>
  <v-container class="pt-6 ma-0">
    <v-row
        v-for="limiter in limiters"
        v-bind:key="limiter.index"
    class="pl-4 pr-4 pb-2">
      <v-text-field
          dense
          label="性能"
          outlined
          type="text"
          class="pr-2"
          clearable
          v-on:input="$emit('valueChanged', {index:limiter.index, property:$event})"
          @click:clear="$emit('valueChanged', {index:limiter.index, property:''})"
          style="min-width:50px"
          hide-details
      ></v-text-field>
      <v-text-field
          label="最小値"
          outlined
          dense
          value=0
          type="number"
          hide-details
          class="pr-2"
          v-on:input="$emit('valueChanged', {index:limiter.index, minValue:$event})"
          v-on:clear="$emit('valueChanged', {index:limiter.index, minValue:0})"
          style="min-width:120px;max-width:120px"
          clearable
      ></v-text-field>
      <v-btn v-on:click="$emit('delete',limiter.index)" class="mr-2" elevation="1"
             small color="red lighten-5">削除</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "EquipmentPropertyLimitUnit",
  props: {
    limiters: Array,
  },
}
</script>

<style scoped>

</style>