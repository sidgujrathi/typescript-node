import { Application, Request, Response } from 'express';
import { BaseApi } from '../BaseAPI';
import { ensureAuth, IReqAuth } from '../../middleware/auth';
import { ResponseHelper } from '../../helpers/response.helper';
import upload from '../../helpers/imageUploader';

export class CommonApi extends BaseApi {
  constructor() {
    super();
    this.init();
  }

  /**
   * register
   * @param express
   */
  public register(express: Application) {
    express.use('/api', this.router);
  }

  public async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const data = {
        fileName: req.file.filename,
      };
      const result: ResponseHelper = ResponseHelper.successResponse(data);
      res.status(200).send(result);
    } catch (error) {
      const result: ResponseHelper = ResponseHelper.errorResponse(error);
      res.status(200).send(result);
    }
  }

  private init(): void {
    this.router.post('/images', ensureAuth, upload.single('file'), this.uploadImage);
  }
}
