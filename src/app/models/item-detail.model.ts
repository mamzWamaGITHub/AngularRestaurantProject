import { ItemOrderStatus } from './item-order-status.enum';
import { DishCategory } from './dish-category.model';
import * as shortid from 'shortid';

export class ItemDetail {
    CustomerID: string;
    MenuRID: number;
    CategoryRID: number;
    Quantity: number;
    Amount: number;
    TaxID: number;
    TaxPercentage: number;
    TaxAmount: number;
    DiscountID: number;
    DiscountPercentage: number;
    DiscountAmount: number;
    ItemOrderStatus: ItemOrderStatus;
    // tslint:disable-next-line:variable-name
    Order_Generate_ID: string;

    static create(customerId: string, dishCategory: DishCategory, quantity: number): ItemDetail {
        const amount = quantity * dishCategory.Amount;
        let discountID: number, discountPercentage = 0, discountAmount = 0;

        if (dishCategory.DiscountCategories.length > 0) {
            discountID = dishCategory.DiscountCategories[0].DiscountRID;
            discountAmount = dishCategory.DiscountCategories[0].disc * quantity;
            discountPercentage = (discountAmount / amount) * 100;
        }

        const taxAmount = amount * (dishCategory.TaxPercentage / 100);

        return {
            CustomerID: customerId,
            MenuRID: dishCategory.MenuRID,
            CategoryRID: dishCategory.CategoryRID,
            Quantity: quantity,
            Amount: amount,
            TaxID: dishCategory.Tax,
            TaxPercentage: dishCategory.TaxPercentage,
            TaxAmount: taxAmount,
            DiscountID: discountID,
            DiscountPercentage: discountPercentage,
            DiscountAmount: discountAmount,
            ItemOrderStatus: null,
            // tslint:disable-next-line:variable-name
            Order_Generate_ID: shortid.generate(),
        };
    }
}
