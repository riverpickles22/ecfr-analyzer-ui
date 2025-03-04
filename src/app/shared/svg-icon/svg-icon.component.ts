// svg-icon.component.ts
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-svg-icon',
  imports: [CommonModule, ],
  styleUrl: './svg-icon.component.scss',
  templateUrl: './svg-icon.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SvgIconComponent implements OnInit {
  @Input() svgIconName: string | undefined;
  @Input() basicFormat: Boolean;
  @Input() dynamicHeight: string = '1.3';
  @Input() isHovered: Boolean;
  @Input() isActive: boolean = false;

  iconSvgUrl: SafeHtml;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if(this.basicFormat){
      this.isHovered=false;
    }

    if (this.svgIconName) {
      this.loadSvgContent();
    }
  }

  loadSvgContent(): void {
    this.http.get(`assets/icons/${this.svgIconName}.svg`, { responseType: 'text' })
      .subscribe(svg => {
        this.iconSvgUrl = this.sanitizer.bypassSecurityTrustHtml(svg);
      });
  }
}
