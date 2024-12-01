import { Injectable, signal, computed } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '@app/shared/utils/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
  private products = signal<Product[]>([]);
  private selectedProduct = signal<Product | null>(null);
  private categories = signal<string[]>([]);
  private loading = signal<boolean>(false);

  products$ = computed(() => this.products());
  selectedProduct$ = computed(() => this.selectedProduct());
  categories$ = computed(() => this.categories());
  loading$ = computed(() => this.loading());

  constructor(private productService: ProductService) {}

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        const productsWithImage = data.map((product: Product) => ({
          ...product,
          image: 'https://picsum.photos/400',
        }));

        this.products.set(productsWithImage);
        this.loading.set(false);
      },
      error: () => {
        console.error('Failed to load products');
        this.loading.set(false);
      },
    });
  }


  loadCategories(): void {
    if (this.categories().length > 0) return;
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: () => console.error('Failed to load categories'),
    });
  }

  selectProduct(product: Product | null): void {
    this.selectedProduct.set(product);
  }

  addProduct(product: Product): void {
    this.productService.createProduct(product).subscribe({
      next: (newProduct) => {
        this.products.set([...this.products(), newProduct]);
      },
    });
  }

  updateProduct(product: Product): void {
    if (!product.id) return;
    this.productService.updateProduct(product.id, product).subscribe({
      next: (updatedProduct) => {
        const index = this.products().findIndex((p) => p.id === product.id);
        if (index !== -1) {
          const updatedProducts = [...this.products()];
          updatedProducts[index] = updatedProduct;
          this.products.set(updatedProducts);
        }
      },
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.set(this.products().filter((p) => p.id !== id));
      },
    });
  }
}
