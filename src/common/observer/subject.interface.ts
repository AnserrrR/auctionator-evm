import { IObserver } from './observer.interface';

export interface ISubject {
  attach(observer: IObserver<ISubject>): void;
  detach(observer: IObserver<ISubject>): void;
  notify(): void;
}
