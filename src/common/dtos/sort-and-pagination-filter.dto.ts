export class SortAndPaginationFilterDto {
  /**
   * Sorting (orderBy)
   */
  sort?: string;

  /**
   * Skip
   */
  skip?: number;

  /**
   * Take
   */
  take?: number;
}
