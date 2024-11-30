import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Product } from '@app/shared/utils/product.model';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '@app/features/products/product-form/product-form.component';
import { AuthService } from '@app/core/services/auth.service';
import { ProductService } from '@app/core/services/product.service';
import { HandlerService } from '@app/core/services/handler.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  filterName = signal<string>('');
  filterCategory = signal<string>('');
  filterAvailability = signal<string>('');
  filterPriceRange = signal<string>('');

  selectedProduct = signal<Product | null>(null);
  isAddingProduct: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private handler: HandlerService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products.set(data.map((product: Product) => ({
          ...product,
          image: 'https://picsum.photos/400',
        })));
        const uniqueCategories = [...new Set(this.products().map(p => p.category))];
        this.categories.set(uniqueCategories);
      },
      error: (err) => {
        this.handler.handleError('Error fetching products', err);
      }
    });
  }

  filteredProducts(): Product[] {
    return this.products().filter(product => {
      const matchesName = this.filterName() ? product.name.toLowerCase().includes(this.filterName().toLowerCase()) : true;
      const matchesCategory = this.filterCategory() ? product.category === this.filterCategory() : true;
      const matchesAvailability = this.filterAvailability() ? product.isAvailable.toString() === this.filterAvailability() : true;
      const matchesPriceRange = this.matchPriceRange(product.price);

      return matchesName && matchesCategory && matchesAvailability && matchesPriceRange;
    });
  }

  matchPriceRange(price: number): boolean {
    switch (this.filterPriceRange()) {
      case 'low':
        return price < 50;
      case 'medium':
        return price >= 50 && price <= 100;
      case 'high':
        return price > 100;
      default:
        return true;
    }
  }

  addProduct() {
    this.isAddingProduct = true;
    this.selectedProduct.set(null);
  }

  editProduct(product: Product) {
    this.selectedProduct.set(product);
    this.isAddingProduct = false;
  }

  onFormSubmit(product: Product) {
    if (this.selectedProduct()) {
      this.productService.updateProduct(this.selectedProduct()!.id, product).subscribe({
        next: (updatedProduct) => {
          const index = this.products().findIndex(p => p.id === this.selectedProduct()!.id);
          if (index !== -1) {
            const updatedProducts = [...this.products()];
            updatedProducts[index] = updatedProduct;
            this.products.set(updatedProducts);
          }
          this.selectedProduct.set(null);
        },
        error: (err) => {
          this.handler.handleError('Error updating product', err);
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: (newProduct) => {
          this.products.set([...this.products(), newProduct]);
          this.isAddingProduct = false;
        },
        error: (err) => {
          this.handler.handleError('Error creating product', err);
        }
      });
    }
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.set(this.products().filter(product => product.id !== id));
      },
      error: (err) => this.handler.handleError('Error deleting product', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onCancel() {
    this.isAddingProduct = false;
    this.selectedProduct.set(null);
  }

  get totalPages(): number {
    const totalFilteredProducts = this.filteredProducts().length;
    return Math.ceil(totalFilteredProducts / this.pageSize());
  }

  hasMultiplePages(): boolean {
    return this.filteredProducts().length > this.pageSize();
  }

  paginatedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProducts().slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(value => value - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(value => value + 1);
    }
  }

  resetFilters(): void {
    this.filterName.set('');
    this.filterCategory.set('');
    this.filterAvailability.set('');
    this.filterPriceRange.set('');
    this.resetPagination();
    this.loadProducts();
  }

  resetPagination(): void {
    this.currentPage.set(1);
  }
}
