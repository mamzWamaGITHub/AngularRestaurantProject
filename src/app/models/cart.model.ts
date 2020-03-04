import { Order } from './order.model';
import { ItemDetail } from './item-detail.model';
import { PaymentDetail } from './payment-detail.model';

export class Cart {
    order: Order;
    itemDetails: ItemDetail[];
    PaymentDetails: PaymentDetail;
}
