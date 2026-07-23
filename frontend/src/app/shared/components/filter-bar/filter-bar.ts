import { Component, input, output } from '@angular/core';
import { FilterConfig } from '../../../core/models/filterConfig.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filter-bar',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  filters = input.required<FilterConfig[]>();
  filtersChanged = output<Record<string, string>>();

  selectedFilters: Record<string,string> = {};

  onChange(key:string,value:string){

    this.selectedFilters[key]=value;
    this.filtersChanged.emit(this.selectedFilters);

  }
}
