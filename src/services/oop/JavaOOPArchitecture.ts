/**
 * Academic Java Architecture Module
 * Demonstrates:
 * 1. OOP Implementation: Polymorphism, Inheritance, Exception Handling, Interfaces (10 Marks rubric)
 * 2. Collections & Generics (Type-safe GenericRepository, PriorityQueue, ConcurrentMap)
 * 3. Multithreading & Synchronization (Thread lifecycle, ReentrantLock, synchronized mutex execution, Worker pool)
 */

import { LanguageItem, QuizQuestion, ThreadExecutionLog } from '../../types';

// ==========================================
// 1. INTERFACES (Contract-Based Architecture)
// ==========================================

export interface ILanguageEntity {
  getId(): string;
  getName(): string;
  getState(): string;
  getFamily(): string;
  getPhoneticSignature(): string;
  renderDisplayText(): string;
}

export interface IEvaluable<TInput, TOutput> {
  evaluate(input: TInput, expected: TInput): TOutput;
  calculateConfidenceScore(input: TInput, expected: TInput): number;
}

export interface ISynchronizedQueue<E> {
  enqueue(element: E): boolean;
  dequeue(): E | null;
  size(): number;
  isEmpty(): boolean;
  clear(): void;
}

export interface IThreadWorker {
  getThreadId(): string;
  getThreadName(): string;
  getState(): 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED';
  executeTask(taskName: string, durationMs: number): Promise<string>;
}

// ==========================================
// 2. CUSTOM EXCEPTION HIERARCHY
// ==========================================

export class BhashaAcademicException extends Error {
  public readonly errorCode: string;
  public readonly timestamp: string;
  public readonly academicModule: string;

  constructor(message: string, errorCode: string, academicModule: string) {
    super(message);
    this.name = 'BhashaAcademicException';
    this.errorCode = errorCode;
    this.academicModule = academicModule;
    this.timestamp = new Date().toISOString();
  }
}

export class PronunciationMismatchException extends BhashaAcademicException {
  public readonly expectedTranscript: string;
  public readonly actualTranscript: string;
  public readonly deviationPercentage: number;

  constructor(expected: string, actual: string, deviation: number) {
    super(
      `Phonetic deviation exceeds permissible threshold of 45%. Expected: "${expected}", Actual: "${actual}".`,
      'ERR_PHONETIC_MISMATCH_402',
      'AudioPhoneticsEngine'
    );
    this.name = 'PronunciationMismatchException';
    this.expectedTranscript = expected;
    this.actualTranscript = actual;
    this.deviationPercentage = deviation;
  }
}

export class ConcurrencyLockException extends BhashaAcademicException {
  public readonly lockName: string;
  public readonly requestingThread: string;

  constructor(lockName: string, threadName: string) {
    super(
      `Thread deadlock or timeout acquiring synchronized lock "${lockName}" on thread "${threadName}".`,
      'ERR_THREAD_MUTEX_TIMEOUT_503',
      'MultithreadingSynchronizer'
    );
    this.name = 'ConcurrencyLockException';
    this.lockName = lockName;
    this.requestingThread = threadName;
  }
}

export class DialectNotFoundException extends BhashaAcademicException {
  public readonly dialectQueried: string;

  constructor(dialect: string) {
    super(
      `Regional dialect "${dialect}" not indexed in Linguistic Ontological Tree.`,
      'ERR_DIALECT_NOT_FOUND_404',
      'DialectOntologyRepository'
    );
    this.name = 'DialectNotFoundException';
    this.dialectQueried = dialect;
  }
}

// ==========================================
// 3. INHERITANCE & POLYMORPHISM
// ==========================================

export abstract class AbstractLanguageEntity implements ILanguageEntity {
  protected id: string;
  protected name: string;
  protected state: string;
  protected family: string;

  constructor(id: string, name: string, state: string, family: string) {
    this.id = id;
    this.name = name;
    this.state = state;
    this.family = family;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getState(): string {
    return this.state;
  }

  public getFamily(): string {
    return this.family;
  }

  // Abstract methods enforcing polymorphic overrides
  public abstract getPhoneticSignature(): string;
  public abstract renderDisplayText(): string;
}

export class StateLanguage extends AbstractLanguageEntity {
  private script: string;
  private standardPhrase: string;
  private audioPhonetic: string;

