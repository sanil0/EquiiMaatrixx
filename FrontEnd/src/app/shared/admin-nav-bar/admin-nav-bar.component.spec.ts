import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminNavBarComponent } from './admin-nav-bar.component';

describe('AdminNavBarComponent', () => {
  let component: AdminNavBarComponent;
  let fixture: ComponentFixture<AdminNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AdminNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
