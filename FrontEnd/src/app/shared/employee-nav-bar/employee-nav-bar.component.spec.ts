import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmployeeNavBarComponent } from './employee-nav-bar.component';

describe('EmployeeNavBarComponent', () => {
  let component: EmployeeNavBarComponent;
  let fixture: ComponentFixture<EmployeeNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, EmployeeNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
