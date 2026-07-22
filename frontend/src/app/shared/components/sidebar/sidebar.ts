import { Component, Input, OnInit } from '@angular/core';
import {NAVIGATION} from '../../../core/constants/navigation'
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.services';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  navigation = NAVIGATION
  @Input() collapsed = false

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService
  ){}

  ngOnInit(){
    const role = this.authService.getCurrentUserRole()? this.authService.getCurrentUserRole(): "";

    this.navigation = NAVIGATION.filter(item =>
        item.roles.includes(role)
    );
    this.layoutService.sidebarCollapsed$.subscribe(value => this.collapsed = value);
  }
}
