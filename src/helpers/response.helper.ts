export class ResponseHelper {
  /**
   * successResponse
   */
  public static successResponse(docs: any): any {
    if (Array.isArray(docs)) {
      return { success: true, items: docs };
    } else {
      return { success: true, item: docs };
    }
  }

  /**
   * errorResponse
   */
  public static errorResponse(error: any): any {
    if (error.hasOwnProperty('message')) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error };
    }
  }
}
