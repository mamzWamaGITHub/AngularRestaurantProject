import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoadingController, IonSlides } from '@ionic/angular';
import { QrAuthService } from '../services/qr-auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPagePage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  companyID: string;
  tableID: string;
  qrCode: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly loadingCtrl: LoadingController,
    private readonly qrAuthService: QrAuthService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.companyID = params.companyID;
      this.tableID = params.tableID;
      this.qrCode = params.qrCode;

      this.validateData();
    });
  }

  async validateData() {
    // TODO: REMOVE ME
    if (this.qrAuthService.qrAuthModel.value !== null) {
      return;
    }

    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      await this.qrAuthService.verifyQrCode(this.tableID, this.companyID, this.qrCode);
    } catch (error) {
      console.error(error);
    }
    loading.dismiss();
  }

  next() {
    this.slides.slideNext();
  }

  finsih() {
    this.router.navigateByUrl('/', {
      replaceUrl: true
    });
  }

}
