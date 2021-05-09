<template>
  <v-select
      :items="jobList"
      label="Job"
      item-text="name"
      item-value="abb"
      :value="value"
      solo
      dense
      :hide-details="true"
      v-on:change="$emit('input', $event)"
  ></v-select>
</template>

<script>
export default {
  name: "JobSelector",
  data: () => ({
    jobList: [
      {abb: "WAR", name: "戦士 / WAR"},
      {abb: "MNK", name: "モンク / MNK"},
      {abb: "WHM", name: "白魔道士 / WHM"},
      {abb: "BLM", name: "黒魔道士 / BLM"},
      {abb: "RDM", name: "赤魔道士 / RDM"},
      {abb: "THF", name: "シーフ / THF"},
      {abb: "PLD", name: "ナイト / PLD"},
      {abb: "DRK", name: "暗黒騎士 / DRK"},
      {abb: "BST", name: "獣使い / BST"},
      {abb: "BRD", name: "吟遊詩人 / BRD"},
      {abb: "RNG", name: "狩人 / RNG"},
      {abb: "SAM", name: "侍 / SAM"},
      {abb: "NIN", name: "忍者 / NIN"},
      {abb: "DRG", name: "竜騎士 / DRG"},
      {abb: "SMN", name: "召喚士 / SMN"},
      {abb: "BLU", name: "青魔道士 / BLU"},
      {abb: "COR", name: "コルセア / COR"},
      {abb: "PUP", name: "からくり士 / PUP"},
      {abb: "DNC", name: "踊り子 / DNC"},
      {abb: "SCH", name: "学者 / SCH"},
      {abb: "GEO", name: "風水士 / GEO"},
      {abb: "RUN", name: "魔導剣士 / RUN"},
    ],
  }),
  props: {
    type: {
      default() {
        return 'text';
      }
    },
    value: {}
  },
}
</script>

<style scoped>

</style>