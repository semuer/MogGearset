<template>
  <v-container style="height: 100%;display:flex;flex-flow:column;width:100%">
    <v-sheet tile outlined style="width: 100%;flex: 1 1 auto;" class="pa-0 ma-0 pb-1" elevation="1" rounded>
      <v-row class="align-center" no-gutters style="width: 100%;">
        <v-checkbox
            v-model="isLevel99"
            label="Lv99"
            hide-details
            class="ml-2 mr-2"
        ></v-checkbox>
        <v-checkbox
            v-show="slotHasItemLevel"
            v-model="isItemLevel119"
            label="IL119"
            hide-details
        ></v-checkbox>
        <v-text-field class="pt-3 pl-2 pr-3" clearable label="名前" v-model="nameFilter" @click:clear="nameFilterCleared"
                      outlined hide-details dense></v-text-field>
      </v-row>

      <v-row class="pb-1 pt-2 justify-space-around align-center" no-gutters>
        <v-btn v-on:click="addLimiter" class="pr-2" dense small elevation="1" color="blue lighten-3">+性能一致</v-btn>
        <v-btn v-on:click="addTextLimiter" class="pr-2" dense small elevation="1" color="purple lighten-3">+文書検索</v-btn>
        <v-btn v-on:click="addSorter" class="" dense small elevation="1" color="orange lighten-3">+並べ替え</v-btn>
      </v-row>
      <equipment-property-limit-unit
          class="pl-0 pr-3 pt-1 pb-1 ma-2"
          :limiters="limiters"
          :props-array="propsArray"
          @delete="deleteLimiter"
          @valueChanged="limiterChanged"
          @activeChanged="limiterActiveChanged"
          @sortOrderChanged=""
      />
    </v-sheet>
     <v-list-item-group
            class="fill-height" style="width:100%;min-height:100px;flex: 0 1 auto;">
          <virtual-list style="overflow-y: auto;"
                        class="fill-height"
                        ref="v-scroller"
                        :data-key="'Id'"
                        :data-sources="equipData"
                        :data-component="itemComponent"
                        :extra-props="{limiters:limiters}"
                        :estimate-size=35></virtual-list>
        </v-list-item-group>

  </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Prop, Watch} from 'vue-property-decorator'
import {Equipment, Limiter} from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";
import EquipmentPropertyLimitUnit from "@/components/EquipmentPropertyLimitUnit.vue";
import TextHighlight from "vue-text-highlight"
import VirtualList from 'vue-virtual-scroll-list'
import EquipmentListItem from '@/components/EquipmentListItem.vue'

@Component({
  components: {
    EquipmentPropertyLimitUnit,
    TextHighlight,
    VirtualList,
    EquipmentListItem
  },
  name: "EquipmentList"
})
export default class EquipmentList extends Mixins(xiUtils) {
  selectedItem: number = 1;
  limiters: Array<Limiter> = [];
  isLevel99: boolean = false;
  isItemLevel119: boolean = false;
  nameFilter: string = "";

  itemComponent = EquipmentListItem;

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
      if (this.isItemLevel119 && this.slotHasItemLevel) {
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
          if (!this.limiters[i].isActive) {
            continue;
          }

          if(this.limiters[i].isProp){
            let testPropName = this.limiters[i].property;
            if (testPropName === null || testPropName === "") {
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
                if (funcFull2Half(prop.name.toLowerCase()) == funcFull2Half((testPropName as string).toLowerCase())) {
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
          else if(this.limiters[i].isText)
          {
            let testPropName = this.limiters[i].property;
            if (testPropName === null || testPropName === "") {
              continue;
            }
            chain = chain.where(function (obj: Equipment){

              return (obj.JpDescription !== undefined && obj.JpDescription !== null) ? obj.JpDescription.includes(testPropName as string) : false;
            });
          }
        }
      }

      this.equipData = Object.freeze(chain.data());
    }
    let list = this.$refs["v-scroller"]  as InstanceType<typeof VirtualList>;
    list.scrollToOffset(0);
  }


  public addLimiter(): void {
    this.limiters.push({
      index: Date.now(),
      property: "",
      minValue: 0,
      isActive: true,
      isSort: false,
      isText: false,
      isProp: true,
      isAsc: false,
    });
  }

  public addTextLimiter(): void {
    this.limiters.push({
      index: Date.now(),
      property: "",
      minValue: 0,
      isActive: true,
      isSort: false,
      isText: true,
      isProp: false,
      isAsc: false,
    });
  }

  public addSorter():void{
    this.limiters.push({
      index: Date.now(),
      property: "",
      minValue: 0,
      isActive: true,
      isSort: true,
      isText: false,
      isProp: false,
      isAsc: false
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

  public sortOrderChanged(obj: Record<string, any>): void {
    if (obj["index"] != undefined) {
      for (let limiter of this.limiters) {
        if (limiter.index == obj["index"]) {
          limiter.isAsc = obj["isAsc"];
          this.queryChanged();
        }
      }
    }
  }

  created(){
    // this.$on('select', (item:Equipment) => {
    //   console.log("emit1")
    //   this.$emit('select',item);
    // })
  }
}


</script>

<style scoped>

</style>
