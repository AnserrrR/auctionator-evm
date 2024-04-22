import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AuctionEntity } from "./AuctionEntity";
import { UserEntity } from "./UserEntity";
import { ImageStoreEntity } from "./ImageStoreEntity";

@Entity("lot_entity", { schema: "public" })
export class LotEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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

  @OneToMany(() => AuctionEntity, (auctionEntity) => auctionEntity.lot)
  auctionEntities: AuctionEntity[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.lotEntities)
  @JoinColumn([{ name: "ownerId", referencedColumnName: "id" }])
  owner: UserEntity;

  @ManyToMany(
    () => ImageStoreEntity,
    (imageStoreEntity) => imageStoreEntity.lotEntities
  )
  imageStoreEntities: ImageStoreEntity[];
}
