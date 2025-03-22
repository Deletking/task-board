import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorsListComponent } from '../../components/colors-list/colors-list.component';
import { MainListComponent } from '../../components/main-list/main-list.component';

const COMPONENTS = [MainListComponent, ColorsListComponent];
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [...COMPONENTS],
  template: `
    <div class="flex flex-col justify-between items-center h-full w-full">
      <!-- main-list -->
      <app-main-list />

      <!-- colors-list -->
      <app-colors-list />
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {}
