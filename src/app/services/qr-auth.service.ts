import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QrAuth } from '../models/auth.model';
import { BehaviorSubject } from 'rxjs';
import { SERVER_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class QrAuthService {
    constructor(private httpClient: HttpClient) {
        this.qrAuthModel = new BehaviorSubject(null);
        this.loadFromLocalStorage();
    }

    qrAuthModel: BehaviorSubject<QrAuth>;

    async verifyQrCode(tableId: string, companyId: string, qrCode: string) {
        const url = `${SERVER_URL}QRVerification/${companyId}`;
        try {
            const response = await this.httpClient.post<QrAuth>(url, {
                TableID: 1,
                CompanyID: 1,
                QRCode: '856A0CCA-96EC-484D-84B5-DAC084A9BBE9',
            }).toPromise();

            if (!response) {
                throw new Error('Unknow error');
            }

            this.qrAuthModel.next(response);

            this.saveToLocalStorage();
            return response;
        } catch (error) {
            // TODO: remove me
            alert('We will use fake qr auth');
            this.qrAuthModel.next({
                UserName: null,
                Usertype: '',
                CompanyID: '1',
                TableID: '1'
            });
            this.saveToLocalStorage();
            throw error;
        }
    }

    saveToLocalStorage() {
        if (this.qrAuthModel.value === null) {
            window.localStorage.removeItem('QR_AUTH');
            return;
        }

        window.localStorage.setItem('QR_AUTH', JSON.stringify(this.qrAuthModel.value));
    }

    loadFromLocalStorage() {
        const qrAuthData = window.localStorage.getItem('QR_AUTH');
        if (!qrAuthData) {
            return;
        }
        try {
            this.qrAuthModel.next(JSON.parse(qrAuthData));
            console.log('qr auth model loaded from local storage');
        } catch (error) {
            console.log('could not load qr auth model from local storage, invalid format of data');
        }
    }
}
