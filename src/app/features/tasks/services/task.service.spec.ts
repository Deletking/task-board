import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  task,
  TASK_INTERNAL_SERVER_ERROR_RESPONSE,
  TASK_UNPROCESSABLE_ENTITY_RESPONSE,
  tasks,
} from '../../../__mocks__/task';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let httpTestingController: HttpTestingController;

  const MOCKED_TASKS: Task[] = tasks;
  const MOCKED_TASK: Task = task;

  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    taskService = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(taskService).toBeTruthy();
  });

  it('should sorted tasks', () => {
    const sortedTasks = taskService.getSortedTasks(MOCKED_TASKS);
    expect(sortedTasks[0].title).toEqual('Comprar pão na padaria.');
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      let task: Task | undefined;

      taskService.createTask(MOCKED_TASK).subscribe(res => {
        task = res;
      });

      const req = httpTestingController.expectOne(`${baseUrl}/tasks`);
      req.flush(MOCKED_TASK);

      expect(req.request.method).toEqual('POST');
      expect(task).toEqual(MOCKED_TASK);
    });

    it('should throw unprocessable entity with invalid body', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.createTask(MOCKED_TASK).subscribe({
        next: () => {
          fail('should have failed with the 422 error');
        },
        error: err => (httpErrorResponse = err),
      });

      const req = httpTestingController.expectOne(`${baseUrl}/tasks`);
      req.flush('Unprocessable Entity', TASK_UNPROCESSABLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toBe('Unprocessable Entity');
    }));
  });

  describe('UpdateTask', () => {
    it('should update a task', () => {
      taskService.tasks.set([MOCKED_TASK]);

      const updateTask = MOCKED_TASK;
      updateTask.title = 'Ir na academia treinar pernas';

      taskService.updateTask(updateTask).subscribe(() => {
        expect(taskService.tasks()[0].title).toEqual(
          'Ir na academia treinar pernas'
        );
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/tasks/${updateTask.id}`
      );
      req.flush(MOCKED_TASK);
      expect(req.request.method).toEqual('PUT');
    });

    it('should throw unprocessable entity with invalid body when updating a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.tasks.set([MOCKED_TASK]);

      const updateTask = MOCKED_TASK;
      updateTask.title = 'Ir na academia treinar pernas';

      taskService.updateTask(updateTask).subscribe({
        next: () => {
          fail('should to update a task');
        },
        error: err => (httpErrorResponse = err),
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/tasks/${updateTask.id}`
      );
      req.flush('Unprocessable Entity', TASK_UNPROCESSABLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toBe('Unprocessable Entity');
    }));
  });

  describe('updateIsCompletedStatus', () => {
    it('should update IsCompletedStatus of a task', waitForAsync(() => {
      const updatedTask = MOCKED_TASK;
      const methodUrl = `${baseUrl}/tasks/${updatedTask.id}`;

      taskService.tasks.set(MOCKED_TASKS);

      taskService.updateTaskIsCompleted(updatedTask.id, true).subscribe(() => {
        expect(taskService.tasks()[2].isCompleted).toBeTruthy();
      });

      const req = httpTestingController.expectOne(methodUrl);
      expect(req.request.method).toEqual('PATCH');

      req.flush({ ...updatedTask, isCompleted: true });
    }));

    it('should throw and error when update a tasks isCompleted status', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      const updatedTask = MOCKED_TASK;
      const methodUrl = `${baseUrl}/tasks/${updatedTask.id}`;

      taskService.tasks.set(MOCKED_TASKS);

      taskService.updateTaskIsCompleted(updatedTask.id, true).subscribe({
        next: () => {
          fail('failed to update a task isCompleted status');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(methodUrl);

      req.flush('Unprocessable Entity', TASK_UNPROCESSABLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('deleteTask', () => {
    it('should delete a task', waitForAsync(() => {
      taskService.tasks.set([MOCKED_TASK]);

      taskService.deleteTask(MOCKED_TASK.id).subscribe(() => {
        expect(taskService.tasks().length).toEqual(0);
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/tasks/${MOCKED_TASK.id}`
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush(null);
    }));

    it('should throw unprocessable entity with invalid body when delete a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.tasks.set([MOCKED_TASK]);

      taskService.deleteTask(MOCKED_TASK.id).subscribe({
        next: () => {
          fail('failed to delete a task');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/tasks/${MOCKED_TASK.id}`
      );

      req.flush('Unprocessable Entity', TASK_UNPROCESSABLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('getTasks', () => {
    it('should return a list of tasks', waitForAsync(() => {
      let tasks!: Task[];

      taskService.getTasks().subscribe(res => {
        tasks = res;
      });

      const req = httpTestingController.expectOne(`${baseUrl}/tasks`);
      req.flush(MOCKED_TASKS);

      expect(tasks).toEqual(MOCKED_TASKS);
      expect(taskService.tasks()).toEqual(MOCKED_TASKS);
      expect(req.request.method).toEqual('GET');
    }));

    it('should throw and error when server Internal Server Error', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      taskService.getTasks().subscribe({
        next: () => {
          fail('should have failed with the 500 error');
        },
        error: err => (httpErrorResponse = err),
      });

      const req = httpTestingController.expectOne(`${baseUrl}/tasks`);
      req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(500);
      expect(httpErrorResponse.statusText).toBe('Internal Server Error');
    }));
  });
});
