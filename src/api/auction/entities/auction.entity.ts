import {
  AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { ISubject } from '../../../common/observer/subject.interface';
import { IObserver } from '../../../common/observer/observer.interface';
import assert from '../../../common/assert';
import { UserEntity } from '../../user/entities/user.entity';
import { AuctionStatusEnum } from '../enums/auction-status.enum';
import { BidEntity } from '../../bid/entities/bid.entity';
import { BidStatusEnum } from '../../bid/enums/bid-status.enum';
import { LotEntity } from '../../lot/entities/lot.entity';

@Entity()
export class AuctionEntity extends AppBaseEntity implements ISubject {
  @ApiHideProperty()
  @Exclude()
  private readonly observers: IObserver<AuctionEntity>[] = [];

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
   * Extension of the auction (in seconds)
   * @default 0
   */
  @Column('int', { default: 0 })
  extension: number = 0;

  /**
   * Start price of the auction
   */
  @Column('float')
  startPrice: number;

  /**
   * Current price of the auction
   */
  @Column('float')
  currentPrice: number;

  /**
   * Remaining time of the auction (in seconds)
   */
  @Column('int', { default: 0 })
  remainingTime: number;

  /**
   * Auction status
   * @enum AuctionStatusEnum
   */
  @Column('enum', { enum: AuctionStatusEnum, default: AuctionStatusEnum.NOT_STARTED })
  status: AuctionStatusEnum;

  /**
   * Lot of the auction
   */
  @ManyToOne(() => LotEntity, { eager: true })
  lot: LotEntity;

  /**
   * Auction owner
   */
  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  /**
   * Auction winner
   */
  @ManyToOne(() => UserEntity, {
    nullable: true,
    eager: true,
  })
  winner?: UserEntity;

  @BeforeInsert()
  setCurrentPrice(): void {
    this.currentPrice = this.startPrice;
  }

  @BeforeInsert()
  @BeforeUpdate()
  @AfterLoad()
  calculateRemainingTimeAndUpdateStatus(): void {
    const timeDifference = Math.floor((new Date().getTime() - this.startDate.getTime()) / 1000);
    this.remainingTime = this.duration - timeDifference;

    if (this.remainingTime <= 0) {
      this.status = AuctionStatusEnum.FINISHED;
    } else if (this.remainingTime <= this.extension) {
      this.status = AuctionStatusEnum.IN_PROGRESS;
    }
  }

  async decideWinner(): Promise<void> {
    assert(this.status === AuctionStatusEnum.FINISHED, new BadRequestException('Auction is not finished yet'));

    if (this.winner) {
      return;
    }

    const winnerBid = await BidEntity.findOne({
      where: {
        auction: {
          id: this.id,
        },
      },
      order: {
        price: 'DESC',
      },
    });
    assert(winnerBid, new BadRequestException('Winner bid not found'));

    winnerBid.status = BidStatusEnum.WON;
    this.winner = winnerBid.bidder;
    this.lot.owner = winnerBid.bidder;

    await this.save();
    await winnerBid.save();
    await this.lot.save();
  }

  extendDuration(): void {
    assert(
      this.status === AuctionStatusEnum.IN_PROGRESS,
      new BadRequestException('Auction is not in progress'),
    );
    if (this.remainingTime > this.extension) {
      return;
    }
    this.duration += this.extension;
  }

  extendPrice(amount: number): void {
    assert(
      this.status === AuctionStatusEnum.IN_PROGRESS,
      new BadRequestException('Auction is not in progress'),
    );
    assert(
      amount > this.currentPrice,
      new BadRequestException('New price must be greater than current price'),
    );

    this.currentPrice = amount;
  }

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
