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
            v-show="slotHasItemLevel"
            v-model="isItemLevel119"
            label="IL119"
            hide-details
        ></v-checkbox>
        <v-text-field class="pt-2 pl-2" clearable label="名前" v-model="nameFilter" @click:clear="nameFilterCleared" outlined hide-details dense></v-text-field>
      </v-row>

      <v-row class="pl-4 ml-0 pb-1">
        <v-btn v-on:click="addLimiter" dense small elevation="1" color="blue lighten-3">フィルター追加</v-btn>
      </v-row>
      <equipment-property-limit-unit
          class="pl-1 pr-1 pt-1 pb-1 ma-2"
          :limiters="limiters"
          :props-array="propsArray"
          @delete="deleteLimiter"
          @valueChanged="limiterChanged"
          @activeChanged="limiterActiveChanged"
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
                <v-list-item-title>{{item['JpFull']}}
                  <v-chip small label color="pink" text-color="white">{{"Lv."+item['Level']}}</v-chip>
                  <v-chip v-if="item['ItemLevel'] != undefined" small label color="purple" text-color="white">{{"IL."+item['ItemLevel']}}</v-chip>
                  <v-chip v-if="item['SuLevel'] != undefined" small label color="blue" text-color="white">{{"Su"+item['SuLevel']}}</v-chip>
                </v-list-item-title>
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
import {Component, Mixins, Prop, Watch} from 'vue-property-decorator'
import {Equipment, Limiter} from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";
import EquipmentPropertyLimitUnit from "@/components/EquipmentPropertyLimitUnit.vue";
import TextHighlight from "vue-text-highlight"

@Component({
  components: {
    EquipmentPropertyLimitUnit,
    TextHighlight
  }
})
export default class EquipmentList extends Mixins(xiUtils) {
  selectedItem: number = 1;
  limiters: Array<Limiter> = [];
  isLevel99: boolean = false;
  isItemLevel119: boolean = false;
  nameFilter: string = "";

  @Prop({default: ""}) readonly equipSlot: string | undefined;

  @Prop({default: null}) readonly equipQueryChain!: any;
  @Prop() readonly propsArray!: string[];

  equipData: Equipment[] = [];

  nonILSlots: string[] = ["Cape", "Neck", "Waist", "L.Earring", "R.Earring", "L.Ring", "R.Ring"];

  get slotHasItemLevel(): boolean {
    if (this.equipSlot != undefined && this.nonILSlots.includes(this.equipSlot)) {
      return false;
    }
    return true;
  }

  get highlightArray(): RegExp[] {
    let result: RegExp[] = [];
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

  public nameFilterCleared() {
    this.nameFilter = "";
  }


  @Watch('equipQueryChain')
  @Watch('isLevel99')
  @Watch('isItemLevel119')
  @Watch('limiters')
  @Watch('nameFilter')
  queryChanged() {
    if (this.equipQueryChain != null) {
      let chain = this.equipQueryChain.copy();
      let query: Record<string, any> = {};

      if (this.isLevel99) {
        query["Level"] = 99;
      }
      if (this.isItemLevel119 && this.slotHasItemLevel === true) {
        query["ItemLevel"] = 119;
      }
      if (Object.keys(query).length !== 0) {
        chain = chain.find(query);
      }

      let nameFilter = this.nameFilter;
      if (nameFilter !== "") {
        nameFilter = this.kataToHira(this.fullWidthStrToHalfWidthStr(nameFilter));
        let funcKataHira = this.kataToHira;
        let funcFullTohalf = this.fullWidthStrToHalfWidthStr;
        chain = chain.where(function (obj: Equipment) {
          let isPassed = false;
          if (funcKataHira(funcFullTohalf(obj.Jp.toLowerCase())).includes(nameFilter)) {
            isPassed = true;
          } else if (funcKataHira(funcFullTohalf(obj.JpFull.toLowerCase())).includes(nameFilter)) {
            isPassed = true;
          } else if (obj.En.toLowerCase().includes(nameFilter)) {
            isPassed = true;
          } else if (obj.EnFull.toLowerCase().includes(nameFilter)) {
            isPassed = true;
          }

          return isPassed;
        });
      }

      if (this.limiters.length !== 0) {
        for (let i = 0; i < this.limiters.length; i++) {
          if (this.limiters[i].isActive === false) {
            continue;
          }

          let testPropName = this.limiters[i].property;
          if (testPropName === "") {
            continue;
          }
          let min = this.limiters[i].minValue;
          let funcGetProps = this.getPropertiesArray;
          let funcFull2Half = this.fullWidthStrToHalfWidthStr;
          chain = chain.where(function (obj: Equipment) {
            let props = funcGetProps(obj);
            let testPassed = false;

            // match test
            for (let prop of props) {
              if (funcFull2Half(prop.name.toLowerCase()) == funcFull2Half(testPropName.toLowerCase())) {
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

      this.equipData = Object.freeze(chain.data());
    }
  }


  public addLimiter(): void {
    this.limiters.push({
      index: Date.now(),
      property: "",
      minValue: 0,
      isActive: true,
      isSort: false,
    });
  }

  public deleteLimiter(index: number): void {
    for (let i = 0; i < this.limiters.length; i++) {
      if (this.limiters[i].index == index) {
        this.limiters.splice(i, 1);
      }
    }

  }

  public limiterChanged(obj: Record<string, any>): void {
    if (obj["index"] != undefined) {
      for (let limiter of this.limiters) {
        if (limiter.index == obj["index"]) {
          if (obj["property"] != undefined) {
            limiter.property = obj["property"].replace("：", ":");
          }
          if (obj["minValue"] != undefined) {
            limiter.minValue = obj["minValue"];
          }
          this.queryChanged();
        }
      }
    }
  }

  public limiterActiveChanged(obj: Record<string, any>): void {
    if (obj["index"] != undefined) {
      for (let limiter of this.limiters) {
        if (limiter.index == obj["index"]) {
          limiter.isActive = obj["isActive"];
          this.queryChanged();
        }
      }
    }
  }
}



</script>

<style scoped>

</style>
