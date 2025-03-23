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

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      tap(tasks => {
        const sortedTasks = this.getSortedTasks(tasks);
        this.tasks.set(sortedTasks);
      })
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  insertTaskInTheTaskList(newTask: Task): void {
    const updatedTasks = [...this.tasks(), newTask];
    const sortedTasks = this.getSortedTasks(updatedTasks);

    this.tasks.set(sortedTasks);
  }

  upadteTask(updatedTasks: Task): Observable<Task> {
    return this.httpClient.put<Task>(
      `${this.apiUrl}/tasks/${updatedTasks.id}`,
      updatedTasks
    );
  }

  upadteTaskIsCompleted(
    taskId: string,
    IsCompleted: boolean
  ): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, {
      IsCompleted,
    });
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
    return this.httpClient.delete<Task>(`${this.apiUrl}/tasks/${taskId}`);
  }

  deleteTaskInTheTaskList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  private getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title.localeCompare(b.title));
  }
}
