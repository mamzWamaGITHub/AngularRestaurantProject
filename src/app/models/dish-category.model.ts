import { DiscountCategory } from './discount-category.model';

export class DishCategory {
    MenuRID: number;
    CategoryRID: number;
    CategoryName: string;
    Amount: number;
    TaxPercentage: number;
    Tax: number;
    Quantity: number;
    disc: number;
    DiscountCategories: DiscountCategory[];
}
