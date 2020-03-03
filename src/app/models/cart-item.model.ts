import { DishCategory, Dish } from './dish.model';

export class CartItem {
    dish: Dish;
    dishCategory: DishCategory;
    quantity: number;
}
