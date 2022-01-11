import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNotificationComponent } from './confirm-notification.component';

describe('ConfirmNotificationComponent', () => {
  let component: ConfirmNotificationComponent;
  let fixture: ComponentFixture<ConfirmNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
