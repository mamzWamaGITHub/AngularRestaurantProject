import { Component, OnInit } from '@angular/core';
import { ChefAuthService } from '../../services/chef-auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chef-login',
  templateUrl: './chef-login.page.html',
  styleUrls: ['./chef-login.page.scss'],
})
export class ChefLoginPage implements OnInit {
  email: string = null;
  password: string = null;
  constructor(
    private readonly chefAuthService: ChefAuthService,
    private readonly loadingCtrl: LoadingController,
    private readonly alertCtrl: AlertController,
    private readonly router: Router,
  ) { }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      await this.chefAuthService.login(this.email, this.password);
      this.router.navigateByUrl('/chef', { replaceUrl: true })
    } catch (error) {
      (await this.alertCtrl.create({ message: error.message, buttons: ['OK'] })).present();
    }
    loading.dismiss();
  }

}
