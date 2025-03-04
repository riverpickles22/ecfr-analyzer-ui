import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  items = ['Option 1', 'Option 2', 'Option 3']; // Dropdown options
  selected: string | undefined;
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: string) {
    this.selected = item;
    this.isOpen = false;
  }
}
