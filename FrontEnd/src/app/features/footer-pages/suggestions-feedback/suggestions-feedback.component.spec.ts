import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuggestionsFeedbackComponent } from './suggestions-feedback.component';

describe('SuggestionsFeedbackComponent', () => {
  let component: SuggestionsFeedbackComponent;
  let fixture: ComponentFixture<SuggestionsFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuggestionsFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
