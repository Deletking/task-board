import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { categoryBackgroundIdColors } from '../../../categories/constants/category-colors';
import { CategoryService } from '../../../categories/services/category.service';
import { IncludeTaskFormComponent } from './include-task-form/include-task-form.component';

const COMPONENTS = [IncludeTaskFormComponent];
const MODULES = [CommonModule];
@Component({
  selector: 'app-inclusion-form',
  imports: [...MODULES, ...COMPONENTS],
  template: `
    <div class="grid grid-cols-12 gap-2 mt-8">
      <app-include-task-form class="col-span-11" />

      <div class="col-span-1 flex items-start mt-2">
        <span
          [ngClass]="colorVariants[selectedCategoryId()]"
          class="rounded-full w-10 h-10">
        </span>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InclusionFormComponent {
  private readonly categoryService = inject(CategoryService);

  readonly selectedCategoryId = this.categoryService.selectedCategoryId;

  colorVariants = categoryBackgroundIdColors;
}
