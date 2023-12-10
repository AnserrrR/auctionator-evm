import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for skipping UserAuth check
 */
export const METADATA_PUBLIC_KEY = 'isPublic';

/**
 * Decorator for skipping UserAuth check
 */
export const Public = () => SetMetadata(METADATA_PUBLIC_KEY, true);
