import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './payment-status.enum';

// export class Order {
//     items: CartItem[];
//     subTotal = 0;
//     discountTotal = 0;
//     taxTotal = 0;
//     total = 0;
//     status: 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
// }


export class Order {
    TableRID: string;
    CompanyID: string;
    CustomerName: string;
    CustomerMobile: number;
    OrderStatus: OrderStatus;
    PaymentStatus: PaymentStatus;
    // tslint:disable-next-line:variable-name
    Customer_Generate_ID: string;
}

// const cart = {
//     order: {
//         TableRID: 1,
//         CompanyID: 1,
//         CustomerName: 'Ateeq',
//         CustomerMobile: 9959,
//         OrderStatus: 1,
//         PaymentStatus: 1,
//         Customer_Generate_ID: 'SDF34D34'
//     },

//     itemDetails: [
//         {
//             CustomerID: 0,
//             MenuRID: 1,
//             CategoryRID: 1,
//             Quantity: 3,
//             Amount: 500,
//             TaxID: 1,
//             TaxPercentage: 5.00,
//             TaxAmount: 50.00,
//             DiscountID: 1,
//             DiscountPercentage: 5.00,
//             DiscountAmount: 100,
//             ItemOrderStatus: 1,
//             Order_Generate_ID: '23432CXVDSF'
//         }, {
//             CustomerID: 0,
//             MenuRID: 1,
//             CategoryRID: 1,
//             Quantity: 3,
//             Amount: 500,
//             TaxID: 1,
//             TaxPercentage: 5.00,
//             TaxAmount: 50.00,
//             DiscountID: 1,
//             DiscountPercentage: 5.00,
//             DiscountAmount: 100,
//             ItemOrderStatus: 1,
//             Order_Generate_ID: '23432C434XVDSF'
//         }
//     ],
//     PaymentDetails: { TotalAmount: 500.00 }

// }
