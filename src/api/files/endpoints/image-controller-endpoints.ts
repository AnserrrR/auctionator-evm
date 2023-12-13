import { insertParamsIntoUrl } from '../../../common/insert-params-into-url';
import type { ImageStoreEntity } from '../entities/image-store.entity';

/**
 * Endpoints of ImageController.
 */
class ImageControllerEndpointsClass {
  public readonly rootEndpoint = '/images' as const;

  public readonly childImageView = '/image/:imageName' as const;

  public readonly childImageDownload = '/:imageName' as const;

  public readonly childAvatarGet = '/avatar/:imageName' as const;

  public readonly childImageUpload = '/upload' as const;

  public readonly childImageUpdate = '/update/:imageName/:angle' as const;

  /**
   * View an image
   */
  public imageView(image: Pick<ImageStoreEntity, 'id' | 'ext'>): string {
    return insertParamsIntoUrl(this.rootEndpoint + this.childImageView, { imageName: image.id + image.ext });
  }

  /**
   * Download an image
   */
  public imageDownload(image: Pick<ImageStoreEntity, 'id' | 'ext'>): string {
    return insertParamsIntoUrl(this.rootEndpoint + this.childImageDownload, { imageName: image.id + image.ext });
  }

  /**
   * View an avatar
   */
  public avatarGet(image: Pick<ImageStoreEntity, 'id' | 'ext'>): string {
    return insertParamsIntoUrl(this.rootEndpoint + this.childAvatarGet, { imageName: image.id + image.ext });
  }

  /**
   * Upload an image
   */
  public imageUpload = `${this.rootEndpoint}${this.childImageUpload}` as const;

  /**
   * Update an image
   */
  public imageUpdate(image: Pick<ImageStoreEntity, 'id' | 'ext'>, angle: number): string {
    return insertParamsIntoUrl(this.rootEndpoint + this.childImageUpdate, { imageName: image.id + image.ext, angle });
  }
}

export const ImageControllerEndpoints = new ImageControllerEndpointsClass();
