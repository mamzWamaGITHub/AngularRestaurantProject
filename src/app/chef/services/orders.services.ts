import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InProgressTable } from 'src/app/chef/models/in-progress-table.model';
import { InProgressItem } from '../models/in-progress-item.model';
import { SERVER_URL } from 'src/app/config';
import { ChefAuthService } from './chef-auth.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly chefAuthService: ChefAuthService,
    ) { }

    getTables(): Promise<InProgressTable[]> {
        return this.httpClient.post<InProgressTable[]>(SERVER_URL + 'chef/GetInProgressTables', {
            CompanyID: this.chefAuthService.chefAuthModel.value.CompanyID,
        }).toPromise();
    }

    getCartItemByTables(customerId: number): Promise<InProgressItem[]> {
        return this.httpClient.post<InProgressItem[]>(SERVER_URL + 'chef/tables/GetCartItemByTables', {
            CustomerID: customerId
        }).toPromise();
    }
}
