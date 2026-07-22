import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutService } from '../../../core/services/layout.services';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService)

  user = this.authService.getCurrentUser();

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout(){
    this.authService.logout()
  }
}
