import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [FormsModule] // Include FormsModule here for ngModel usage
})
export class SearchBoxComponent {
  searchTerm: string = '';

  performSearch() {
    // Implement your search logic here
  }
}