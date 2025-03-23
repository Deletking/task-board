import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { categoryBackgroundColors } from '../../constants/category-colors';
import { CategoryService } from '../../services/category.service';

const MODULES = [MatDividerModule];

@Component({
  selector: 'app-colors-list',
  imports: [...MODULES],
  template: `
    <section class="flex flex-col gap-4 w-full h-auto mb-4">
      <!-- Divider -->
      <mat-divider class="opacity-50" />
      <!--  Colors List -->
      <div class="flex flex-wrap justify-center items-center mt-4 px-2 gap-4">
        @for (category of categories(); track category.id) {
          <span
            class="select-none opacity-80 hover:opacity-100 flex items-center justify-center {{
              categoryColors[category.color]
            }} px-4 py-2 rounded-xl w-[80px] text-white font-semibold text-sm"
            >{{ category.name }}</span
          >
        }
      </div>
    </section>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsListComponent {
  private readonly categoryService = inject(CategoryService);

  categories = this.categoryService.categories;

  categoryColors = categoryBackgroundColors;
}
