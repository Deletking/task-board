import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { task, tasks } from '../../../__mocks__/task';
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
    it('should create task', () => {
      taskService.createTask(MOCKED_TASK).subscribe(task => {
        expect(task).toEqual(MOCKED_TASK);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/tasks`);
      expect(req.request.method).toEqual('POST');
      req.flush(MOCKED_TASK);
    });
  });

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
});
