import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { catchError, EMPTY } from 'rxjs';
import { CategoryService } from '../../../../categories/services/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';

const MODULES = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  FormsModule,
  ReactiveFormsModule,
];
@Component({
  selector: 'app-include-task-form',
  imports: [...MODULES],
  template: `
    <form
      autocomplet="off"
      class="flex flex-row gap-2 select-none"
      [formGroup]="newTaskForm">
      <mat-form-field class="w-full">
        <mat-label>Task</mat-label>
        <input
          formControlName="title"
          matInput
          placeholder="add task"
          (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Press enter to add</mat-hint>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Category</mat-label>
        <mat-select
          formControlName="categoryId"
          (selectionChange)="onCategoryChange($event)"
          (keyup.enter)="onEnterToAddATask()">
          @for (category of categories(); track category.id) {
            <mat-option value="{{ category.id }}">{{
              category.name
            }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncludeTaskFormComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly destroy$ = inject(DestroyRef);

  readonly categories = this.categoryService.categories;

  newTaskForm = createTaskForm();

  onEnterToAddATask(): void {
    console.log(this.newTaskForm.value);
    if (this.newTaskForm.invalid) return;

    const { title, categoryId } = this.newTaskForm.value;

    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
    };

    this.addNewTask(newTask);
  }

  onCategoryChange(event: MatSelectChange): void {
    this.categoryService.selectedCategoryId.set(event.value);
  }

  private addNewTask(task: Partial<Task>): void {
    this.taskService
      .createTask(task)
      .pipe(
        takeUntilDestroyed(this.destroy$),
        catchError(error => {
          console.error('Erro ao adicionar tarefa:', error.message);
          return EMPTY;
        })
      )
      .subscribe(task => {
        this.taskService.insertTaskInTheTaskList(task);
        alert('Task added');
      });
  }
}
