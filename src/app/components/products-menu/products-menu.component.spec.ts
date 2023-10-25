import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsMenuComponent } from './products-menu.component';

describe('ProductsMenuComponent', () => {
  let component: ProductsMenuComponent;
  let fixture: ComponentFixture<ProductsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsMenuComponent]
    });
    fixture = TestBed.createComponent(ProductsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
