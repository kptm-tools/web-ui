import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type {
  MaturityLevelResponse,
  ScopeQuestionResponse,
  StructureResponse,
  SubCategoryDetail
} from '../models/framework';

export class FrameworkService {
  private static readonly GATEWAY_PATH = 'api/audits/framework';

  static async getMaturityLevels(): Promise<AxiosResponse<MaturityLevelResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'maturity-levels'));
  }

  static async getScopeQuestions(): Promise<AxiosResponse<ScopeQuestionResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'scope-questions'));
  }

  static async getStructure(): Promise<AxiosResponse<StructureResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'structure'));
  }

  static async getSubcategoryByCode(
    subcategoryCode: string
  ): Promise<AxiosResponse<SubCategoryDetail>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'subcategories', subcategoryCode));
  }
}
