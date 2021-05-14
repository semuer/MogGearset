import { Component, Vue } from 'vue-property-decorator';
import {Equipment, PropertyInfo} from "@/@types/equip-set";

@Component
export default class xiUtils extends Vue {

    public getPropertiesArray(item: Equipment): PropertyInfo[] {
        const resultInfo: PropertyInfo[] = [];


        if (item.JpDescription == null || item.JpDescription.trim() === "") {
            return resultInfo;
        }

        const props = item.JpDescription.split(/[ \n]/).filter(i => i);
        const propRegex = /(?<name>[^\d%～~+-]+)(?<value>[\d%～~+-]+)?(?<suffix>[^ \n]+)?$/i;

        let prefix:string = "";
        for(const prop of props) {

            const result = prop.match(propRegex);
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
                const matches = resultName.match(/.+(?=[:：])/);
                if(matches != null && matches.length !== 0){
                    prefix = matches[0];
                }

                const propNameMatches = resultName.match(/[:：](.+)/);
                if(propNameMatches != null && propNameMatches.length > 1){
                    resultName = propNameMatches[1];
                }


            }

            const valueResult = result.groups["value"];

            let value:number = NaN;

            // e.g. ABC:0~5% / ABC:0~5
            if (valueResult !== undefined && (valueResult.includes("~") || valueResult.includes("～")))
            {
                const normalizedValue = valueResult.replace("～","~");
                const match = normalizedValue.match(/~(?<num>\d+)/);
                if(match != null && match.groups != undefined){
                    value = parseInt(match.groups["num"]);
                }
                else{
                    console.log("parse prop error." + prop);
                }
            }
            else
            {
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
                valueUnit = valueResult.replace(/[~～\-+0-9]/g, '');
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

    public kataToHira(text:string):string {
        return text.replace(/[\u30a1-\u30f6]/g, function(match) {
            const chr = match.charCodeAt(0) - 0x60;
            return String.fromCharCode(chr);
        });
    }

    public hiraToKata(text:string):string {
        return text.replace(/[\u3041-\u3096]/g, function(match) {
            const chr = match.charCodeAt(0) + 0x60;
            return String.fromCharCode(chr);
        });
    }

    public fullWidthStrToHalfWidthStr(text:string):string {
        return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
        });
    }

    public IsRare(flag:number){
        return (flag & (1 << 15)) !== 0;
    }
    public IsEx(flag:number){
        return (flag & (1 << 14)) !== 0;
    }

    public getItemTypeName(item : Equipment):string | null
    {
        if(item.ShieldSize != undefined){
            return "盾";
        }
        if(item.Skill !== undefined){
            switch(item.Skill){
                case 0:
                    if(item.Slots === 2){
                        return "グリップ";
                    }
                    if(item.Slots === 8){
                        return "投てき";
                    }
                    return null;
                case 1:
                    return "格闘";
                case 2:
                    return "短剣";
                case 3:
                    return "片手剣";
                case 4:
                    return "両手剣";
                case 5:
                    return "片手斧";
                case 6:
                    return "両手斧";
                case 7:
                    return "両手鎌";
                case 8:
                    return "両手槍";
                case 9:
                    return "片手刀";
                case 10:
                    return "両手刀";
                case 11:
                    return "片手棍";
                case 12:
                    return "両手棍";
                case 25:
                    if(item.Slots === 8){
                        return "矢・弾"
                    }
                    return "弓術";
                case 26:
                    return "射撃";
                case 27:
                    return "投てき";
                case 41:
                    return "弦楽器";
                case 42:
                    return "管楽器";
                default:
                    return null;
            }
        }
        else
        {
            if(item.Slots  !== undefined)
            {
                const slot = item.Slots;
                if((slot & (1 << 4)) !== 0)
                {
                    return "頭"
                }
                if((slot & (1 << 5)) !== 0)
                {
                    return "胴"
                }
                if((slot & (1 << 6)) !== 0)
                {
                    return "両手"
                }
                if((slot & (1 << 7)) !== 0)
                {
                    return "両脚"
                }
                if((slot & (1 << 8)) !== 0)
                {
                    return "両足"
                }
                if((slot & (1 << 9)) !== 0)
                {
                    return "首"
                }
                if((slot & (1 << 10)) !== 0)
                {
                    return "腰"
                }
                if((slot & (1 << 11)) !== 0)
                {
                    return "耳"
                }
                if((slot & (1 << 13)) !== 0)
                {
                    return "指"
                }
                if((slot & (1 << 15)) !== 0)
                {
                    return "背"
                }
            }
        }
        return null;
    }
}
