import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  });

  constructor() { }

  showToast(title: string, type: 'success' | 'error' | 'info' | 'question' | 'warning', message?: string) {
    this.toastMixin.fire({
      title: title,
      text: message,
      icon: type
    });
  }
}
