import { describe, expect, it, vi } from 'vitest';
import { authenticateUser, logoutUser } from '../auth.service'; // Adjust path as needed
import { fusionAuthApi } from 'boot/axios';
import {
  FusionAuthLoginBody,
  FusionAuthLoginResponse,
  FusionAuthLogout,
  FusionAuthLogoutHeaders,
  SuccessAuthLoginUser
} from 'src/models/fusion-auth.models';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

// Mock the axios instance
vi.mock('src/boot/axios', () => ({
  fusionAuthApi: {
    post: vi.fn()
  }
}));

describe('FusionAuth API Service', () => {
  describe('authenticateUser', () => {
    it('should call the /api/login endpoint with the correct parameters', async () => {
      // Arrange
      const body: FusionAuthLoginBody = {
        applicationId: 'appId',
        loginId: 'testuser',
        password: 'testpassword'
      };
      const mockResponse: AxiosResponse<FusionAuthLoginResponse> = {
        data: {
          token: 'mockToken',
          tokenExpirationInstant: 1,
          user: {} as SuccessAuthLoginUser
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders }
      };
      (fusionAuthApi.post as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse
      );

      // Act
      const response = await authenticateUser(body);

      // Assert
      expect(fusionAuthApi.post).toHaveBeenCalledWith('/api/login', body, {
        headers: {
          Authorization: process.env.FUSION_APP_TOKE
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error if the API call fails', async () => {
      // Arrange
      const body: FusionAuthLoginBody = {
        loginId: 'testuser',
        password: 'wrongpassword'
      };
      const mockError = new Error('Login failed');
      (fusionAuthApi.post as ReturnType<typeof vi.fn>).mockRejectedValue(
        mockError
      );

      // Act & Assert
      await expect(authenticateUser(body)).rejects.toThrow('Login failed');
    });
  });

  describe('logoutUser', () => {
    it('should call the /api/logout endpoint with the correct parameters', async () => {
      // Arrange
      const body: FusionAuthLogout = {};
      const headers: FusionAuthLogoutHeaders = {
        Authorization: process.env.FUSION_APP_TOKEN
      } as AxiosRequestHeaders;
      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders }
      };
      (fusionAuthApi.post as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse
      );

      // Act
      const response = await logoutUser(body, headers);

      // Assert
      expect(fusionAuthApi.post).toHaveBeenCalledWith('/api/logout', body, {
        headers
      });
      expect(response).toEqual(mockResponse);
    });

    it('should handle undefined body and headers', async () => {
      // Arrange
      const mockResponse: AxiosResponse<void> = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders }
      };
      (fusionAuthApi.post as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse
      );

      // Act
      const response = await logoutUser();

      // Assert
      expect(fusionAuthApi.post).toHaveBeenCalledWith(
        '/api/logout',
        undefined,
        { headers: undefined }
      );
      expect(response).toEqual(mockResponse);
    });
  });
});
