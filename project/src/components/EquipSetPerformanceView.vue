<template>
 <v-container style="width:100%" class="pa-0 ma-0">
<v-card :value="dirty" style="width:100%">
  <v-data-table
      :headers="headers"
      :items="calculatedInfo"
      :disable-pagination="true"
      :disable-filtering="true"
      :hide-default-footer="true"
      class="elevation-1"
      dense
  ></v-data-table>
</v-card>
 </v-container>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {Equipment, EquipSet, PropertyInfo} from "@/@types/equip-set";

@Component
export default class EquipSetPerformanceView extends Vue {

  headers = [
    {
      text: '性能',
      align: 'start',
      value: 'NameWithUnit',
      width: 200
    },
    { text: '累計', value: 'TotalValue' ,width: 100},
    { text: 'サブ無', value: 'WithoutSubValue' ,width: 100},
  ];

  calculatedInfo:CalculatedInfo[] = [];

  @Prop({default: null}) readonly equipSetInfo!: EquipSet | null
  @Prop({default: false}) readonly dirty!: boolean

  @Watch('dirty')
  @Watch('equipSetInfo',{ immediate:true,deep:true})
  equipSetInfoChanged()
  {
    console.log("changed");
    this.calculatedInfo = [];
      if(this.equipSetInfo == null)
      {
        return;
      }

    for (let slotName in this.equipSetInfo)
    {
      if (Object.prototype.hasOwnProperty.call(this.equipSetInfo, slotName))
      {
        let slot:Equipment = this.equipSetInfo[slotName];
        let props = this.getPropertiesArray(slot);
        for(let prop of props)
        {
          let added = false;
          let nameWithUnit = prop.valueUnit?prop.name + "(" + prop.valueUnit + ")" : prop.name;
          for(let info of this.calculatedInfo)
          {

            if(info.NameWithUnit == nameWithUnit && info.HasValue == prop.hasValue) {
              if (prop.hasValue && prop.value !== undefined) {
                if(info.WithoutSubValue !== undefined  && slotName !== "Sub") info.WithoutSubValue += prop.value;
                if (info.TotalValue !== undefined) {
                  info.TotalValue += prop.value;
                }
              }
              added = true;
              break;
            }
          }
          if(!added){
            this.calculatedInfo.push({
              NameWithUnit:nameWithUnit,
              HasValue:prop.hasValue,
              TotalValue: prop.hasValue? prop.value:undefined,
              WithoutSubValue: prop.hasValue && slotName !== "Sub"? prop.value : undefined
            });
          }
        }


      }
    }
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

}

interface CalculatedInfo{
  NameWithUnit:string,
  HasValue:boolean,
  TotalValue?:number,
  WithoutSubValue?:number

}

</script>

<style scoped>

</style>