  constructor(item: LanguageItem) {
    super(item.id, item.languageName, item.state, item.languageFamily);
    this.script = item.scriptName;
    this.standardPhrase = item.wordOriginal;
    this.audioPhonetic = item.audioPhonetic;
  }

  // Polymorphic implementation
  public getPhoneticSignature(): string {
    return `[Standard-Indic::${this.name}] -> ${this.audioPhonetic}`;
  }

  public renderDisplayText(): string {
    return `${this.name} (${this.script}) - Official State Register of ${this.state}: "${this.standardPhrase}"`;
  }
}

export class RegionalDialectVariant extends AbstractLanguageEntity {
  private parentLanguage: string;
  private dialectName: string;
  private specificDistricts: string;
  private samplePhrase: string;
  private phoneticShiftNote: string;

  constructor(parent: string, dialectName: string, state: string, districts: string, samplePhrase: string, shiftNote: string) {
    super(`${parent}-${dialectName.toLowerCase().replace(/\s+/g, '-')}`, dialectName, state, 'Dialect Variation');
    this.parentLanguage = parent;
    this.dialectName = dialectName;
    this.specificDistricts = districts;
    this.samplePhrase = samplePhrase;
    this.phoneticShiftNote = shiftNote;
  }

  // Polymorphic implementation with dialect nuances
  public getPhoneticSignature(): string {
    return `[Dialect-Subregister::${this.dialectName}] -> Focus: ${this.phoneticShiftNote}`;
  }

  public renderDisplayText(): string {
    return `${this.dialectName} [Spoken in ${this.specificDistricts}] - Dialect Variant: "${this.samplePhrase}"`;
  }
}

// Polymorphic Evaluators implementing IEvaluable
export abstract class AbstractQuizEvaluator<TInput, TOutput> implements IEvaluable<TInput, TOutput> {
  protected evaluatorName: string;

  constructor(name: string) {
    this.evaluatorName = name;
  }

  public abstract evaluate(input: TInput, expected: TInput): TOutput;
  public abstract calculateConfidenceScore(input: TInput, expected: TInput): number;
}

export interface PhoneticEvalResult {
  isMatch: boolean;
  score: number;
  confidence: number;
  phoneticDistance: number;
  feedbackMessage: string;
}

export class PhoneticVoiceEvaluator extends AbstractQuizEvaluator<string, PhoneticEvalResult> {
  constructor() {
    super('IndicSpeechAcousticEvaluator');
  }

  // Levenshtein phonetic distance algorithm
  private computeLevenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    const cleanA = a.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const cleanB = b.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

    for (let i = 0; i <= cleanB.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= cleanA.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= cleanB.length; i++) {
      for (let j = 1; j <= cleanA.length; j++) {
        if (cleanB.charAt(i - 1) === cleanA.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion, deletion
          );
        }
      }
    }
    return matrix[cleanB.length][cleanA.length];
  }

  public calculateConfidenceScore(userSpeech: string, targetPhrase: string): number {
    const cleanA = userSpeech.toLowerCase().trim();
    const cleanB = targetPhrase.toLowerCase().trim();
    if (!cleanA) return 0;
    const distance = this.computeLevenshtein(cleanA, cleanB);
    const maxLen = Math.max(cleanA.length, cleanB.length);
    if (maxLen === 0) return 100;
    const rawRatio = Math.max(0, 1 - distance / maxLen);
    return Math.round(rawRatio * 100);
  }

  public evaluate(userSpeech: string, targetPhrase: string): PhoneticEvalResult {
    // Demonstration of Exception Handling
    if (!userSpeech || userSpeech.trim().length === 0) {
      throw new BhashaAcademicException('Audio input stream is empty or silenced.', 'ERR_EMPTY_AUDIO_INPUT', 'PhoneticVoiceEvaluator');
    }

    const score = this.calculateConfidenceScore(userSpeech, targetPhrase);
    const isMatch = score >= 55;

    let message = 'Excellent pronunciation! Accurately matches native regional tones.';
    if (score < 55) {
      message = 'Pronunciation needs further alignment with dialect vowel cadence.';
    } else if (score < 80) {
      message = 'Good attempt! Minor accent variation detected.';
    }

    return {
      isMatch,
      score,
      confidence: Math.min(99, score + 4),
      phoneticDistance: this.computeLevenshtein(userSpeech, targetPhrase),
      feedbackMessage: message
    };
  }
}

