import type { AxiosResponse } from 'axios';
import { auditsApi } from 'src/boot/axios';
import type {
  MaturityLevelResponse,
  ScopeQuestionResponse,
  StructureResponse,
  SubCategoryDetail
} from '../models/framework';

export class FrameworkService {
  static readonly BASE_PATH = 'framework';

  static async getMaturityLevels(): Promise<AxiosResponse<MaturityLevelResponse>> {
    return await auditsApi.get(`${this.BASE_PATH}/maturity-levels`);
  }

  static async getScopeQuestions(): Promise<AxiosResponse<ScopeQuestionResponse>> {
    return await auditsApi.get(`${this.BASE_PATH}/scope-questions`);
  }

  static async getStructure(): Promise<AxiosResponse<StructureResponse>> {
    return await auditsApi.get(`${this.BASE_PATH}/structure`);
  }

  static async getSubcategoryById(
    subcategoryId: string
  ): Promise<AxiosResponse<SubCategoryDetail>> {
    return await auditsApi.get(`${this.BASE_PATH}/subcategories/${subcategoryId}`);
  }
}
