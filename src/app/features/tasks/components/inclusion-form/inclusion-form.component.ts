import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { categoryBackgroundIdColors } from '../../../categories/constants/category-colors';
import { CategoryService } from '../../../categories/services/category.service';
import { IncludeTaskFormComponent } from './include-task-form/include-task-form.component';
import { TaskService } from '../../services/task.service';

const COMPONENTS = [IncludeTaskFormComponent];
const COMMONS = [NgClass];
@Component({
  selector: 'app-inclusion-form',
  imports: [...COMMONS, ...COMPONENTS],
  template: `
    <div class="grid grid-cols-12 gap-2 mt-8">
      <app-include-task-form class="col-span-11" />

      <div
        [ngClass]="{
          'opacity-30': taskService.isLoadingTask(),
          'opacity-100': !taskService.isLoadingTask(),
        }"
        class="col-span-1 flex items-start mt-2">
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

  readonly taskService = inject(TaskService);
  readonly selectedCategoryId = this.categoryService.selectedCategoryId;

  colorVariants = categoryBackgroundIdColors;
}