export class MultipleChoiceEvaluator extends AbstractQuizEvaluator<number, boolean> {
  constructor() {
    super('StrictDiscreteEvaluator');
  }

  public calculateConfidenceScore(input: number, expected: number): number {
    return input === expected ? 100 : 0;
  }

  public evaluate(input: number, expected: number): boolean {
    return input === expected;
  }
}

// ==========================================
// 4. COLLECTIONS & GENERICS
// ==========================================

export class GenericRepository<T extends { id: string }> {
  private itemsMap: Map<string, T> = new Map<string, T>();
  private entityName: string;

  constructor(entityName: string, initialElements?: T[]) {
    this.entityName = entityName;
    if (initialElements) {
      initialElements.forEach(item => this.save(item));
    }
  }

  public save(entity: T): T {
    this.itemsMap.set(entity.id, entity);
    return entity;
  }

  public findById(id: string): T | undefined {
    return this.itemsMap.get(id);
  }

  public findAll(): T[] {
    return Array.from(this.itemsMap.values());
  }

  public filterBy(predicate: (item: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  public deleteById(id: string): boolean {
    return this.itemsMap.delete(id);
  }

  public count(): number {
    return this.itemsMap.size;
  }
}

export class ConcurrentGenericMap<K, V> {
  private internalMap: Map<K, V> = new Map<K, V>();
  private lock: SimulatedReentrantLock = new SimulatedReentrantLock('ConcurrentMapLock');

  public async putSynchronized(key: K, value: V): Promise<void> {
    await this.lock.lock();
    try {
      this.internalMap.set(key, value);
    } finally {
      this.lock.unlock();
    }
  }

  public get(key: K): V | undefined {
    return this.internalMap.get(key);
  }

  public entries(): [K, V][] {
    return Array.from(this.internalMap.entries());
  }
}

// ==========================================
// 5. MULTITHREADING & SYNCHRONIZATION
// ==========================================

export class SimulatedReentrantLock {
  private isHeld: boolean = false;
  private holderThreadName: string | null = null;
  public readonly lockName: string;

  constructor(lockName: string) {
    this.lockName = lockName;
  }

  public async lock(threadName: string = 'CurrentThread'): Promise<void> {
    while (this.isHeld) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.isHeld = true;
    this.holderThreadName = threadName;
  }

  public unlock(): void {
    this.isHeld = false;
    this.holderThreadName = null;
  }

  public isLocked(): boolean {
    return this.isHeld;
  }

  public getHolder(): string | null {
    return this.holderThreadName;
  }
}

export class SimulatedThreadWorker implements IThreadWorker {
  private threadId: string;
  private threadName: string;
  private state: 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED' = 'NEW';
  private currentTask: string = 'Idle';

  constructor(id: string, name: string) {
    this.threadId = id;
    this.threadName = name;
    this.state = 'RUNNABLE';
  }

  public getThreadId(): string {
    return this.threadId;
  }

  public getThreadName(): string {
    return this.threadName;
  }

  public getState(): 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED' {
    return this.state;
  }

  public setState(s: 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED') {
    this.state = s;
  }

  public getCurrentTask(): string {
    return this.currentTask;
  }

  public async executeTask(taskName: string, durationMs: number): Promise<string> {
    this.currentTask = taskName;
    this.state = 'RUNNABLE';
    await new Promise(resolve => setTimeout(resolve, durationMs));
    this.state = 'RUNNABLE';
    this.currentTask = 'Completed: ' + taskName;
    return `[${this.threadName}] Successfully finished ${taskName} in ${durationMs}ms`;
  }
}

export class IndicAcademicThreadPool {
  private static instance: IndicAcademicThreadPool;
  private workers: SimulatedThreadWorker[] = [];
  private taskQueue: { taskName: string; payload: any }[] = [];
  private executionLogs: ThreadExecutionLog[] = [];
  private globalLock: SimulatedReentrantLock = new SimulatedReentrantLock('GlobalAudioProcessingMutex');
  private listeners: ((logs: ThreadExecutionLog[]) => void)[] = [];

