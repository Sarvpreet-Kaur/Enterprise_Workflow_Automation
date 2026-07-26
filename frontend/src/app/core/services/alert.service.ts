import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0B6E88',
      background: '#0B2C35',
      color: '#F2EFEA',
      iconColor: '#6FCF97',
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0B6E88',
      background: '#0B2C35',
      color: '#F2EFEA',
      iconColor: '#EB5757',
    });
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0B6E88',
      background: '#0B2C35',
      color: '#F2EFEA',
      iconColor: '#F2C94C',
    });
  }

  confirm(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',

      background: '#0B2C35',
      color: '#F2EFEA',

      iconColor: '#F2994A',

      showCancelButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#C0392B',

      cancelButtonColor: '#4F6470',

      reverseButtons: true,
    });
  }
}
