import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SERVER_URL } from '../../config';
import { ChefAuth } from '../models/chef-auth.model';

@Injectable({ providedIn: 'root' })
export class ChefAuthService {
    constructor(private httpClient: HttpClient) {
        this.chefAuthModel = new BehaviorSubject(null);
        this.loadFromLocalStorage();
    }

    chefAuthModel: BehaviorSubject<ChefAuth>;

    async login(userid: string, password: string) {
        const url = `${SERVER_URL}login`;
        const body = new HttpParams()
            .set('userid', userid)
            .set('password', password);

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        try {
            const response = await this.httpClient.post<ChefAuth>(url, body.toString(), { headers }).toPromise();

            if (!response) {
                throw new Error('Unknow error');
            }

            this.chefAuthModel.next(response);

            this.saveToLocalStorage();
            return response;
        } catch (error) {
            // TODO:
            alert('WE will use fake identity, remove this code in production');
            this.chefAuthModel.next({
                UserName: 'demo@demo.com',
                Usertype: '',
                CompanyID: 1
            });
            this.saveToLocalStorage();
            return;
            throw error;
        }
    }

    saveToLocalStorage() {
        if (this.chefAuthModel.value === null) {
            window.localStorage.removeItem('CHEF_AUTH');
            return;
        }

        window.localStorage.setItem('CHEF_AUTH', JSON.stringify(this.chefAuthModel.value));
    }

    loadFromLocalStorage() {
        const storedData = window.localStorage.getItem('CHEF_AUTH');
        if (!storedData) {
            return;
        }
        try {
            this.chefAuthModel.next(JSON.parse(storedData));
            console.log('chef auth model loaded from local storage');
        } catch (error) {
            console.log('could not load chef auth model from local storage, invalid format of data');
        }
    }
}
