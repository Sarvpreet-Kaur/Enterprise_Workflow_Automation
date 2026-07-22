import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentRequests } from './recent-requests';

describe('RecentRequests', () => {
  let component: RecentRequests;
  let fixture: ComponentFixture<RecentRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
