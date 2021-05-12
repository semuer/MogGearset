<template>
  <div>
  <v-list-item
      two-line
      :value="source"
      class="align-center"
  >

    <v-list-item-content>
      <v-list-item-title class="align-center">{{source['JpFull']}}
        <v-chip x-small label color="pink" text-color="white" class="mr-1">{{"Lv."+source['Level']}}</v-chip>
        <v-chip v-if="source['ItemLevel'] != undefined" x-small label color="purple" text-color="white" class="mr-1">{{"IL."+source['ItemLevel']}}</v-chip>
        <v-chip v-if="source['SuLevel'] != undefined" x-small label color="blue" text-color="white" class="mr-1">{{"Su"+source['SuLevel']}}</v-chip>
      </v-list-item-title>
      <v-list-item-subtitle class="text-wrap"> <text-highlight :queries="highlightArray" :wholeWordMatch=true>{{source['JpDescription']}}</text-highlight></v-list-item-subtitle>

    </v-list-item-content>
    <v-list-item-icon class="pr-0 mr-3">
      <v-btn v-on:click="$emit('select',source)"
             elevation="1"
             x-small fab dark color="blue lighten-2"
             class="mt-2"
      >✓</v-btn>
    </v-list-item-icon>
  </v-list-item>
  <v-divider/>
  </div>
</template>

<script>
export default {
  name: "EquipmentListItem",
  props: {
    index: { // index of current item
      type: Number
    },
    source: { // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default () {
        return {}
      }
    },
    limiters:{
      type: Array
    }
  },
  computed:{
    highlightArray: function()  {
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
  }
}
</script>

<style scoped>

</style>