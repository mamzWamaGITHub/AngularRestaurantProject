import { DishCategory } from './dish-category.model';

export class Dish {
    DishID: number;
    CompanyID: number;
    DishName: string;
    image: string;
    DishCategories: DishCategory[];
}
