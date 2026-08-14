import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const evaluateurGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Token:', token);
  console.log('Role:', role);

  if (token && (role === 'EVALUATEUR' || role === 'ADMIN')) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};