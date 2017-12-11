declare module 'ember-concurrency' {
  import ComputedProperty from '@ember/object/computed';

  export function task(fn: (...args: any[]) => IterableIterator<any>): Task;
  export function timeout(delay: number): Promise<void>;

  type TaskState = 'running' | 'queued' | 'idle';
  type TaskInstanceState =
    | 'dropped'
    | 'cancelled'
    | 'finished'
    | 'running'
    | 'waiting';

  interface TaskProperty extends ComputedProperty<Task> {
    cancelOn(...eventNames: string[]): TaskProperty;
    on(...eventNames: string[]): TaskProperty;
    debug(): TaskProperty;
    drop(): TaskProperty;
    enqueue(): TaskProperty;
    keepLatest(): TaskProperty;
    restartable(): TaskProperty;
    maxConcurrency(max: number): TaskProperty;
    group(groupPath: string): TaskProperty;
  }

  interface TaskInstance<T> extends Promise<T> {
    readonly error?: Error;
    readonly hasStarted: boolean;
    readonly isCancelled?: boolean;
    readonly isDropped?: boolean;
    readonly isError?: boolean;
    readonly isFinished?: boolean;
    readonly isRunning?: boolean;
    readonly isSuccessful?: boolean;
    readonly state: TaskInstanceState;
    readonly value: T;
    cancel(): void;
    finally<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
  }

  interface Task<T = any> {
    readonly isIdle: boolean;
    readonly isQueued: boolean;
    readonly isRunning: boolean;
    readonly last?: TaskInstance<T>;
    readonly performCount: number;
    readonly state: TaskState;
    readonly lastCancelled?: TaskInstance<T>;
    readonly lastComplete?: TaskInstance<T>;
    readonly lastErrored?: TaskInstance<T>;
    readonly lastPerformed?: TaskInstance<T>;
    cancelAll(): void;
    perform(...args: any[]): Promise<void>;
  }
}
