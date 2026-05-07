import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketPriceService } from '@core/services/market-price.service';
import { TaxService, TaxCalculationResponse } from '@core/services/tax.service';

interface TaxCalculatorResult {
  totalTax: number;
  slabBreakdown: Array<{ rate: number; taxableIncomeUsd: number; taxAmountUsd: number }>;
  currencySymbol: string;
}

@Component({
  selector: 'app-tax-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tax-calculator.component.html'
})
export class TaxCalculatorComponent implements OnInit {
  calculation = {
    taxType: 'exercise' as 'exercise' | 'selling',
    awardType: 'esop' as 'esop' | 'rsu',
    stockSymbol: 'SCHW',
    holdingPeriodMonths: null as number | null,
    marketPrice: null as number | null,
    shares: null as number | null,
    exercisePrice: null as number | null,
    salePrice: null as number | null
  };

  result: TaxCalculatorResult | null = null;
  loading = false;
  marketLoading = false;
  errorMessage = '';
  marketPriceError = '';

  constructor(private marketPriceService: MarketPriceService, private taxService: TaxService) {}

  ngOnInit(): void {
    this.fetchMarketPrice();
  }

  onTaxTypeChange(): void {
    const prevSymbol = this.calculation.stockSymbol;
    this.resetCalculation(false);
    if (prevSymbol && prevSymbol.trim()) {
      this.calculation.stockSymbol = prevSymbol;
      this.fetchMarketPrice();
    }
  }

  onAwardTypeChange(): void {
    const prevSymbol = this.calculation.stockSymbol;
    if (this.calculation.awardType === 'rsu') {
      this.calculation.exercisePrice = null;
    }
    this.resetCalculation(false);
    if (prevSymbol && prevSymbol.trim()) {
      this.calculation.stockSymbol = prevSymbol;
      this.fetchMarketPrice();
    }
  }

  fetchMarketPrice(): void {
    const symbol = this.calculation.stockSymbol?.trim().toUpperCase();
    if (!symbol) {
      this.marketPriceError = 'Please enter a stock symbol.';
      return;
    }

    this.marketLoading = true;
    this.marketPriceError = '';
    this.result = null;

    this.marketPriceService.getPrice(symbol).subscribe({
      next: (price) => {
        this.calculation.marketPrice = price.adjustedClosePrice;
        this.marketLoading = false;
      },
      error: (err) => {
        console.error('Market price fetch failed:', err);
        this.marketPriceError = err?.error?.error || 'Unable to fetch market price. Please try again.';
        this.marketLoading = false;
      }
    });
  }

  calculateTax(): void {
    this.errorMessage = '';
    if (this.calculation.marketPrice == null || this.calculation.shares == null || this.calculation.shares <= 0) {
      this.errorMessage = 'Please enter market price and number of shares.';
      return;
    }

    if (this.calculation.taxType === 'exercise' && this.calculation.awardType !== 'rsu' && (this.calculation.exercisePrice == null || this.calculation.exercisePrice < 0)) {
      this.errorMessage = 'Please enter a valid exercise price.';
      return;
    }

    if (this.calculation.taxType === 'selling' && (this.calculation.salePrice == null || this.calculation.salePrice <= 0)) {
      this.errorMessage = 'Please enter a valid sale price.';
      return;
    }

    this.loading = true;
    const baseAmount = this.calculation.taxType === 'exercise'
      ? this.getPerquisiteValue()
      : this.getCapitalGainAmount();

    if (baseAmount <= 0) {
      this.errorMessage = 'Taxable amount must be greater than zero.';
      this.loading = false;
      return;
    }

    // For selling tax, if holding period >= 12 months, apply flat 12.5% LTCG, else use slab
    if (this.calculation.taxType === 'selling' && (this.calculation.holdingPeriodMonths ?? 0) >= 12) {
      // Flat 12.5% tax
      const tax = +(baseAmount * 0.125).toFixed(2);
      this.result = {
        totalTax: tax,
        slabBreakdown: [
          {
            rate: 0.125,
            taxableIncomeUsd: +baseAmount.toFixed(2),
            taxAmountUsd: tax
          }
        ],
        currencySymbol: '$'
      };
      this.loading = false;
      return;
    }

    // Otherwise, use backend slab calculation
    this.taxService.calculateTax(baseAmount).subscribe({
      next: (taxResult: TaxCalculationResponse) => {
        this.result = {
          totalTax: taxResult.netTaxUsd,
          slabBreakdown: taxResult.slabBreakdown.map(slab => ({
            rate: slab.rate,
            taxableIncomeUsd: slab.taxableIncomeUsd,
            taxAmountUsd: slab.taxAmountUsd
          })),
          currencySymbol: '$'
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Tax calculation failed:', err);
        this.errorMessage = 'Failed to calculate tax. Please try again.';
        this.loading = false;
      }
    });
  }

  resetCalculation(clearMarketPrice: boolean = true): void {
    this.result = null;
    this.loading = false;
    this.errorMessage = '';
    this.marketPriceError = '';
    this.calculation.shares = null;
    this.calculation.exercisePrice = this.calculation.awardType === 'rsu' ? null : null;
    this.calculation.salePrice = null;
    if (clearMarketPrice) {
      this.calculation.marketPrice = null;
    }
    this.calculation.holdingPeriodMonths = null;
  }

  getPerquisiteValue(): number {
    if (this.calculation.marketPrice == null || this.calculation.shares == null) {
      return 0;
    }
    const price = this.calculation.marketPrice;
    const exercisePrice = this.calculation.awardType === 'rsu' ? 0 : (this.calculation.exercisePrice ?? 0);
    return (this.calculation.shares ?? 0) * Math.max(0, price - exercisePrice);
  }

  getCapitalGainAmount(): number {
    if (this.calculation.marketPrice == null || this.calculation.shares == null) {
      return 0;
    }
    return (this.calculation.shares ?? 0) * Math.max(0, (this.calculation.salePrice ?? 0) - this.calculation.marketPrice);
  }

  getTotalTax(): number {
    return this.result?.totalTax ?? 0;
  }

  getNetProceeds(): number {
    const shares = this.calculation.shares ?? 0;
    const marketPrice = this.calculation.marketPrice ?? 0;
    const exercisePrice = this.calculation.awardType === 'rsu' ? 0 : (this.calculation.exercisePrice ?? 0);
    const salePrice = this.calculation.salePrice ?? 0;

    if (this.calculation.taxType === 'exercise') {
      // For exercise: Net Proceeds = (Market Price - Strike Price) × Shares - Tax
      const gainPerShare = marketPrice - exercisePrice;
      return gainPerShare * shares - this.getTotalTax();
    }

    // For selling: Net Proceeds = Sale Price × Shares - Tax
    return salePrice * shares - this.getTotalTax();
  }

  getHoldingClassification(): string {
    if (this.calculation.taxType !== 'selling') {
      return '';
    }
    return (this.calculation.holdingPeriodMonths ?? 0) >= 12 ? 'Long-Term Capital Gain' : 'Short-Term Capital Gain';
  }

  getTaxLabel(): string {
    return this.calculation.taxType === 'exercise'
      ? 'Exercise Tax Estimate'
      : 'Selling Tax Estimate';
  }
}
