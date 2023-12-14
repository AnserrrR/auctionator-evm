export class LotUpdateDto {
  /**
   * Lot id
   */
  id: string;

  /**
   * Name
   */
  name?: string;

  /**
   * Description
   */
  description?: string;

  /**
   * ImageIds
   */
  imageIds?: string[];

  /**
   * OwnerId (new owner)
   */
  ownerId?: string;
}
