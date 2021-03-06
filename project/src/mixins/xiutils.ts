import { Component, Vue } from "vue-property-decorator";
import {
  AugProperty,
  Equipment,
  PropertyInfo,
  AugSet,
  CalculatedAugInfo,
  EquipmentWithAug,
} from "@/@types/equip-set";

@Component
export default class xiUtils extends Vue {
  get slotNames(): Record<string, string> {
    return {
      Main: "Main",
      Sub: "Sub",
      Range: "Range",
      Ammo: "Ammo",
      Head: "Head",
      Body: "Body",
      Hands: "Hands",
      Legs: "Legs",
      Feet: "Feet",
      Neck: "Neck",
      Waist: "Waist",
      LEarring: "LEarring",
      REarring: "REarring",
      LRing: "LRing",
      RRing: "RRing",
      Cape: "Cape",
    };
  }

  get slotItemsArray(): Array<SlotStringPair> {
    return [
      { index: "Main", label: "メイン" }, // 0
      { index: "Sub", label: "サブ" }, // 1
      { index: "Range", label: "遠隔" }, // 2
      { index: "Ammo", label: "弾" }, // 3
      { index: "Head", label: "頭" }, // 4
      { index: "Body", label: "胴" }, // 5
      { index: "Hands", label: "手" }, // 6
      { index: "Legs", label: "脚" }, // 7
      { index: "Feet", label: "足" }, // 8
      { index: "Neck", label: "首" }, // 9
      { index: "Waist", label: "腰" }, // 10
      { index: "LEarring", label: "左耳" }, //11
      { index: "REarring", label: "右耳" }, //12
      { index: "LRing", label: "左指" }, //13
      { index: "RRing", label: "右指" }, //14
      { index: "Cape", label: "背" }, //15
    ];
  }

  public getPropertyValue(
    item: Equipment,
    property: number | undefined,
    category: number | undefined | null,
    calUnity: boolean,
    calMaxAug: boolean
  ): number | undefined {
    const props = item.Properties;
    if (props == undefined) {
      return undefined;
    }
    let result = undefined;
    for (const prop of props) {
      if (property === prop.PropID) {
        if (
          (category == undefined && prop.CatID == undefined) ||
          category === prop.CatID
        ) {
          if (prop.Value == undefined) {
            result = result == null ? 0 : result;
          } else {
            result = result == null ? prop.Value : result + prop.Value;
          }
        } else if (calUnity) {
          if (
            (category == null && prop.CatID == 13) ||
            (category == 8 && prop.CatID == 195)
          ) {
            if (prop.Value == undefined) {
              result = result == null ? 0 : result;
            } else {
              result = result == null ? prop.Value : result + prop.Value;
            }
          }
        }
      }
    }

    // Augs
    if (calMaxAug) {
      let routeMax = 0;
      // Calculate All Routes Total
      let testPassed = false;
      if (item.AugCape != undefined) {
        for (const augs of item.AugCape) {
          for (const aug of augs.Augs) {
            for (const augProp of aug.PropIDs) {
              if (
                property == augProp &&
                ((category == null && aug.CatID == null) ||
                  category == aug.CatID)
              ) {
                if (aug.Value == undefined) {
                  result = result == null ? 0 : result;
                } else {
                  result = result == null ? aug.Value : result + aug.Value;
                }
                testPassed = true;
                break;
              }
            }
            if (testPassed) break;
          }
          if (testPassed) break;
        }
      }

      // Calculate All Routes Total
      else if (item.AugFixed != undefined) {
        for (const aug of item.AugFixed.Augs) {
          for (const augProp of aug.PropIDs) {
            if (
              property == augProp &&
              ((category == null && aug.CatID == null) || category == aug.CatID)
            ) {
              if (aug.Value == undefined) {
                result = result == null ? 0 : result;
              } else {
                result = result == null ? aug.Value : result + aug.Value;
              }
              testPassed = true;
              break;
            }
          }
          if (testPassed) break;
        }
      }

      // Calculate Max Route Value
      else if (item.AugRoute != undefined) {
        for (const augs of item.AugRoute) {
          for (const aug of augs.Augs) {
            for (const augProp of aug.PropIDs) {
              if (
                property == augProp &&
                ((category == null && aug.CatID == null) ||
                  category == aug.CatID)
              ) {
                const value = aug.Value == undefined ? 0 : aug.Value;
                if (Math.abs(value) >= Math.abs(routeMax)) {
                  testPassed = true;
                  routeMax = value;
                }
                break;
              }
            }
          }
        }
      }
      result = result == null ? routeMax : result + routeMax;
    }

    return result;
  }

