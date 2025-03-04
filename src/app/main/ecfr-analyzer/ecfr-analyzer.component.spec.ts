import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfrAnalyzerComponent } from './ecfr-analyzer.component';

describe('EcfrAnalyzerComponent', () => {
  let component: EcfrAnalyzerComponent;
  let fixture: ComponentFixture<EcfrAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcfrAnalyzerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcfrAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
