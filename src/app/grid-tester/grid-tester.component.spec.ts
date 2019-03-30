import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTesterComponent } from './grid-tester.component';

describe('GridTesterComponent', () => {
  let component: GridTesterComponent;
  let fixture: ComponentFixture<GridTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
