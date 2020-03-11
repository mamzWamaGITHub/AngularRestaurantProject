import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InProgressTable } from 'src/app/chef/models/in-progress-table.model';
import { InProgressItem } from '../models/in-progress-item.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(private httpClient: HttpClient) { }

    getTables(): Promise<InProgressTable[]> {
        // TODO: fix it to return real data
        // return this.httpClient.get<Table[]>(SERVER_URL + 'tables').toPromise();
        return Promise.resolve([
            {
                TableRID: 1,
                CustomerRID: 1,
                TableName: 'TABLE 1',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 2,
                TableName: 'TABLE 2',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 3,
                TableName: 'TABLE 3',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 4,
                TableName: 'TABLE 4',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 5,
                TableName: 'TABLE 5',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 7,
                TableName: 'TABLE 6',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 8,
                TableName: 'TABLE 7',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 11,
                TableName: 'TABLE 8',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 12,
                TableName: 'TABLE 9',
                OrderStatus: 'Pending'
            },
            {
                TableRID: 1,
                CustomerRID: 13,
                TableName: 'TABLE 10',
                OrderStatus: 'Pending'
            }
        ]
        );
    }

    getCartItemByTables(customerID: number): Promise<InProgressItem[]> {
        return Promise.resolve([
            {
                DishID: 15,
                CompanyID: 1,
                DishName: 'BIRYANI',
                image: null,
                MenuRID: 15,
                CategoryRID: 1,
                CategoryName: 'FAMILY PACK',
                Amount: 0.0,
                TaxPercentage: 0.0,
                Tax: 0.0,
                Quantity: 2.0,
                disc: 0
            },
            {
                DishID: 14,
                CompanyID: 1,
                DishName: 'PIZZA',
                image: null,
                MenuRID: 15,
                CategoryRID: 1,
                CategoryName: 'MEDIUM',
                Amount: 0.0,
                TaxPercentage: 0.0,
                Tax: 0.0,
                Quantity: 1.0,
                disc: 0
            },
            {
                DishID: 14,
                CompanyID: 1,
                DishName: 'Burger',
                image: null,
                MenuRID: 15,
                CategoryRID: 1,
                CategoryName: 'Large',
                Amount: 0.0,
                TaxPercentage: 0.0,
                Tax: 0.0,
                Quantity: 4.0,
                disc: 0
            },
            {
                DishID: 14,
                CompanyID: 1,
                DishName: 'Rice',
                image: null,
                MenuRID: 15,
                CategoryRID: 1,
                CategoryName: 'Small',
                Amount: 0.0,
                TaxPercentage: 0.0,
                Tax: 0.0,
                Quantity: 1.0,
                disc: 0
            },
            {
                DishID: 14,
                CompanyID: 1,
                DishName: 'Checkin',
                image: null,
                MenuRID: 15,
                CategoryRID: 1,
                CategoryName: '1/2 KG',
                Amount: 0.0,
                TaxPercentage: 0.0,
                Tax: 0.0,
                Quantity: 1.0,
                disc: 0
            },
        ]);
    }
}
