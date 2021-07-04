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
            v-for="job in jobList()"
            v-bind:key="job.abb"
            :value="job.abb"
            outlined
            small
            :color="isActiveJob(job.abb) ? 'primary' : 'default'"
            label
        >
          {{ job.name }}
        </v-chip>
      </v-chip-group>
    </v-row>
    <v-row no-gutters>
      <v-btn small v-on:click="clearJobs">{{ $t('ui.job.clearAll') }}</v-btn>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import {Component, Mixins, Prop, Vue} from "vue-property-decorator";
import xiUtils from "@/mixins/xiutils";

@Component
export default class JobSelector extends Mixins(xiUtils) {
  @Prop() readonly type!: string;
  @Prop() readonly value!: string[];

  name = "JobSelector";

  public isActiveJob(abb: string): boolean {
    return this.value.includes(abb);
  }

  public clearJobs(): void {
    this.$emit('input', []);
  }

  get inputVal(): string[] {
    return this.value;
  }

  set inputVal(val: string[]) {
    this.$emit('input', val);
  }

};
</script>

<style scoped></style>
