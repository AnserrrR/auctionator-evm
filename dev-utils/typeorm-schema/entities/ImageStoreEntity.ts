import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { LotEntity } from "./LotEntity";

@Entity("image_store_entity", { schema: "public" })
export class ImageStoreEntity {
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

  @Column("text", { name: "ext" })
  ext: string;

  @Column("timestamp with time zone", {
    name: "updatedAt",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("timestamp with time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("integer", { name: "width", nullable: true })
  width: number | null;

  @Column("integer", { name: "height", nullable: true })
  height: number | null;

  @Column("boolean", { name: "isVisible", default: () => "true" })
  isVisible: boolean;

  @Column("text", { name: "checksum", nullable: true })
  checksum: string | null;

  @Column("timestamp with time zone", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @ManyToMany(() => LotEntity, (lotEntity) => lotEntity.imageStoreEntities)
  @JoinTable({
    name: "lot_entity_images_image_store_entity",
    joinColumns: [{ name: "imageStoreEntityId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "lotEntityId", referencedColumnName: "id" }],
    schema: "public",
  })
  lotEntities: LotEntity[];
}
