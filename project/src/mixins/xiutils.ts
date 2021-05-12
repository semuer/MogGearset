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
        const propRegex = /(?<name>[^\d%～~+-]+)(?<value>[\d%～~+-]+)?(?<suffix>[^ /n]+)?$/i;

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
}
