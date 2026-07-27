import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowForm } from './workflow-form';

describe('WorkflowForm', () => {
  let component: WorkflowForm;
  let fixture: ComponentFixture<WorkflowForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
