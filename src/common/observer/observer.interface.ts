import { ISubject } from './subject.interface';

export interface IObserver<T extends ISubject> {
  update(subject: T): void;
}
