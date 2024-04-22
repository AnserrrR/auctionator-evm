import { Column, Entity, Index, OneToMany } from "typeorm";
import { AuctionEntity } from "./AuctionEntity";
import { BidEntity } from "./BidEntity";
import { LotEntity } from "./LotEntity";

@Index("UQ_415c35b9b3b6fe45a3b065030f5", ["email"], { unique: true })
@Entity("user_entity", { schema: "public" })
export class UserEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("text", { name: "email", unique: true })
  email: string;

  @Column("enum", { name: "role", enum: ["Admin", "Manager"] })
  role: "Admin" | "Manager";

  @Column("text", { name: "password" })
  password: string;

  @Column("text", { name: "jwtKey", nullable: true })
  jwtKey: string | null;

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

  @Column("double precision", {
    name: "balance",
    precision: 53,
    default: () => "'0'",
  })
  balance: number;

  @OneToMany(() => AuctionEntity, (auctionEntity) => auctionEntity.owner)
  auctionEntities: AuctionEntity[];

  @OneToMany(() => AuctionEntity, (auctionEntity) => auctionEntity.winner)
  auctionEntities2: AuctionEntity[];

  @OneToMany(() => BidEntity, (bidEntity) => bidEntity.bidder)
  bidEntities: BidEntity[];

  @OneToMany(() => LotEntity, (lotEntity) => lotEntity.owner)
  lotEntities: LotEntity[];
}
