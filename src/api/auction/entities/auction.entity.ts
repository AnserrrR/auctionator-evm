import { Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { ISubject } from '../../../common/observer/subject.interface';
import { IObserver } from '../../../common/observer/observer.interface';

@Entity()
export class AuctionEntity extends AppBaseEntity implements ISubject {
  /**
   * Name of the auction
   */
  @Column('text')
  name: string;

  /**
   * Description of the auction
   */
  @Column('text')
  description: string;

  /**
   * Start date of the auction
   */
  @Column('timestamptz')
  startDate: Date;

  /**
   * Duration of the auction (in seconds)
   */
  @Column('int')
  duration: number;

  /**
   * Start price of the auction
   */
  @Column('money')
  startPrice: number;

  @ApiHideProperty()
  private readonly observers: IObserver<AuctionEntity>[] = [];

  attach(observer: IObserver<AuctionEntity>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return;
    }
    this.observers.push(observer);
  }

  detach(observer: IObserver<AuctionEntity>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return;
    }
    this.observers.splice(observerIndex, 1);
  }

  notify(): void {
    this.observers.forEach((observer) => observer.update(this));
  }
}