  public getSinglePropString(
    locale: string,
    cateID: number | undefined,
    propID: number,
    isMainHand: boolean,
    propDict: Map<string, string[]>,
    catDict: Map<string, string[]>
  ): string {
    let result = "";
    const loci = locale == "ja" ? 0 : 1;
    if (isMainHand) {
      result += this.$t("ui.item.mainhand") + ":";
    }
    if (cateID != null) {
      const cat = catDict.get(cateID.toString());
      if (cat != null) {
        result += cat[loci] + ":";
      }
    }

    const rProp = propDict.get(propID.toString());
    result += rProp == null ? "" : rProp[loci];
    return result;
  }

  public getAugString(
    locale: string,
    data: AugProperty,
    propDict: Map<string, string[]>,
    catDict: Map<string, string[]>
  ): string | undefined {
    let result = "";
    const loci = locale == "ja" ? 0 : 1;
    let catString = "";
    if (data.PropIDs == null) {
      return result;
    }

    if (data.MainHand === true) {
      result += this.$t("ui.item.mainhand") + ":";
    }

    if (data.CatID != null) {
      const cat = catDict.get(data.CatID.toString());
      if (cat != null) {
        catString += cat[loci] + ":";
      }
    }

    let valueString = "";
    if (data.Value != null) {
      valueString =
        (data.Value > 0 ? "+" : "") + data.Value.toString() + (data.Unit ?? "");
    }

    for (const prop of data.PropIDs) {
      const rProp = propDict.get(prop.toString());
      if (rProp != null) {
        result += catString + rProp[loci] + valueString + " ";
      }
    }

    return result.trim();
  }

  public getCalculatedAugString(
    locale: string,
    data: CalculatedAugInfo,
    propDict: Map<string, string[]>,
    catDict: Map<string, string[]>
  ): string | undefined {
    let result = "";
    const loci = locale == "ja" ? 0 : 1;
    let catString = "";

    if (data.MainHand === true) {
      result += this.$t("ui.item.mainhand") + ":";
    }

    if (data.CateID != null) {
      const cat = catDict.get(data.CateID.toString());
      if (cat != null) {
        catString += cat[loci] + ":";
      }
    }

    let valueString = "";
    if (data.Value != null) {
      valueString =
        (data.Value > 0 ? "+" : "") + data.Value.toString() + (data.Unit ?? "");
    }

    const rProp = propDict.get(data.PropID.toString());
    if (rProp != null) {
      result += catString + rProp[loci] + valueString;
    }

    return result;
  }

  public getAugStringForSearch(
    data: AugSet[],
    propDict: Map<string, string[]>,
    catDict: Map<string, string[]>
  ): string {
    let result = "";
    for (const augset of data) {
      for (const aug of augset.Augs) {
        if (aug.PropIDs == null) {
          continue;
        }
        if (aug.CatID != null) {
          const cat = catDict.get(aug.CatID.toString());
          if (cat != null) {
            result += cat[0] + cat[1];
          }
        }

        for (const prop of aug.PropIDs) {
          const rProp = propDict.get(prop.toString());
          if (rProp != null) {
            result += rProp[0] + rProp[1];
          }
        }
      }
    }
    return result;
  }

  public jobList(): Record<string, string>[] {
    return [
      { abb: "WAR", name: this.$t("ui.job.WAR").toString() },
      { abb: "MNK", name: this.$t("ui.job.MNK").toString() },
      { abb: "WHM", name: this.$t("ui.job.WHM").toString() },
      { abb: "BLM", name: this.$t("ui.job.BLM").toString() },
      { abb: "RDM", name: this.$t("ui.job.RDM").toString() },
      { abb: "THF", name: this.$t("ui.job.THF").toString() },
      { abb: "PLD", name: this.$t("ui.job.PLD").toString() },
      { abb: "DRK", name: this.$t("ui.job.DRK").toString() },
      { abb: "BST", name: this.$t("ui.job.BST").toString() },
      { abb: "BRD", name: this.$t("ui.job.BRD").toString() },
      { abb: "RNG", name: this.$t("ui.job.RNG").toString() },
      { abb: "SAM", name: this.$t("ui.job.SAM").toString() },
      { abb: "NIN", name: this.$t("ui.job.NIN").toString() },
      { abb: "DRG", name: this.$t("ui.job.DRG").toString() },
      { abb: "SMN", name: this.$t("ui.job.SMN").toString() },
      { abb: "BLU", name: this.$t("ui.job.BLU").toString() },
      { abb: "COR", name: this.$t("ui.job.COR").toString() },
      { abb: "PUP", name: this.$t("ui.job.PUP").toString() },
      { abb: "DNC", name: this.$t("ui.job.DNC").toString() },
      { abb: "SCH", name: this.$t("ui.job.SCH").toString() },
      { abb: "GEO", name: this.$t("ui.job.GEO").toString() },
      { abb: "RUN", name: this.$t("ui.job.RUN").toString() },
    ];
  }

