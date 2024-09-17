import axios, { AxiosResponse } from "axios";

interface LoginResponse {
  token: string;
  role: string;
}

interface RegisterResponse {}

class AuthService {
  static BASE_URL = "http://localhost:8080";

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${AuthService.BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("email", email);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Login failed:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }

  static async register(
    userData: any,
    token: string
  ): Promise<RegisterResponse> {
    try {
      const response: AxiosResponse<RegisterResponse> = await axios.post(
        `${AuthService.BASE_URL}/auth/register`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration failed:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
}

export default AuthService;
