import { Component, OnInit } from '@angular/core';
import { Bond } from 'src/app/Model/bond';
import { MarketConfig } from 'src/app/Model/market-config';
import { ImoexService } from 'src/app/service/imoex.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public bonds: Bond[] = [];
  public marketConfig: MarketConfig = new MarketConfig();

  constructor(private imoex: ImoexService) { }

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.bonds = await this.imoex.GetBonds();
  }

  Recalculate() {
    this.bonds.forEach(b => b.CalculateParameters(this.marketConfig));
  }

}
