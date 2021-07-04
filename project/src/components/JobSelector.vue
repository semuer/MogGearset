<template>
<!--  <v-select-->
<!--    :hide-details="true"-->
<!--    :items="jobList"-->
<!--    :value="value"-->
<!--    dense-->
<!--    item-text="name"-->
<!--    item-value="abb"-->
<!--    label="Job"-->
<!--    solo-->
<!--    v-on:change="$emit('input', $event)"-->
<!--  ></v-select>-->
  <v-col class="pa-0">
  <v-row no-gutters>
    <v-chip-group
        v-model="inputVal"
        column
        multiple
    >
      <v-chip
          v-for="job in jobList"
          v-bind:key="job.abb"
          :value="job.abb"
          outlined
          small
          :color="isActiveJob(job.abb) ? 'primary' : 'default'"
          label
      >
       {{job.name}}
      </v-chip>
    </v-chip-group>
  </v-row>
  <v-row no-gutters>
    <v-btn small v-on:click="clearJobs">{{$t('ui.job.clearAll')}}</v-btn>
  </v-row>
  </v-col>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class JobSelector extends Vue {
  @Prop() readonly type!: string ;
  @Prop() readonly value!: string[];

  name = "JobSelector";

  get jobList (){
    return [
    { abb: "WAR", name: this.$t('ui.job.WAR') },
    { abb: "MNK", name: this.$t('ui.job.MNK') },
    { abb: "WHM", name: this.$t('ui.job.WHM') },
    { abb: "BLM", name: this.$t('ui.job.BLM') },
    { abb: "RDM", name: this.$t('ui.job.RDM') },
    { abb: "THF", name: this.$t('ui.job.THF') },
    { abb: "PLD", name: this.$t('ui.job.PLD') },
    { abb: "DRK", name: this.$t('ui.job.DRK') },
    { abb: "BST", name: this.$t('ui.job.BST') },
    { abb: "BRD", name: this.$t('ui.job.BRD') },
    { abb: "RNG", name: this.$t('ui.job.RNG') },
    { abb: "SAM", name: this.$t('ui.job.SAM') },
    { abb: "NIN", name: this.$t('ui.job.NIN') },
    { abb: "DRG", name: this.$t('ui.job.DRG') },
    { abb: "SMN", name: this.$t('ui.job.SMN') },
    { abb: "BLU", name: this.$t('ui.job.BLU') },
    { abb: "COR", name: this.$t('ui.job.COR') },
    { abb: "PUP", name: this.$t('ui.job.PUP') },
    { abb: "DNC", name: this.$t('ui.job.DNC') },
    { abb: "SCH", name: this.$t('ui.job.SCH') },
    { abb: "GEO", name: this.$t('ui.job.GEO') },
    { abb: "RUN", name: this.$t('ui.job.RUN') }
    ]
  }



     public isActiveJob (abb:string) : boolean
     {
        return this.value.includes(abb);
     }

     public clearJobs():void{
       this.$emit('input', []);
     }

     get inputVal():string[]{
       return this.value;
     }
     set inputVal(val:string[]){
       this.$emit('input', val);
     }
  
};
</script>

<style scoped></style>
