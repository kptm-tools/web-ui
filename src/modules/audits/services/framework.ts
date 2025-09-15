import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import type {
  MaturityLevelResponse,
  ScopeQuestionResponse,
  StructureResponse,
  SubCategoryDetail
} from '../models/framework';

export class FrameworkService {
  static readonly BASE_PATH = 'api/audits/framework';

  static async getMaturityLevels(): Promise<AxiosResponse<MaturityLevelResponse>> {
    return await gatewayApi.get(`${this.BASE_PATH}/maturity-levels`);
  }

  static async getScopeQuestions(): Promise<AxiosResponse<ScopeQuestionResponse>> {
    return await gatewayApi.get(`${this.BASE_PATH}/scope-questions`);
  }

  static async getStructure(): Promise<AxiosResponse<StructureResponse>> {
    return await gatewayApi.get(`${this.BASE_PATH}/structure`);
  }

  static async getSubcategoryById(
    subcategoryId: string
  ): Promise<AxiosResponse<SubCategoryDetail>> {
    return await gatewayApi.get(`${this.BASE_PATH}/subcategories/${subcategoryId}`);
  }
}
