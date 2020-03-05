import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
        const url = `${SERVER_URL}QRVerification`;
        const body = new HttpParams()
            .set('TableID', tableId)
            .set('CompanyID', companyId)
            .set('QRCode', qrCode);

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        try {
            const response = await this.httpClient.post<QrAuth>(url, body.toString(), { headers }).toPromise();

            if (!response) {
                throw new Error('Unknow error');
            }

            this.qrAuthModel.next(response);

            this.saveToLocalStorage();
            return response;
        } catch (error) {
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
