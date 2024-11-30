import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Product } from '@app/shared/utils/product.model';
import { CustomValidators } from '@app/shared/validators/validator';
import { HandlerService } from '@app/core/services/handler.service';
import { ProductService } from '@app/core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  categories = signal<string[]>([]);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
    description: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
    price: [0, [Validators.required, Validators.min(0), CustomValidators.numeric]],
    stock: [0, [Validators.required, Validators.min(0), CustomValidators.numeric]],
    isAvailable: [true],
    category: ['', [Validators.required, CustomValidators.noLeadingOrTrailingWhitespaceValidator]],
    image: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private handler: HandlerService
  ) { }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        this.handler.handleError('Error fetching categories', err);
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.formSubmit.emit(this.productForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
