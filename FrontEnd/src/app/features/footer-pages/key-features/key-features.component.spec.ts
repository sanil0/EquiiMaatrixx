import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KeyFeaturesComponent } from './key-features.component';

describe('KeyFeaturesComponent', () => {
  let component: KeyFeaturesComponent;
  let fixture: ComponentFixture<KeyFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, KeyFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});