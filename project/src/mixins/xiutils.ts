import { Component, Vue } from "vue-property-decorator";
import { Equipment, PropertyInfo } from "@/@types/equip-set";

@Component
export default class xiUtils extends Vue {
  public getPropertyValue(
    item: Equipment,
    property: number | undefined,
    category: number | undefined | null
  ): number | undefined {
    const props = item.Properties;
    if (props == undefined) {
      return undefined;
    }
    for (const prop of props) {
      if (
        property === prop.PropID &&
        ((category == undefined && prop.CatID == undefined) ||
          category === prop.CatID)
      ) {
        if (prop.Value == undefined) {
          return 0;
        } else {
          return prop.Value;
        }
      }
    }
    return undefined;
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
        valueResult !== undefined &&
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

  public getItemTypeName(item: Equipment, lang: string): string | null {
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
            return "item.itemType.ammo";
          }
          return "item.itemType.archery";
        case 26:
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
}
