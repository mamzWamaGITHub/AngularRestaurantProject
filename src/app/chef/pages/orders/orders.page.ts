import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.services';
import { InProgressTable } from '../../models/in-progress-table.model';
import { InProgressItem } from 'src/app/chef/models/in-progress-item.model';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage implements OnInit {
  tables: InProgressTable[];
  selectedTable: InProgressTable = null;
  items: InProgressItem[];

  constructor(
    private readonly ordersService: OrdersService,
    private readonly loadingCtrl: LoadingController,
    private readonly alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.getTables();
  }

  private async getTables() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      this.tables = await this.ordersService.getTables();
      if (this.tables && this.tables.length > 0) {
        this.setSelectedTable(this.tables[0]); // TOOD: remove this line
      }
    } catch (error) {
      (await this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      })).present();
    }
    loading.dismiss();
  }

  async setSelectedTable(table: InProgressTable) {
    if (table === this.selectedTable) {
      return;
    }
    this.selectedTable = table;
    console.log(this.selectedTable);

    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      this.items = await this.ordersService.getCartItemByTables(table.CustomerRID);
    } catch (error) {
      (await this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      })).present();
    }
    loading.dismiss();
  }
}
