import { CartItem } from './cart-item.model';

export class Order {
    items: CartItem[];
    subTotal = 0;
    discountTotal = 0;
    taxTotal = 0;
    total = 0;
    status: 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
