import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaxInformationComponent } from './tax-information.component';

describe('TaxInformationComponent', () => {
  let component: TaxInformationComponent;
  let fixture: ComponentFixture<TaxInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TaxInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
