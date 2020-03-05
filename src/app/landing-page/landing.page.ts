import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoadingController, IonSlides } from '@ionic/angular';
import { QrAuthService } from '../services/qr-auth.service';
import { QrAuth } from '../models/auth.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  @ViewChild(IonSlides, { static: false })
  slides: IonSlides;

  companyID: string;
  tableID: string;
  qrCode: string;
  qrAuth: QrAuth;
  showTutorial = false;
  verificationFailed = false;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly loadingCtrl: LoadingController,
    private readonly qrAuthService: QrAuthService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.qrAuthService.qrAuthModel.subscribe((value) => {
      this.qrAuth = value;
    });

    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.companyID = params.companyID;
      this.tableID = params.tableID;
      this.qrCode = params.qrCode;

      this.validateData();
    });
  }

  async validateData() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      await this.qrAuthService.verifyQrCode(this.tableID, this.companyID, this.qrCode);
      this.presentTutorialOrGoHome();
    } catch (error) {
      console.error(error);
      this.verificationFailed = true;
    }
    loading.dismiss();
  }

  private presentTutorialOrGoHome() {
    const userSawTutorial = window.localStorage.getItem('USER_SAW_TUTORIAL');

    if (userSawTutorial) {
      this.finsih();
      return;
    }

    this.showTutorial = true;
  }

  next() {
    console.log(this.slides);
    this.slides.slideNext();
  }

  finsih() {
    window.localStorage.setItem('USER_SAW_TUTORIAL', 'true');
    this.router.navigateByUrl('/customer/food-menu', {
      replaceUrl: true
    });
  }

  retry() {
    this.verificationFailed = false;
    this.validateData();
  }

}
