import { SortAndPaginationFilterDto } from '../../../common/dtos/sort-and-pagination-filter.dto';

export class LotFilterDto extends SortAndPaginationFilterDto {
  /**
   * Owner id
   */
  ownerId?: string;
}