  public getPropertiesArray(item: Equipment): PropertyInfo[] {
    const resultInfo: PropertyInfo[] = [];

    if (item.JpDescription == null || item.JpDescription.trim() === "") {
      return resultInfo;
    }

    const props = item.JpDescription.split(/[ \n]/).filter((i) => i);
    const propRegex =
      /(?<name>[^\d%～~+-]+)(?<value>[\d%～~+-]+)?(?<suffix>[^ \n]+)?$/i;

    let prefix = "";
    for (const prop of props) {
      const result = prop.match(propRegex);
      if (result == null) {
        console.log("Cannot parse prop:" + prop);
        continue;
      }
      if (result.groups == undefined) {
        console.log("Cannot parse prop:" + prop);
        continue;
      }

      let resultName =
        result.groups["suffix"] == undefined
          ? result.groups["name"]
          : result.groups["name"] + result.groups["suffix"];
      if (resultName == null) {
        continue;
      }
      if (resultName.includes(":") || resultName.includes("：")) {
        const matches = resultName.match(/.+(?=[:：])/);
        if (matches != null && matches.length !== 0) {
          prefix = matches[0];
        }

        const propNameMatches = resultName.match(/[:：](.+)/);
        if (propNameMatches != null && propNameMatches.length > 1) {
          resultName = propNameMatches[1];
        }
      }

      const valueResult = result.groups["value"];

      let value = NaN;

      // e.g. ABC:0~5% / ABC:0~5
      if (
        valueResult != null &&
        (valueResult.includes("~") || valueResult.includes("～"))
      ) {
        const normalizedValue = valueResult.replace("～", "~");
        const match = normalizedValue.match(/~(?<num>\d+)/);
        if (match != null && match.groups != undefined) {
          value = parseInt(match.groups["num"]);
        } else {
          console.log("parse prop error." + prop);
        }
      } else {
        value = parseInt(valueResult);
      }

      let hasValue = true;
      if (isNaN(value)) {
        hasValue = false;
      }
      let resultValue: number | undefined = undefined;
      let valueUnit: string | undefined = undefined;
      if (hasValue) {
        resultValue = value;
        valueUnit = valueResult.replace(/[~～\-+0-9]/g, "");
      }

      resultInfo.push({
        name: prefix === "" ? resultName : prefix + ":" + resultName,
        hasValue: hasValue,
        valueUnit: valueUnit,
        value: resultValue,
      });
    }

    return resultInfo;
  }

