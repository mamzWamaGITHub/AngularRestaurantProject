import { Injectable } from '@angular/core';
import { Dish } from '../models/dish.model';
import { ApiService } from './api/api.service';
import { DishCategory } from '../models/dish-category.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(
        private readonly api: ApiService,
    ) {
        this.loadMenuFromLocalStorage();
    }

    private menu: Dish[] = null;

    async getMenu(): Promise<Dish[]> {
        if (this.menu) {
            return Promise.resolve(this.menu);
        }
        try {
            const ParamCompanyID = 1; // TODO: fix
            const result = await this.api.getData<Dish[]>('menus/' + ParamCompanyID).toPromise();
            if (!result || result.length === 0) {
                throw new Error('Empty menu found');
            }
            this.menu = result;
            this.saveMenuToLocalStrogae();
            return this.menu;
        } catch (error) {
            console.log('could not load menus');
            throw error;
        }
    }

    getDish(categoryId: number): Dish {
        if (!this.menu || this.menu.length === 0) {
            return null;
        }

        for (const dish of this.menu) {
            for (const category of dish.DishCategories) {
                if (category.CategoryRID === categoryId) {
                    return dish;
                }
            }
        }

        return null;
    }

    getDishCategory(categoryId: number): DishCategory {
        if (!this.menu || this.menu.length === 0) {
            return null;
        }

        for (const dish of this.menu) {
            for (const category of dish.DishCategories) {
                if (category.CategoryRID === categoryId) {
                    return category;
                }
            }
        }

        return null;
    }

    private saveMenuToLocalStrogae() {
        if (this.menu === null || this.menu.length === 0) {
            console.log('Empy menu');
            return;
        }

        window.localStorage.setItem('FOOD_MENU', JSON.stringify(this.menu));
    }

    private loadMenuFromLocalStorage() {
        const foodMenuData = window.localStorage.getItem('FOOD_MENU');
        if (!foodMenuData) {
            console.log('stored menu not found or empty');
            return;
        }
        try {
            this.menu = JSON.parse(foodMenuData);
        } catch (error) {
            console.log('invalid format of the food menu data');
        }
    }
}
