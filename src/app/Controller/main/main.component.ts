import { Component, OnInit, ViewChild } from '@angular/core';
import { Bond } from 'src/app/Model/bond';
import { MarketConfig } from 'src/app/Model/market-config';
import { ImoexService } from 'src/app/service/imoex.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public bonds: Bond[] = [];
  public marketConfig: MarketConfig = new MarketConfig();

  public selectedIndex = null;
  public selectedParameter = null;


  public showSecID: boolean = false;


  public barChartData: any = {
    type: 'bar',
    labels: ['x', 'y', 'f'],
    datasets: [
      { label: "доходость,год", yAxisID: "yaxisPct", data: [1, 2, 4] },
      { label: "доходность1", yAxisID: "yaxisPct", data: [1, 2, 4] },
      { label: "объемы", yAxisID: "yaxis2", data: [1, 2, 4] }
    ]
  }
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private imoex: ImoexService) { }

  async ngOnInit() {
    this.load();
  }

  public onChartHover(event: any) {
    // console.log("hover: dataset:" + event.active[0]?. + " index:" + );
    // this.selectedIndex = event.active[0]?.index;
    // this.selectedParameter = event.active[0]?.datasetIndex;
  }

  public onChartClick(event: any) {
    // console.log("hover: dataset:" + event.active[0]?. + " index:" + );
    this.selectedIndex = event.active[0]?.index;
    this.selectedParameter = event.active[0]?.datasetIndex;
  }
  async loadMoex() {
    // https://iss.moex.com/iss/engines/stock/markets/bonds/securities/SU26220RMFS2/candles?from=2022-09-10
    // https://iss.moex.com/iss/archives/engines/stock/markets/bonds/securities/daily
    var bonds = await this.imoex.GetBonds("https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQOB/securities.json");
    this.loadData(bonds);
  }
  async load() {
    var bonds = await this.imoex.GetBonds("/assets/securities.json");
    this.loadData(bonds);
  }
  loadData(bonds: Bond[]) {
    bonds = bonds.filter(b => b.shortName.startsWith("ОФЗ 26") && b.yearProfitPct < 100);
    this.bonds = bonds;
    this.barChartData.labels = bonds.map(b => b.shortName);
    this.barChartData.datasets[0].data = bonds.map(b => b.yearProfitPct * 100);
    this.barChartData.datasets[1].data = bonds.map(b => b.yield);
    this.barChartData.datasets[2].data = bonds.map(b => b.value);
    this.chart?.update();
  }



  Recalculate() {
    this.bonds.forEach(b => b.CalculateParameters(this.marketConfig));
  }

}
