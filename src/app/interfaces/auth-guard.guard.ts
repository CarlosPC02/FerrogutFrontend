import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UtilidadService } from '../reutilizable/utilidad.service';
import { inject } from '@angular/core';



export const authGuardGuard:
CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(UtilidadService).getToken() ? true : inject(Router).createUrlTree(['/login']);
};
