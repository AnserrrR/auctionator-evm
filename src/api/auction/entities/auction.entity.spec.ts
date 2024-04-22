import { BadRequestException } from '@nestjs/common';
import { AuctionEntity } from './auction.entity';
import { AuctionStatusEnum } from '../enums/auction-status.enum';
import { BidEntity } from '../../bid/entities/bid.entity';
import { BidStatusEnum } from '../../bid/enums/bid-status.enum';
import { LotEntity } from '../../lot/entities/lot.entity';
import { UserEntity } from '../../user/entities/user.entity';

describe('AuctionEntity', () => {
  describe('setCurrentPrice', () => {
    it('should set current price to start price before insert', () => {
      const auction = new AuctionEntity();
      auction.startPrice = 100;
      auction.setCurrentPrice();
      expect(auction.currentPrice).toBe(100);
    });
  });

  describe('calculateRemainingTimeAndUpdateStatus', () => {
    it('should update remaining time and status correctly', () => {
      const auction = new AuctionEntity();
      auction.startDate = new Date();
      auction.duration = 3600; // 1 hour
      auction.extension = 300; // 5 minutes

      const currentDate = new Date();
      const fiveMinutesAgo = new Date(currentDate.getTime() - 5 * 60 * 1000);
      auction.startDate = fiveMinutesAgo;

      auction.calculateRemainingTimeAndUpdateStatus();

      expect(auction.remainingTime).toBe(3600 - 300);
      expect(auction.status).toBe(AuctionStatusEnum.IN_PROGRESS);
    });

    it('should set status to FINISHED when remaining time is 0', () => {
      const auction = new AuctionEntity();
      auction.startDate = new Date();
      auction.duration = 0;
      auction.calculateRemainingTimeAndUpdateStatus();
      expect(auction.status).toBe(AuctionStatusEnum.FINISHED);
    });
  });

  describe('extendDuration', () => {
    it('should extend the duration if the auction is in progress and remaining time is less than extension', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.IN_PROGRESS;
      auction.remainingTime = 5;
      auction.extension = 10;
      auction.duration = 10;

      auction.extendDuration();

      expect(auction.duration).toBe(10 + 10);
    });

    it('should not extend the duration if the auction is not in progress', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.NOT_STARTED;
      auction.remainingTime = 10;
      auction.extension = 5;
      auction.duration = 10;

      expect(() => auction.extendDuration()).toThrow(
        new BadRequestException('Auction is not in progress'),
      );

      expect(auction.duration).toBe(10); // Duration remains unchanged
    });

    it('should not extend the duration if remaining time is greater than extension', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.IN_PROGRESS;
      auction.remainingTime = 10;
      auction.extension = 15;
      auction.duration = 10;

      expect(auction.duration).toBe(10); // Duration remains unchanged
    });
  });

  describe('extendPrice', () => {
    it('should extend the current price if the auction is in progress and the new price is greater', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.IN_PROGRESS;
      auction.currentPrice = 100;

      auction.extendPrice(150);

      expect(auction.currentPrice).toBe(150);
    });

    it('should not extend the current price if the auction is not in progress', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.NOT_STARTED;
      auction.currentPrice = 100;

      expect(() => auction.extendPrice(150)).toThrow(
        new BadRequestException('Auction is not in progress'),
      );

      expect(auction.currentPrice).toBe(100); // Current price remains unchanged
    });

    it('should not extend the current price if the new price is not greater', () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.IN_PROGRESS;
      auction.currentPrice = 100;

      expect(() => auction.extendPrice(90)).toThrow(
        new BadRequestException('New price must be greater than current price'),
      );

      expect(auction.currentPrice).toBe(100); // Current price remains unchanged
    });
  });

  describe('decideWinner', () => {
    it('should set the winner and update bid status if the auction is finished and there is a winner bid', async () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.FINISHED;
      auction.lot = new LotEntity();

      const winnerBid = new BidEntity();
      winnerBid.price = 150;

      jest.spyOn(BidEntity, 'findOne').mockResolvedValueOnce(winnerBid);
      jest.spyOn(winnerBid, 'save').mockResolvedValueOnce(winnerBid);
      jest.spyOn(auction, 'save').mockResolvedValueOnce(auction);
      jest.spyOn(auction.lot, 'save').mockResolvedValueOnce(auction.lot);

      await auction.decideWinner();

      expect(auction.winner).toBe(winnerBid.bidder);
      expect(winnerBid.status).toBe(BidStatusEnum.WON);
      expect(auction.lot.owner).toBe(winnerBid.bidder);
    });

    it('should do nothing if the auction is not finished', async () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.IN_PROGRESS;

      jest.spyOn(BidEntity, 'findOne').mockResolvedValueOnce(null);

      await expect(auction.decideWinner())
        .rejects
        .toThrow(
          new BadRequestException('Auction is not finished yet'),
        );

      expect(auction.winner).toBeUndefined();
    });

    it('should do nothing if there is already a winner', async () => {
      const auction = new AuctionEntity();
      auction.status = AuctionStatusEnum.FINISHED;
      auction.winner = new UserEntity();

      jest.spyOn(BidEntity, 'findOne').mockResolvedValueOnce(null);

      await auction.decideWinner();

      expect(auction.winner).toBeDefined();
    });
  });
});
