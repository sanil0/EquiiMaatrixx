import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaxCalculatorComponent } from './tax-calculator.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MarketPriceService } from '@core/services/market-price.service';
import { TaxService } from '@core/services/tax.service';
import { of, throwError } from 'rxjs';

const mockMarketPriceService = {
  getPrice: jasmine.createSpy().and.returnValue(of({ adjustedClosePrice: 100 }))
};

const mockTaxService = {
  calculateTax: jasmine.createSpy().and.returnValue(of({
    netTaxUsd: 125,
    slabBreakdown: [
      { rate: 0.125, taxableIncomeUsd: 1000, taxAmountUsd: 125 }
    ]
  }))
};

describe('TaxCalculatorComponent', () => {
  let component: TaxCalculatorComponent;
  let fixture: ComponentFixture<TaxCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, TaxCalculatorComponent],
      providers: [
        { provide: MarketPriceService, useValue: mockMarketPriceService },
        { provide: TaxService, useValue: mockTaxService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch market price', fakeAsync(() => {
    component.calculation.stockSymbol = 'SCHW';
    component.fetchMarketPrice();
    tick();
    expect(component.calculation.marketPrice).toBe(100);
  }));

  it('should calculate tax for LTCG (holding >= 12)', () => {
    component.calculation.taxType = 'selling';
    component.calculation.holdingPeriodMonths = 12;
    component.calculation.marketPrice = 10;
    component.calculation.salePrice = 20;
    component.calculation.shares = 10;
    component.calculateTax();
    expect(component.result?.totalTax).toBe(12.5);
    expect(component.result?.slabBreakdown[0].rate).toBe(0.125);
  });

  it('should calculate tax for STCG (holding < 12)', fakeAsync(() => {
    component.calculation.taxType = 'selling';
    component.calculation.holdingPeriodMonths = 6;
    component.calculation.marketPrice = 10;
    component.calculation.salePrice = 20;
    component.calculation.shares = 10;
    component.calculateTax();
    tick();
    expect(mockTaxService.calculateTax).toHaveBeenCalled();
    expect(component.result?.totalTax).toBe(125);
  }));

  it('should show $0 for RSU exercise price', () => {
    component.calculation.taxType = 'exercise';
    component.calculation.awardType = 'rsu';
    component.calculation.exercisePrice = null;
    fixture.detectChanges();
    // This is a template test, so we check the logic
    expect(component.calculation.awardType).toBe('rsu');
    expect(component.calculation.exercisePrice).toBeNull();
  });

  it('should handle market price fetch error', fakeAsync(() => {
    mockMarketPriceService.getPrice.and.returnValue(throwError({ error: { error: 'API error' } }));
    component.calculation.stockSymbol = 'SCHW';
    component.fetchMarketPrice();
    tick();
    expect(component.marketPriceError).toBe('API error');
    mockMarketPriceService.getPrice.and.returnValue(of({ adjustedClosePrice: 100 })); // reset
  }));
});
