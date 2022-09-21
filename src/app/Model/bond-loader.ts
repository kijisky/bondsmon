export class BondLoader {
    columnMap: any = {};

    constructor(pJsonColumnsList: string[]) {
        for (var i = 0; i < pJsonColumnsList.length; i++) {
            var name = pJsonColumnsList[i];
            this.columnMap[name] = i;
        }
    }
    public GetData(data: any, columnName: string) {
        if (this.columnMap[columnName] != null) {
            var indx = this.columnMap[columnName];
            return data[indx];
        }
        return null;
    }

    GetFromList(marketList: any[], pFieldName: string, pValue: string) {
        for (var record of marketList) {
            if (this.GetData(record, pFieldName) == pValue) {
                return record;
            }
        }
        return null;
    }

}
