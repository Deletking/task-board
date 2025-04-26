import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { catchError, delay, EMPTY, finalize } from 'rxjs';
import { CategoryService } from '../../../../categories/services/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { NgClass } from '@angular/common';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';

const MODULES = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMMONS = [NgClass];
@Component({
  selector: 'app-include-task-form',
  imports: [...MODULES, ...COMMONS],
  template: `
    <form
      [ngClass]="{
        'cursor-not-allowed animate-pulse': isIncludeTaskFormDisabled(),
        'cursor-pointer': !isIncludeTaskFormDisabled(),
      }"
      autocomplet="off"
      class="flex flex-row gap-2 select-none"
      [formGroup]="newTaskForm">
      <mat-form-field class="w-full">
        <mat-label data-testid="titleLabel" for="title">Task</mat-label>
        <input
          formControlName="title"
          matInput
          placeholder="add task"
          (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Press enter to add</mat-hint>
      </mat-form-field>
      <mat-form-field>
        <mat-label data-testid="categoryIdLabel" for="categoryId"
          >Category</mat-label
        >
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
  private readonly destroy$ = inject(DestroyRef);
  private readonly snackBarService = inject(SnackBarService);

  readonly taskService = inject(TaskService);
  readonly categories = this.categoryService.categories;

  newTaskForm = createTaskForm();

  isIncludeTaskFormDisabled = computed(() => {
    if (this.taskService.isLoadingTask()) {
      this.newTaskForm.disable();

      return this.taskService.isLoadingTask();
    }

    this.newTaskForm.enable();

    return this.taskService.isLoadingTask();
  });

  constructor() {
    effect(() => {
      if (this.taskService.isLoadingTask()) {
        this.newTaskForm.disable();
      } else {
        this.newTaskForm.enable();
      }
    });
  }

  onEnterToAddATask(): void {
    if (this.newTaskForm.invalid) return;

    this.taskService.isLoadingTask.set(true);

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
        delay(4000),
        takeUntilDestroyed(this.destroy$),
        catchError(error => {
          this.snackBarConfigHandler(error.message);
          return EMPTY;
        }),
        finalize(() => this.taskService.isLoadingTask.set(false))
      )
      .subscribe(task => {
        this.taskService.insertTaskInTheTaskList(task);
        this.snackBarConfigHandler('Task added');
      });
  }

  snackBarConfigHandler(message: string): void {
    this.snackBarService.showSnackBar(message, 4000, 'end', 'top');
  }
}
