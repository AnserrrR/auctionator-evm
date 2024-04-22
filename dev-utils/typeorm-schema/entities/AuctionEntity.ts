import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { LotEntity } from "./LotEntity";
import { UserEntity } from "./UserEntity";
import { BidEntity } from "./BidEntity";

@Entity("auction_entity", { schema: "public" })
export class AuctionEntity {
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

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("timestamp with time zone", { name: "startDate" })
  startDate: Date;

  @Column("integer", { name: "duration" })
  duration: number;

  @Column("integer", { name: "extension", default: () => "0" })
  extension: number;

  @Column("integer", { name: "remainingTime", default: () => "0" })
  remainingTime: number;

  @Column("double precision", { name: "startPrice", precision: 53 })
  startPrice: number;

  @Column("double precision", { name: "currentPrice", precision: 53 })
  currentPrice: number;

  @Column("enum", {
    name: "status",
    enum: ["NOT_STARTED", "IN_PROGRESS", "FINISHED"],
    default: () => "'NOT_STARTED'",
  })
  status: "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";

  @ManyToOne(() => LotEntity, (lotEntity) => lotEntity.auctionEntities)
  @JoinColumn([{ name: "lotId", referencedColumnName: "id" }])
  lot: LotEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.auctionEntities)
  @JoinColumn([{ name: "ownerId", referencedColumnName: "id" }])
  owner: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.auctionEntities2)
  @JoinColumn([{ name: "winnerId", referencedColumnName: "id" }])
  winner: UserEntity;

  @OneToMany(() => BidEntity, (bidEntity) => bidEntity.auction)
  bidEntities: BidEntity[];
}
