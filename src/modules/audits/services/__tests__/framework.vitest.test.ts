/* eslint-disable @typescript-eslint/unbound-method */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { FrameworkService } from '../framework';
import {
  QuestionType,
  type MaturityLevelResponse,
  type ScopeQuestionResponse,
  type StructureResponse,
  type SubCategoryDetail
} from '../../models/framework'; // Assuming types are located here as per the original service file

// Mock the external gatewayApi
vi.mock('src/boot/axios', () => {
  const gatewayApi = {
    get: vi.fn()
  };
  return { gatewayApi };
});

// Import the mocked axios instance
// The import is handled by the mock above, but this line is good for type safety
// import { gatewayApi } from 'src/boot/axios';

describe('FrameworkService', () => {
  // Use a mock response object that matches the AxiosResponse shape
  const mockAxiosResponse = (data: unknown): AxiosResponse => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig
  });

  // Reset the mock functions before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getMaturityLevels and return data', async () => {
    const mockData: MaturityLevelResponse = {
      levels: [
        { level: 1, title: 'Level 1', description: 'desc 1' },
        { level: 2, title: 'Level 2', description: 'desc 2' }
      ]
    };
    // Mock the get method to resolve with our mock response

    (gatewayApi.get as vi.Mock).mockResolvedValue(mockAxiosResponse(mockData));

    // Call the service method
    const response = await FrameworkService.getMaturityLevels();

    // Assert that the API was called with the correct URL
    expect(gatewayApi.get).toHaveBeenCalledWith('api/audits/framework/maturity-levels');
    // Assert that the correct data was returned
    expect(response.data).toEqual(mockData);
  });

  it('should call getScopeQuestions and return data', async () => {
    const mockData: ScopeQuestionResponse = {
      questions: [
        { code: 'q1', label: 'Question 1', question_type: QuestionType.TEXT },
        { code: 'q2', label: 'Question 2', question_type: QuestionType.NUMBER }
      ]
    };
    (gatewayApi.get as vi.Mock).mockResolvedValue(mockAxiosResponse(mockData));

    const response = await FrameworkService.getScopeQuestions();

    expect(gatewayApi.get).toHaveBeenCalledWith('api/audits/framework/scope-questions');
    expect(response.data).toEqual(mockData);
  });

  it('should call getStructure and return data', async () => {
    const mockData: StructureResponse = {
      functions: [{ code: 'f1', description: 'desc', name: 'func 1', categories: [] }]
    };
    (gatewayApi.get as vi.Mock).mockResolvedValue(mockAxiosResponse(mockData));

    const response = await FrameworkService.getStructure();

    expect(gatewayApi.get).toHaveBeenCalledWith('api/audits/framework/structure');
    expect(response.data).toEqual(mockData);
  });

  it('should call getSubcategoryById with the correct ID', async () => {
    const mockId = 'sub-123';
    const mockData: SubCategoryDetail = {
      code: mockId,
      name: 'Subcategory 123',
      description: 'Test description',
      evidence_examples: [],
      implementation_details: []
    };
    (gatewayApi.get as vi.Mock).mockResolvedValue(mockAxiosResponse(mockData));

    const response = await FrameworkService.getSubcategoryById(mockId);

    // Assert that the API was called with the correct dynamic URL
    expect(gatewayApi.get).toHaveBeenCalledWith(`api/audits/framework/subcategories/${mockId}`);
    expect(response.data).toEqual(mockData);
  });
});
