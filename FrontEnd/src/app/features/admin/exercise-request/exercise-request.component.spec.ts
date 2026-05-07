import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ExerciseRequestComponent } from './exercise-request.component';

describe('ExerciseRequestComponent', () => {
  let component: ExerciseRequestComponent;
  let fixture: ComponentFixture<ExerciseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ExerciseRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
