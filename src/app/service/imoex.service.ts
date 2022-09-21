import { Injectable } from '@angular/core';
import { Bond } from '../Model/bond';
import { BondLoader } from '../Model/bond-loader';
import { MarketConfig } from '../Model/market-config';

@Injectable({
  providedIn: 'root'
})
export class ImoexService {
  async GetBonds(): Promise<Bond[]> {
    var url = "https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQOB/securities.json?marketdata.columns=SECID,SHORTNAME,LAST,SYSTIME,VALUE&iss.meta=off&iss.only=marketdata";
    url = "/assets/securities.json"
    var query = await fetch(url);
    var response = await query.json();

    var bondLoader = new BondLoader(response.securities.columns)
    var marketLoader = new BondLoader(response.marketdata.columns)


    var bondsList = response.securities.data;
    var marketList = response.marketdata.data;



    var ans: Bond[] = bondsList.map((jsonBond: any) => new Bond(jsonBond, bondLoader));
    ans.forEach((element: Bond) => {
      element.LoadMarketData(marketLoader, marketList);
    });

    var defaultMarketConfig = new MarketConfig();
    ans.forEach((element: Bond) => {
      element.LoadMarketData(marketLoader, marketList);
      element.CalculateParameters(defaultMarketConfig);
    });

    ans.sort((a, b) => a.daysToEnd - b.daysToEnd);

    return ans;
  }
  constructor() { }
}
