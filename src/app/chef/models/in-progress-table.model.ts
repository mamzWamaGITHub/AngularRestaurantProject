import { OrderStatus } from '../../models/order-status.enum';

export class InProgressTable {
    TableRID: number;
    CustomerRID: number;
    TableName: string;
    OrderStatus: string;
}
