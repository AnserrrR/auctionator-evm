import { insertParamsIntoUrl } from '../../../common/insert-params-into-url';
import { FileStoreEntity } from '../entities/file-store.entity';

/**
 * Endpoints of FilesController.
 */
class FilesControllerEndpointsClass {
  public readonly rootEndpoint = '/files' as const;

  public readonly childFileUpload = '/upload' as const;

  public readonly childFileGet = '/:id' as const;

  /**
   * Upload a file
   */
  public fileUpload = `${this.rootEndpoint}${this.childFileUpload}` as const;

  /**
   * Download a file
   */
  public fileGet(file: Pick<FileStoreEntity, 'id' | 'ext'>): string {
    return insertParamsIntoUrl(this.rootEndpoint + this.childFileGet, { id: file.id + file.ext });
  }
}

/**
 * Endpoints of FilesController.
 */
export const FilesControllerEndpoints = new FilesControllerEndpointsClass();
