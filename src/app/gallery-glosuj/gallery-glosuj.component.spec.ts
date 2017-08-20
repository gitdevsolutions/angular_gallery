import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryGlosujComponent } from './gallery-glosuj.component';

describe('GalleryGlosujComponent', () => {
  let component: GalleryGlosujComponent;
  let fixture: ComponentFixture<GalleryGlosujComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryGlosujComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryGlosujComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
