<template>
  <div>
    <v-list-item :value="source" class="align-center" two-line>
      <v-list-item-content>
        <v-list-item-title class="align-center">
          <v-row>
          <v-col cols="2">
            <v-img aspect-ratio="1" contain :alt="itemName" :src="iconUrl" max-height="32px"></v-img>
          </v-col>
          <v-col cols="10" class="pl-0">
            <v-row class="align-center pb-1" no-gutters
            >{{ itemName }}
              <v-chip
                  v-show="itemTypeName"
                  class="ml-2 mr-1"
                  color="black"
                  label
                  text-color="white"
                  x-small
              >
                {{ itemTypeName }}
              </v-chip>
            </v-row>
            <v-row class="align-center pb-1" no-gutters>
              <v-chip
                  v-if="isRare"
                  class="mr-1"
                  color="yellow darken-3"
                  label
                  text-color="white"
                  x-small
              >Rare
              </v-chip>
              <v-chip
                  v-if="isEx"
                  class="mr-1"
                  color="green"
                  label
                  text-color="white"
                  x-small
              >Ex
              </v-chip>
              <v-chip class="mr-1" color="pink" label text-color="white" x-small
              >{{ "Lv." + source.Level }}
              </v-chip>
              <v-chip
                  v-if="source.ItemLevel !== undefined"
                  class="mr-1"
                  color="purple"
                  label
                  text-color="white"
                  x-small
              >{{ "IL." + source.ItemLevel }}
              </v-chip>
              <v-chip
                  v-if="source.SuLevel !== undefined"
                  class="mr-1"
                  color="blue"
                  label
                  text-color="white"
                  x-small
              >{{ "Su" + source.SuLevel }}
              </v-chip>
            </v-row>
          </v-col>
          </v-row>
        </v-list-item-title>
        <v-list-item-subtitle class="text-wrap">
          <text-highlight :queries="highlightArray" :wholeWordMatch="true"
          >{{ itemDescription }}
          </text-highlight>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-chip
              :href="
              'http://wiki.ffo.jp/search.cgi?CCC=%E6%84%9B&Command=Search&qf=' +
              encodeURI(source.Jp.replace('+', '&2b')) +
              '&order=match&ffotype=title&type=title'
            "
              class="mr-1"
              color="orange lighten-1"
              label
              outlined
              target="_blank"
              x-small
          >
            <v-icon left x-small> mdi-link-variant</v-icon>
            FFO
          </v-chip>
          <v-chip
              :href="
              'https://www.bg-wiki.com/ffxi/' +
              source.En.replace('\'', '.').replace(' ', '_')
            "
              class="mr-1"
              color="brown lighten-1"
              label
              outlined
              target="_blank"
              x-small
          >
            <v-icon left x-small> mdi-link-variant</v-icon>
            BG
          </v-chip>
          <v-chip
              :href="'https://www.ffxiah.com/item/' + source.Id"
              class="mr-1"
              color="blue lighten-1"
              label
              outlined
              target="_blank"
              x-small
          >
            <v-icon left x-small> mdi-link-variant</v-icon>
            AH
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon class="pr-0 mr-3">
        <v-row no-gutters style="width: 100%;height:100%">
        <v-btn
            class="mt-2"
            color="blue lighten-2"
            dark
            elevation="1"
            fab
            small
            v-on:click="onSelectItem"
        >⇒
        </v-btn>
        </v-row>
      </v-list-item-icon>
    </v-list-item>
    <v-divider/>
  </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import scrollerUtils from "@/mixins/scrollerUtils";
import {Equipment, Limiter} from "@/@types/equip-set";
import xiUtils from "@/mixins/xiutils";

@Component
export default class EquipmentListItem extends Mixins(scrollerUtils, xiUtils) {
  @Prop() readonly index!: number;
  @Prop() readonly source!: Equipment;
  @Prop() readonly limiters!: Limiter[];
  @Prop() readonly propDict!: Map<string,string[]>;
  @Prop() readonly cateDict!: Map<string,string[]>;

  get isRare(): boolean {
    return this.source.Flags == undefined
        ? false
        : this.IsRare(this.source.Flags);
  }

  get iconUrl(): string{
    return this.getItemIconUrl(this.source.Id);
  }

  get isEx(): boolean {
    return this.source.Flags !== undefined && this.IsEx(this.source.Flags);
  }

  get itemTypeName(): string | null {
    const locale = this.getItemTypeName(this.source, this.$root.$i18n.locale);
    return locale == null ? null : this.$t(locale) as string;
  }

  get itemName(): string{
    if(this.$root.$i18n.locale == "ja")
    {
      return this.source.JpFull;
    }
    else
    {
      return this.source.En;
    }
  }

  get itemDescription(): string | null {
    if(this.$root.$i18n.locale == "ja")
    {
      return this.source.JpDescription ?? null;
    }
    else
    {
      return this.source.EnDescription ?? null;
    }
  }

  get highlightArray() {
    let result = [];
    const lang = this.$i18n.locale;
    for (let limiter of this.limiters) {
      if (limiter.propertyID != null && limiter.isActive) {
        if (limiter.isProp) {
          //console.log(this.propDict);
          const propData = this.propDict.get(limiter.propertyID.toString());
          if(propData == undefined)
          {
            continue;
          }
          let propName = propData[lang == "ja" ? 0 : 1];
          if (propName == undefined)
          {
            continue;
          }
          let propNameMatches = propName.match(/[:：](.+)/);
          if (propNameMatches != null && propNameMatches.length > 1) {
            propName = propNameMatches[1];
          }
          result.push(
              new RegExp("(^|[ \n\b:：])" + propName + "(?=[\n +\\-\b0-9])", "i")
          );
        }
        if (limiter.isText) {
          let propName = limiter.text;
          result.push(propName);
        }
      }
    }
    return result;
  }

  public onSelectItem() {
    this.dispatch("EquipmentList", "select", this.source);
  }
}
</script>

<style scoped></style>