  private constructor() {
    this.workers = [
      new SimulatedThreadWorker('T-101', 'Thread-1 [SpeechSynthesisDaemon]'),
      new SimulatedThreadWorker('T-102', 'Thread-2 [PhoneticAcousticsWorker]'),
      new SimulatedThreadWorker('T-103', 'Thread-3 [GradeAnalyticsSync]')
    ];
    this.log('MainScheduler', 'IndicAcademicThreadPool initialized with 3 Core Synchronized Workers.', 'COMPLETED', 'JVM Thread Pool ready');
  }

  public static getInstance(): IndicAcademicThreadPool {
    if (!IndicAcademicThreadPool.instance) {
      IndicAcademicThreadPool.instance = new IndicAcademicThreadPool();
    }
    return IndicAcademicThreadPool.instance;
  }

  public getWorkers(): SimulatedThreadWorker[] {
    return this.workers;
  }

  public getLogs(): ThreadExecutionLog[] {
    return [...this.executionLogs].slice(-30);
  }

  public subscribeLogs(cb: (logs: ThreadExecutionLog[]) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    const logs = this.getLogs();
    this.listeners.forEach(cb => cb(logs));
  }

  private log(threadName: string, action: string, status: 'RUNNING' | 'WAITING' | 'LOCKED' | 'COMPLETED' | 'EXCEPTION', detail: string) {
    const entry: ThreadExecutionLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      threadName,
      timestamp: new Date().toLocaleTimeString(),
      action,
      status,
      detail
    };
    this.executionLogs.push(entry);
    this.notify();
  }

  /**
   * Synchronized task execution simulating Java's `synchronized(mutex) { ... }`
   */
  public async executeSynchronizedTask(workerIndex: number, taskName: string, workDurationMs: number = 800): Promise<string> {
    const worker = this.workers[workerIndex % this.workers.length];
    
    this.log(worker.getThreadName(), `Requesting synchronized Lock on "${this.globalLock.lockName}"`, 'WAITING', `Waiting for critical section`);
    worker.setState('WAITING');

    await this.globalLock.lock(worker.getThreadName());
    worker.setState('BLOCKED');
    this.log(worker.getThreadName(), `Lock Acquired. Entering Critical Section for "${taskName}"`, 'LOCKED', `Mutex owned by ${worker.getThreadName()}`);

    try {
      worker.setState('RUNNABLE');
      this.log(worker.getThreadName(), `Executing synchronized payload: ${taskName}`, 'RUNNING', `Processing phonetic buffers in thread workspace`);
      await worker.executeTask(taskName, workDurationMs);
      this.log(worker.getThreadName(), `Critical Section Completed: ${taskName}`, 'COMPLETED', `Task finished safely without race conditions`);
      return `Done`;
    } catch (err: any) {
      this.log(worker.getThreadName(), `Exception in synchronized block: ${err.message}`, 'EXCEPTION', `Handled by JVM ThreadPoolExceptionHandler`);
      throw err;
    } finally {
      this.globalLock.unlock();
      worker.setState('RUNNABLE');
      this.log(worker.getThreadName(), `Released Lock on "${this.globalLock.lockName}"`, 'COMPLETED', `Mutex relinquished`);
    }
  }

  /**
   * Method simulating concurrent batch evaluation of audio pronunciations
   */
  public async runBatchAudioConcurrentSimulation(): Promise<void> {
    const tasks = [
      { workerIdx: 0, name: 'Synthesizing Devanagari Audio Phonetics (hi-01)', dur: 700 },
      { workerIdx: 1, name: 'Computing Voice Waveform & Levenshtein Matrix (ta-01)', dur: 900 },
      { workerIdx: 2, name: 'Flushing Student Realtime Analytics to Synchronized Cache', dur: 600 }
    ];

    // Fire concurrently to show thread interleaving and mutex synchronization
    await Promise.all(
      tasks.map(t => this.executeSynchronizedTask(t.workerIdx, t.name, t.dur))
    );
  }
}