  public kataToHira(text: string | null): string {
    if (text === null) {
      return "";
    }
    return text.replace(/[\u30a1-\u30f6]/g, function (match) {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }

  public hiraToKata(text: string | null): string {
    if (text === null) {
      return "";
    }
    return text.replace(/[\u3041-\u3096]/g, function (match) {
      const chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }

  public fullWidthStrToHalfWidthStr(text: string | null): string {
    if (text === null) {
      return "";
    }
    return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (match) {
      return String.fromCharCode(match.charCodeAt(0) - 0xfee0);
    });
  }

  public IsRare(flag: number) {
    return (flag & (1 << 15)) !== 0;
  }

  public IsEx(flag: number) {
    return (flag & (1 << 14)) !== 0;
  }

  public isTwoHandWeapon(item: Equipment): boolean {
    const type = this.getItemTypeName(item);
    if (
      type == "item.itemType.h2h" ||
      type == "item.itemType.greatsword" ||
      type == "item.itemType.greataxe" ||
      type == "item.itemType.scythe" ||
      type == "item.itemType.polearm" ||
      type == "item.itemType.greatkatana" ||
      type == "item.itemType.staff"
    ) {
      return true;
    }
    return false;
  }

  public getMainHandTypeList() {
    return [
      { value: "item.itemType.h2h", text: this.$t("item.itemType.h2h") },
      { value: "item.itemType.dagger", text: this.$t("item.itemType.dagger") },
      { value: "item.itemType.sword", text: this.$t("item.itemType.sword") },
      {
        value: "item.itemType.greatsword",
        text: this.$t("item.itemType.greatsword"),
      },
      { value: "item.itemType.axe", text: this.$t("item.itemType.axe") },
      {
        value: "item.itemType.greataxe",
        text: this.$t("item.itemType.greataxe"),
      },
      { value: "item.itemType.scythe", text: this.$t("item.itemType.scythe") },
      {
        value: "item.itemType.polearm",
        text: this.$t("item.itemType.polearm"),
      },
      { value: "item.itemType.katana", text: this.$t("item.itemType.katana") },
      {
        value: "item.itemType.greatkatana",
        text: this.$t("item.itemType.greatkatana"),
      },
      { value: "item.itemType.club", text: this.$t("item.itemType.club") },
      { value: "item.itemType.staff", text: this.$t("item.itemType.staff") },
    ];
  }

  public getSubHandTypeList() {
    return [
      { value: "item.itemType.shield", text: this.$t("item.itemType.shield") },
      { value: "item.itemType.dagger", text: this.$t("item.itemType.dagger") },
      { value: "item.itemType.sword", text: this.$t("item.itemType.sword") },
      { value: "item.itemType.axe", text: this.$t("item.itemType.axe") },
      { value: "item.itemType.katana", text: this.$t("item.itemType.katana") },
      { value: "item.itemType.club", text: this.$t("item.itemType.club") },
      { value: "item.itemType.grip", text: this.$t("item.itemType.grip") },
    ];
  }

  public getRangeTypeList() {
    return [
      { value: "item.itemType.throw", text: this.$t("item.itemType.throw") },
      {
        value: "item.itemType.archery",
        text: this.$t("item.itemType.archery"),
      },
      {
        value: "item.itemType.marksmanship",
        text: this.$t("item.itemType.marksmanship"),
      },
      {
        value: "item.itemType.stringinst",
        text: this.$t("item.itemType.stringinst"),
      },
      {
        value: "item.itemType.windinst",
        text: this.$t("item.itemType.windinst"),
      },
    ];
  }

  public getAmmoTypeList() {
    return [
      { value: "item.itemType.throw", text: this.$t("item.itemType.throw") },
      { value: "item.itemType.arrow", text: this.$t("item.itemType.arrow") },
      { value: "item.itemType.bullet", text: this.$t("item.itemType.bullet") },
    ];
  }

  public getItemSlot(item: Equipment): string | null {
    const slot = item.Slots;
    const dict = this.slotItemsArray;
    if (slot == null) {
      return null;
    }
    for (let i = 0; i <= 15; i++) {
      if ((slot & (1 << i)) !== 0) {
        return dict[i]["index"];
      }
    }

    return null;
  }

  public getItemTypeName(item: Equipment): string | null {
    if (item.ShieldSize != undefined) {
      return "item.itemType.shield";
    }
    if (item.Skill !== undefined) {
      switch (item.Skill) {
        case 0:
          if (item.Slots === 2) {
            return "item.itemType.grip";
          }
          if (item.Slots === 8) {
            return "item.itemType.throw";
          }
          return null;
        case 1:
          return "item.itemType.h2h";
        case 2:
          return "item.itemType.dagger";
        case 3:
          return "item.itemType.sword";
        case 4:
          return "item.itemType.greatsword";
        case 5:
          return "item.itemType.axe";
        case 6:
          return "item.itemType.greataxe";
        case 7:
          return "item.itemType.scythe";
        case 8:
          return "item.itemType.polearm";
        case 9:
          return "item.itemType.katana";
        case 10:
          return "item.itemType.greatkatana";
        case 11:
          return "item.itemType.club";
        case 12:
          return "item.itemType.staff";
        case 25:
          if (item.Slots === 8) {
            return "item.itemType.arrow";
          }
          return "item.itemType.archery";
        case 26:
          if (item.Slots === 8) {
            return "item.itemType.bullet";
          }
          return "item.itemType.marksmanship";
        case 27:
          return "item.itemType.throw";
        case 41:
          return "item.itemType.stringinst";
        case 42:
          return "item.itemType.windinst";
        default:
          return null;
      }
    } else {
      if (item.Slots !== undefined) {
        const slot = item.Slots;
        if ((slot & (1 << 4)) !== 0) {
          return "item.itemType.head";
        }
        if ((slot & (1 << 5)) !== 0) {
          return "item.itemType.body";
        }
        if ((slot & (1 << 6)) !== 0) {
          return "item.itemType.hands";
        }
        if ((slot & (1 << 7)) !== 0) {
          return "item.itemType.legs";
        }
        if ((slot & (1 << 8)) !== 0) {
          return "item.itemType.feet";
        }
        if ((slot & (1 << 9)) !== 0) {
          return "item.itemType.neck";
        }
        if ((slot & (1 << 10)) !== 0) {
          return "item.itemType.waist";
        }
        if ((slot & (1 << 11)) !== 0) {
          return "item.itemType.earring";
        }
        if ((slot & (1 << 13)) !== 0) {
          return "item.itemType.ring";
        }
        if ((slot & (1 << 15)) !== 0) {
          return "item.itemType.back";
        }
      }
    }
    return null;
  }

  public getItemIconUrl(id: number): string {
    return "https://semuer.github.io/XIUtilsItemIcons/icon/" + id + ".png";
  }

  public setCurrentEquipSlot(slot: string, data: EquipmentWithAug | undefined) {
    this.$store.commit("setCurrentEquipSetSlot", {
      slot: slot,
      data: data,
    });
  }
}

interface SlotStringPair {
  index: string;
  label: string;
}
