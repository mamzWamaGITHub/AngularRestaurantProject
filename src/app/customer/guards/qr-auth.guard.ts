import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QrAuthService } from 'src/app/services/qr-auth.service';

@Injectable({
  providedIn: 'root'
})
export class QrAuthGuard implements CanActivate {
  constructor(
    private readonly qrAuthService: QrAuthService,
    private readonly router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.qrAuthService.qrAuthModel.value === null) {
      return this.router.navigateByUrl('/error');
    }
    return true;
  }

}
