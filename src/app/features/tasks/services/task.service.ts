import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  tasks = signal<Task[]>([]);
  numberOftasks = computed(() => this.tasks().length);
  isLoadingTask = signal(false);

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      tap(tasks => {
        const sortedTasks = this.getSortedTasks(tasks);
        this.tasks.set(sortedTasks);
      })
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient
      .post<Task>(`${this.apiUrl}/tasks`, task)
      .pipe(tap(createdTask => this.insertTaskInTheTaskList(createdTask)));
  }

  insertTaskInTheTaskList(newTask: Task): void {
    this.tasks.update(task => {
      const newTaskList = [...task, newTask];

      return this.getSortedTasks(newTaskList);
    });
  }

  updateTask(updatedTasks: Task): Observable<Task> {
    return this.httpClient
      .put<Task>(`${this.apiUrl}/tasks/${updatedTasks.id}`, updatedTasks)
      .pipe(tap(updatedTask => this.updateTaskInTheTaskList(updatedTask)));
  }

  updateTaskIsCompleted(
    taskId: string,
    IsCompleted: boolean
  ): Observable<Task> {
    return this.httpClient
      .patch<Task>(`${this.apiUrl}/tasks/${taskId}`, {
        IsCompleted,
      })
      .pipe(tap(updatedTask => this.updateTaskInTheTaskList(updatedTask)));
  }

  updateTaskInTheTaskList(updatedTask: Task): void {
    this.tasks.update(tasks => {
      const allTasksWithUpdatedTaskRemoved = tasks.filter(
        task => task.id !== updatedTask.id
      );
      const updatedTaskList = [...allTasksWithUpdatedTaskRemoved, updatedTask];

      return this.getSortedTasks(updatedTaskList);
    });
  }

  deleteTask(taskId: string): Observable<Task> {
    return this.httpClient
      .delete<Task>(`${this.apiUrl}/tasks/${taskId}`)
      .pipe(tap(() => this.deleteTaskInTheTaskList(taskId)));
  }

  deleteTaskInTheTaskList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title?.localeCompare(b.title));
  }
}
