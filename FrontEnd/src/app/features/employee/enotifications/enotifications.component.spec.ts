import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmployeeNotificationsComponent } from './enotifications.component';

describe('EmployeeNotificationsComponent', () => {
  let component: EmployeeNotificationsComponent;
  let fixture: ComponentFixture<EmployeeNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EmployeeNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
