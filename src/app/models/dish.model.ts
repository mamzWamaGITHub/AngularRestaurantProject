export class Dish {
    DishID: number;
    CompanyID: number;
    DishName: string;
    image: string;
    DishCategories: DishCategory[];
}

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

export class DiscountCategory {
    DiscountRID: number;
    disc: number;
}