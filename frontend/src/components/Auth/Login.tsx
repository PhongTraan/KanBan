import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "../../service/AuthService";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginSuccess = () => toast.success("Login successful!");
  const loginFailure = (message: string) => toast.error(message);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);

      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("role", response.role || "");

        loginSuccess();
        navigate("/");
      } else {
        setError("Login failed. Please check your email and password.");
        loginFailure("Login failed. Please check your email and password.");
      }
    } catch (err) {
      // Xử lý lỗi khi gọi API
      console.error("Login Error: ", err);
      setError("Login failed. Please check your email and password.");
      loginFailure("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border-2 w-[35%] bg-opacity-100 bg-slate-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 block w-full px-2 py-1.5 border rounded-md shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 block w-full px-2 py-1.5 border rounded-md shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
