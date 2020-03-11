import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.services';
import { InProgressTable } from '../../models/in-progress-table.model';
import { InProgressItem } from 'src/app/chef/models/in-progress-item.model';

@Component({
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage implements OnInit {
  tables: InProgressTable[];
  selectedTable: InProgressTable = null;
  items: InProgressItem[];

  constructor(
    private readonly ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.getTables();
  }

  private async getTables() {
    this.tables = await this.ordersService.getTables();
    this.setSelectedTable(this.tables[0]); // TOOD: remove this line
  }

  async setSelectedTable(table: InProgressTable) {
    this.selectedTable = table;
    console.log(this.selectedTable);
    this.items = await this.ordersService.getCartItemByTables(table.CustomerRID);
  }
}
