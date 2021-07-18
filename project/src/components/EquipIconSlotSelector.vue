<template>
  <v-item-group v-model="listSelectedSlot" key="Equip.Id" active-class="highlighted">
    <v-row no-gutters>
      <!-- ROW 1 -->
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[0].index"
            @clearSlot="clearSlot(slotItemsArray[0].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[1].index"
            @clearSlot="clearSlot(slotItemsArray[1].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[2].index"
            @clearSlot="clearSlot(slotItemsArray[2].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[3].index"
            @clearSlot="clearSlot(slotItemsArray[3].index)"
        />
      </v-col>
    </v-row>
    <!-- ROW 2 -->
    <v-row no-gutters>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[4].index"
            @clearSlot="clearSlot(slotItemsArray[4].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[9].index"
            @clearSlot="clearSlot(slotItemsArray[9].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[11].index"
            @clearSlot="clearSlot(slotItemsArray[11].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[12].index"
            @clearSlot="clearSlot(slotItemsArray[12].index)"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <!-- ROW 3 -->
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[5].index"
            @clearSlot="clearSlot(slotItemsArray[5].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[6].index"
            @clearSlot="clearSlot(slotItemsArray[6].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[13].index"
            @clearSlot="clearSlot(slotItemsArray[13].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[14].index"
            @clearSlot="clearSlot(slotItemsArray[14].index)"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <!-- ROW 4 -->
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[15].index"
            @clearSlot="clearSlot(slotItemsArray[15].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[10].index"
            @clearSlot="clearSlot(slotItemsArray[10].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[7].index"
            @clearSlot="clearSlot(slotItemsArray[7].index)"
        />
      </v-col>
      <v-col cols="3">
        <equip-icon-slot
            :dirty="dirtyFlag"
            :items="editEquipSet"
            :index-name="slotItemsArray[8].index"
            @clearSlot="clearSlot(slotItemsArray[8].index)"
        />
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script lang="ts">
import xiUtils from "@/mixins/xiutils";
import {Component, Mixins, Prop} from "vue-property-decorator";
import {Equipment, EquipSet} from "@/@types/equip-set";
import EquipIconSlot from "@/components/EquipIconSlot.vue";
@Component({
  components: {EquipIconSlot}
})
export default class EquipIconSlotSelector extends Mixins(xiUtils) {
  name = "EquipIconSlotSelector";
  @Prop() readonly selectedSlot!: string;
  @Prop() readonly editEquipSet!: EquipSet;
  @Prop() readonly dirtyFlag!: boolean;

  get  listSelectedSlot(): string {
    return this.selectedSlot;
  }

  set  listSelectedSlot(val: string) {
    this.$emit('input', val);
  }

  public clearSlot(val:string)
  {
    this.$emit('clear', val);
  }

}

</script>

<style scoped>
.highlighted{
  border-width: 2px;
}
</style>
