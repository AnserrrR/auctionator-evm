import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AuctionEntity } from "./AuctionEntity";
import { UserEntity } from "./UserEntity";

@Entity("bid_entity", { schema: "public" })
export class BidEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("timestamp with time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updatedAt",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("timestamp with time zone", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("money", { name: "price" })
  price: string;

  @Column("enum", {
    name: "status",
    enum: ["ACTIVE", "LOST", "WON"],
    default: () => "'ACTIVE'",
  })
  status: "ACTIVE" | "LOST" | "WON";

  @ManyToOne(() => AuctionEntity, (auctionEntity) => auctionEntity.bidEntities)
  @JoinColumn([{ name: "auctionId", referencedColumnName: "id" }])
  auction: AuctionEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.bidEntities)
  @JoinColumn([{ name: "bidderId", referencedColumnName: "id" }])
  bidder: UserEntity;
}
