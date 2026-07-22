import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.services';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  collapsed = false

  constructor(
    private layoutService: LayoutService
  ){}

  ngOnInit(){
    this.layoutService.sidebarCollapsed$.subscribe(value => this.collapsed = value);
  }
}
