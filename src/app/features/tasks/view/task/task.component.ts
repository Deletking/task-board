import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InclusionFormComponent } from '../../components/inclusion-form/inclusion-form.component';

const COMPONENTS = [InclusionFormComponent];
@Component({
  selector: 'app-task',
  imports: [...COMPONENTS],
  template: `
    <div class="flex flex-col mx-10">
      <!-- Title -->
      <span class="text-4xl font-bold">My task Board</span>

      <!-- Form -->
      <app-inclusion-form />

      <!-- Task list -->
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {}
