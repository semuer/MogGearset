<template>
  <v-app>

    <v-app-bar
        app
        color="primary"
        dark
        clipped-left
    >
      <v-toolbar-title>XI EquipSet Simulator</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon href="https://github.com/semuer/XIUtilsEquipCalculator">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="height: 100vh;width:100%">

      <v-navigation-drawer left permanent app clipped :width="navigationWidth" class="fill-height">
        <equipment-list :equip-query-chain="equipQueryChain" v-on:select="equipItem" class="fill-height pa-0 ma-0"
                        style="width:100%;"/>
      </v-navigation-drawer>
      <v-container fluid class="grey lighten-5 pa-4">
        <v-row class="ma-0 pa-0 pr-1">
          <job-selector v-model="selectedJob"/>
        </v-row>
        <v-row class="ml-0">
          <v-col cols="4" class="pl-0">
            <v-card>
              <v-list-item-group
                  v-model="selectedSlot"
              >
                <equip-slot-selector label-name="Main" :item="editEquipSet.Main" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Sub" :item="editEquipSet.Sub" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Range" :item="editEquipSet.Range" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Ammo" :item="editEquipSet.Ammo" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Head" :item="editEquipSet.Head" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Neck" :item="editEquipSet.Neck" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="L.Earring" :item="editEquipSet['L.Earring']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="R.Earring" :item="editEquipSet['R.Earring']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Body" :item="editEquipSet['Body']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Hands" :item="editEquipSet['Hands']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="L.Ring" :item="editEquipSet['L.Ring']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="R.Ring" :item="editEquipSet['R.Ring']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Cape" :item="editEquipSet['Cape']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Waist" :item="editEquipSet['Waist']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Legs" :item="editEquipSet['Legs']" :dirty="dirtyFlag"/>
                <equip-slot-selector label-name="Feet" :item="editEquipSet['Feet']" :dirty="dirtyFlag"/>
              </v-list-item-group>
            </v-card>
          </v-col>
          <v-col
              cols="8"
              class="pr-4"
          >
            <equip-set-performance-view :equip-set-info="editEquipSet" :dirty="dirtyFlag"/>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
 import {Component, Vue, Watch} from 'vue-property-decorator'
 import EquipmentList from "@/components/EquipmentList.vue";
 //import equipData from '../public/json/parseddata.json';
 import JobSelector from "./components/JobSelector.vue";
 import EquipSlotSelector from "./components/EquipSlotSelector.vue";
 import EquipSetPerformanceView from "@/components/EquipSetPerformanceView.vue";
 import {Equipment, EquipSet} from './@types/equip-set'
 import {Collection} from 'lokijs'
 import loki from 'lokijs'

@Component({
  components: {
    EquipmentList,
    JobSelector,
    EquipSlotSelector,
    EquipSetPerformanceView
  }
})
export default class App extends Vue {
  // data
  rawEquipsData: Equipment[] = []
  db = new loki("data.db");
  selectedJob: string = "MNK";
  selectedSlot: string = "Ammo";
  //filteredEquips:Equipment[] = [];
  equipCollection: Collection<Equipment> | null = null;
  editEquipSet: EquipSet = {};
  dirtyFlag: Boolean = false;
  equipQueryChain: Object | null = null;
  navigationWidth: number = 0;

  public onJobChanged(): void {
    return;
  }

  public equipItem(item: Equipment): void {
    if (this.selectedSlot != null) {
      this.editEquipSet[this.selectedSlot] = item;
      this.dirtyFlag = !this.dirtyFlag;
    }
  }

  @Watch('selectedJob')
  selectedJobChanged() {

  }

  @Watch('selectedSlot')
  selectedSlotChanged(newSlot: string,) {
    let query: any = {};
    query["Is" + this.selectedJob] = true;
    //query["ItemLevel"] = 119;
    //console.log(query);
    if (newSlot == "" || newSlot == null || newSlot == undefined) {
      this.equipQueryChain = null;
      this.navigationWidth = 0;
      return;
    }
    this.navigationWidth = 450;
    let slotToIdDict: Record<string, number> = {
      Main: 0,
      Sub: 1,
      Range: 2,
      Ammo: 3,
      Head: 4,
      Body: 5,
      Hands: 6,
      Legs: 7,
      Feet: 8,
      Neck: 9,
      Waist: 10,
      "L.Earring": 11,
      "R.Earring": 12,
      "L.Ring": 13,
      "R.Ring": 14,
      Cape: 15
    }

    let newsSlotFlags: number = slotToIdDict[newSlot];
    //console.log(newsSlotFlags);
    if (this.equipCollection != null) {
      this.equipQueryChain = this.equipCollection.chain().find(query).where(function (obj: Equipment) {
        let slotFlags: number = obj.Slots ?? 0;
        return (slotFlags & (1 << newsSlotFlags)) != 0;
      });
    } else {
      this.equipQueryChain = null;
    }

  }

  created() {
    let ec = this.db.getCollection<Equipment>("equip");
    if (ec == null) {
      ec = this.db.addCollection<Equipment>("equip");
    }

    this.equipCollection = ec;
    if (this.equipCollection == null) {
      console.log("Collection Creating Error.")
      return;
    }

    fetch(process.env.BASE_URL + 'json/parseddata.json')
        .then(response => response.json())
        .then(data => {

          this.rawEquipsData = data;
          let equips = this.rawEquipsData;
          equips.forEach(function (item) {
            ec.insert(
                item
            );
          });

          this.equipQueryChain = null;
          this.selectedJob = "MNK";
          this.editEquipSet = {};
        })


  }
}

</script>
