import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChefAuthService } from '../services/chef-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChefAuthGuard implements CanActivate {
  constructor(
    private readonly chefAuthService: ChefAuthService,
    private readonly router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.chefAuthService.chefAuthModel.value === null) {
      return this.router.navigateByUrl('/chef/login');
    }
    return true;
  }

}
