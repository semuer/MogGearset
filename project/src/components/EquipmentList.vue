<template>
  <v-container style="min-height:300px;width:100%;display: table">
    <v-sheet tile outlined style="width:100%;display:table-row;" class="pa-0 ma-0">
      <v-row class="pl-1 pr-1 pt-0 pb-0 ma-2">
        <v-checkbox
            v-model="isLevel99"
            label="Lv99"
            hide-details
            class="pl-2 pr-2"
        ></v-checkbox>
        <v-checkbox
            v-model="isItemLevel119"
            label="IL119"
            hide-details
        ></v-checkbox>
      </v-row>

      <v-row class="pl-4 ml-0 pb-1">
        <v-btn v-on:click="addLimiter" dense small elevation="1" color="blue lighten-3">フィルター追加</v-btn>
      </v-row>
      <equipment-property-limit-unit
          class="pl-1 pr-1 pt-1 pb-1 ma-2"
          :limiters="limiters"
          v-on:delete="deleteLimiter"
          v-on:valueChanged="limiterChanged"
      />
    </v-sheet>
    <v-list-item-group
        class="fill-height" style="width:100%;min-height:100px;display:table-row;">
      <DynamicScroller
          :items="equipData"
          :min-item-size="55"
          class="pa-0 ma-0 fill-height"
          style="width:100%;"
          key-field="Id"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[]"
              :data-index="index"
          >
            <v-list-item
                :key="item['Id']"
                two-line
                :value="item"
            >
              <v-list-item-icon>
                <v-btn v-on:click="$emit('select',item)">選択</v-btn>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item['JpFull']"></v-list-item-title>

                  <v-list-item-subtitle class="text-wrap"> <text-highlight :queries="highlightArray" :wholeWordMatch=true>{{item['JpDescription']}}</text-highlight></v-list-item-subtitle>

              </v-list-item-content>
            </v-list-item>
          </DynamicScrollerItem>
        </template>

      </DynamicScroller>
    </v-list-item-group>
  </v-container>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {Equipment, PropertyInfo} from "@/@types/equip-set";
import EquipmentPropertyLimitUnit from "@/components/EquipmentPropertyLimitUnit.vue";
import TextHighlight from "vue-text-highlight"

import {Resultset} from 'lokijs'

@Component({
  components: {
    EquipmentPropertyLimitUnit,
    TextHighlight
  }
})
export default class EquipmentList extends Vue {

  selectedItem: number = 1;
  limiters: Array<Limiter> = [];
  isLevel99: boolean = false;
  isItemLevel119: boolean = false;

  @Prop({default: null}) readonly equipQueryChain: Resultset<Equipment> | null

  equipData: Equipment[] = [];

  get highlightArray(): RegExp[]{
    let result:RegExp[] = [];
    for(let limiter of this.limiters){
      if(limiter.property !== ""){
        let propName = limiter.property;
        let propNameMatches = propName.match(/(?<=[:：]).+/);
        if(propNameMatches != null && propNameMatches.length !== 0){
          propName = propNameMatches[0];
        }
        result.push(new RegExp("(?<=^|[ \n\b:：])" + propName + "(?=[\n +\\-\b0-9])"));
      }
    }

    return result;
  }

  public getPropertiesArray(item: Equipment): PropertyInfo[] {
    let resultInfo: PropertyInfo[] = [];


    if (item.JpDescription == null || item.JpDescription.trim() === "") {
      return resultInfo;
    }

    let props = item.JpDescription.split(/[ \n]/).filter(i => i);
    let propRegex = /(?<name>[^\d%+-]+)(?<value>[\d%+-]+)?(?<suffix>[^ /n]+)?$/;

    let prefix:string = "";
    for(let prop of props) {

      let result = prop.match(propRegex);
      if (result == null) {
        console.log("Cannot parse prop:" + prop);
        continue;
      }
      if (result.groups == undefined) {
        console.log("Cannot parse prop:" + prop);
        continue;
      }

      let resultName = result.groups["suffix"] == undefined ? result.groups["name"]:result.groups["name"]+result.groups["suffix"];
      if(resultName == null){
        continue;
      }
      if(resultName.includes(":") || resultName.includes("："))
      {
          let matches = resultName.match(/.+(?=[:：])/);
          if(matches != null && matches.length !== 0){
            prefix = matches[0];
          }

          let propNameMatches = resultName.match(/(?<=[:：]).+/);
          if(propNameMatches != null && propNameMatches.length !== 0){
            resultName = propNameMatches[0];
          }


      }

      let value = parseInt(result.groups["value"]);
      let hasValue = true;
      if (isNaN(value)) {
        hasValue = false;
      }
      let resultValue: number | undefined = undefined;
      let valueUnit: string | undefined = undefined;
      if (hasValue) {
        resultValue = value;
        valueUnit = result.groups["value"].replace(/[-+0-9]/g, '');
      }


      resultInfo.push({
        name: (prefix === "") ? resultName : prefix + ":" + resultName,
        hasValue: hasValue,
        valueUnit: valueUnit,
        value: resultValue
      });
    }

    return resultInfo;
  }


  @Watch('equipQueryChain')
  @Watch('isLevel99')
  @Watch('isItemLevel119')
  @Watch('limiters')
  queryChanged() {
    if (this.equipQueryChain != null) {
      let chain: Resultset<Equipment> = this.equipQueryChain.copy();
      let query: Record<string, any> = {};

      if (this.isLevel99) {
        query["Level"] = 99;
      }
      if (this.isItemLevel119) {
        query["ItemLevel"] = 119;
      }
      if (Object.keys(query).length !== 0) {
        chain = chain.find(query);
      }

      if (this.limiters.length !== 0) {
        for (let i = 0; i < this.limiters.length; i++) {
          let testPropName = this.limiters[i].property;
          console.log(testPropName)
          if(testPropName === ""){
            continue;
          }
          let min = this.limiters[i].minValue;
          let thisptr = this;
          chain = chain.where(function (obj: Equipment) {
            let props = thisptr.getPropertiesArray(obj);
            let testPassed = false;

            // match test
            for(let prop of props){
              if (prop.name == testPropName) {
                if (prop.hasValue && prop.value != undefined) {
                  if (Math.abs(prop.value) >= min) {
                    testPassed = true;
                  }
                } else {
                  testPassed = true;
                }
              }
            }
            return testPassed;
          });
        }
      }

      this.equipData = chain.data();
    }
  }


  public addLimiter(): void {
    this.limiters.push({
      index: Date.now(),
      property: "",
      minValue: 0,
    });
  }

  public deleteLimiter(index: number): void {
    for (let i = 0; i < this.limiters.length; i++) {
      if (this.limiters[i].index == index) {
        this.limiters.splice(i, 1);
      }
    }

  }

  public limiterChanged(obj:Record<string,any>):void{
    if(obj["index"] != undefined){
      for(let limiter of this.limiters){
        if(limiter.index == obj["index"])
        {
          if(obj["property"] != undefined){
            limiter.property = obj["property"].replace("：",":");
          }
          if(obj["minValue"] != undefined){
            limiter.minValue = obj["minValue"];
          }
          this.queryChanged();
        }
      }
    }
  }
}

interface Limiter {
  index: number,
  property: string,
  minValue: number,
}

</script>

<style scoped>

</style>