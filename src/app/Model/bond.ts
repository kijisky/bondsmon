import { BondLoader } from "./bond-loader";
import { MarketConfig } from "./market-config";

export class Bond {
    source: any;
    boardId: string;
    boardName: string;
    secId: string;
    shortName: string;

    systime: Date;
    status: string;
    offerDate: Date;
    secName: string;
    marketCode: string;

    endDate: Date;
    duration: number = 0;

    price: number = 0;
    nominalPrice: number = 0;
    test: any;

    // Coupon data
    couponPeriod: number;
    couponValue: number;
    couponDate: Date;
    couponNKD: number;

    // Market data
    value: number = 0;
    priceLast: number = 0;
    priceOpen: number = 0;
    priceLastPct: number = 0;
    priceOpenPct: number = 0;
    getAtTheEnd: number = 0;
    needToPay: number = 0;
    margin: number = 0;
    totalProfitPct: number = 0;
    yearProfitPct: number = 0;
    inflationProfitPct: number = 0;
    yield: any;

    constructor(pJson: any, loader: BondLoader) {
        this.source = pJson;
        this.secId = loader.GetData(pJson, "SECID");
        this.boardId = loader.GetData(pJson, "BOARDID");


        this.shortName = loader.GetData(pJson, "SHORTNAME");
        this.secName = loader.GetData(pJson, "SECNAME");
        this.boardName = loader.GetData(pJson, "BOARDNAME");
        this.marketCode = loader.GetData(pJson, "MARKETCODE");

        this.status = loader.GetData(pJson, "STATUS");

        this.couponPeriod = loader.GetData(pJson, "COUPONPERIOD");
        this.couponValue = loader.GetData(pJson, "COUPONVALUE");
        this.couponNKD = loader.GetData(pJson, "ACCRUEDINT");

        this.offerDate = new Date(loader.GetData(pJson, "OFFERDATE"));
        this.couponDate = new Date(loader.GetData(pJson, "NEXTCOUPON"));
        this.endDate = new Date(loader.GetData(pJson, "MATDATE"));




        this.systime = loader.GetData(pJson, "SYSTIME");
        this.nominalPrice = loader.GetData(pJson, "FACEVALUE");
        //this.duration = loader.GetData(pJson, "DURATION");


        this.test = loader.GetData(pJson, "ACCRUEDINT");


    }
    LoadMarketData(marketLoader: BondLoader, marketList: any[]) {
        var marketJson = marketLoader.GetFromList(marketList, "SECID", this.secId);
        if (marketJson) {
            this.priceLastPct = marketLoader.GetData(marketJson, "LAST");
            this.priceLast = this.priceLastPct * this.nominalPrice / 100;
            this.priceLast = Math.round(this.priceLast * 100) / 100;
            this.priceOpenPct = marketLoader.GetData(marketJson, "OPEN");
            this.priceOpen = this.priceOpenPct * this.nominalPrice / 100;
            this.priceOpen = Math.round(this.priceOpen * 100) / 100;

            this.yield = marketLoader.GetData(marketJson, "YIELD");

            this.value = marketLoader.GetData(marketJson, "VOLTODAY");

            var now: Date = new Date();
            this.duration = Math.round((this.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        }
        //this.CalculateParameters()
    }

    CalculateParameters(marketConfig: MarketConfig) {
        if (this.endDate) {
            var couponsToGet = Math.floor(this.duration / this.couponPeriod) + 1;
            this.getAtTheEnd = this.nominalPrice + this.couponValue * couponsToGet;
            this.needToPay = this.priceLast + this.couponNKD;
            this.needToPay += this.needToPay * (marketConfig.brokerComissionPct / 100);/// Broker comission
            this.margin = this.getAtTheEnd - this.needToPay;
            this.totalProfitPct = this.margin / this.needToPay;
            this.yearProfitPct = (this.totalProfitPct / this.duration) * 365;
            this.inflationProfitPct = this.yearProfitPct - (marketConfig.inflationPct / 100);
        }
    }


}
