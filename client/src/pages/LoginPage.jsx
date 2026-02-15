import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

// Original design inspired by Zouraiz

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, login, signinWithGoogle, error } = useAuth();

  const navigate = useNavigate();

  // Prevent default form submission for the demo
  const handleEmailAuth = async (e) => {
    //True = login
    //False = signup
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate("/");
        console.log("User Logged in successfull");
      } else {
        if (password !== confirmPassword) {
          return alert("Please Confirm your password");
        }
        await signup(email, password);
        navigate("/");
        console.log("User Signup successfull");
      }
    } catch (error) {
      console.log("Error in Login/Signup", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signinWithGoogle();
      navigate("/");
      console.log("Signedin With Google successfully");
    } catch (error) {
      console.log("Error SignIn With Google", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container: Centers the form and applies the background gradient
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-[#003366] via-[#004080] to-[#0073e6] p-4 font-['Poppins',sans-serif]">
      {/* Main Form Wrapper */}
      <div className="w-full max-w-[390px] bg-white p-8 rounded-2xl shadow-[0_15px_20px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Title Section (Slides based on state) */}
        <div className="overflow-hidden w-full">
          <div
            className={`flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
              isLogin ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            <div className="w-1/2 text-[35px] font-semibold text-center">
              Login Form
            </div>
            <div className="w-1/2 text-[35px] font-semibold text-center">
              Signup Form
            </div>
          </div>
        </div>

        {/* Slide Controls (Toggle Buttons) */}
        <div className="relative flex h-[50px] w-full mt-7 mb-2 border border-gray-300 rounded-[15px] overflow-hidden">
          {/* Sliding Background Tab */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-linear-to-r from-[#003366] via-[#004080] to-[#0073e6] rounded-[15px] transition-transform duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-0 ${
              isLogin ? "translate-x-0" : "translate-x-full"
            }`}
          ></div>

          {/* Login Label */}
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 z-10 text-[18px] font-medium transition-colors duration-500 ${
              isLogin
                ? "text-white cursor-default"
                : "text-black cursor-pointer"
            }`}
          >
            Login
          </button>

          {/* Signup Label */}
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 z-10 text-[18px] font-medium transition-colors duration-500 ${
              !isLogin
                ? "text-white cursor-default"
                : "text-black cursor-pointer"
            }`}
          >
            Signup
          </button>
        </div>
        {error && (
          <div className="border border-red-500 p-3 rounded-2xl bg-red-50 text-red-500">
            {error}
          </div>
        )}

        {/* Forms Container */}
        <div className="w-full overflow-hidden mt-5">
          <div
            className={`flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
              isLogin ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            {/* Login Form */}
            <form onSubmit={handleEmailAuth} className="w-1/2 px-1">
              <div className="h-[50px] w-full mt-5">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email Address"
                  required
                  className="h-full w-full outline-none pl-4 rounded-[15px] border border-gray-300 border-b-2 text-[17px] transition-colors duration-300 focus:border-[#1a75ff] placeholder-gray-400 focus:placeholder-[#1a75ff]"
                />
              </div>
              <div className="h-[50px] w-full mt-5">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="h-full w-full outline-none pl-4 rounded-[15px] border border-gray-300 border-b-2 text-[17px] transition-colors duration-300 focus:border-[#1a75ff] placeholder-gray-400 focus:placeholder-[#1a75ff]"
                />
              </div>
              <div className="text-center mt-7 text-[15px]">
                Not a member?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#1a75ff] hover:underline decoration-[#1a75ff]"
                >
                  Signup now
                </button>
              </div>

              {/* Animated Submit Button */}
              <div className="relative h-[50px] w-full mt-5 rounded-[15px] overflow-hidden group">
                <div className="absolute -left-full h-full w-[300%] bg-linear-to-r from-[#003366] via-[#0059b3] to-[#0073e6] rounded-[15px] transition-all duration-400 ease-in-out group-hover:left-0"></div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="relative z-10 h-full w-full bg-transparent border-none text-white text-[20px] font-medium cursor-pointer"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <hr className="w-full border-[#003366]" />
                <p className="text-sm text-[#0059b3] text-center">or</p>
                <hr className="w-full border-[#0073e6]" />
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                type="button"
                className="w-full flex items-center justify-center gap-4 py-2.5 px-6 text-[15px] font-medium tracking-wide text-[#003366] border-2 border-[#0059b3] rounded-[15px] bg-white hover:bg-[#0073e6] hover:border-white hover:text-white focus:outline-none cursor-pointer transition-all"
              >
                <svg
                  xmlns="http://www.w3.org"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.1 2.35 30.07 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C14.65 13.92 18.88 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.19h12.45c-.53 2.72-2.07 5.02-4.18 6.59l7.98 6.19c4.64-4.32 7.32-10.14 7.32-17.43z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.55 10.78l7.98-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.07 1.35-4.73 2.15-7.91 2.15-5.12 0-9.44-3.44-10.94-8.08l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                {isLoading ? "Loading..." : "Continue with Google"}
              </button>
            </form>

            {/*------------------------------------------------------------------------------------------------------------------------------------ */}

            {/* Signup Form */}
            <form onSubmit={handleEmailAuth} className="w-1/2 px-1">
              <div className="h-[50px] w-full mt-5">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email Address"
                  required
                  className="h-full w-full outline-none pl-4 rounded-[15px] border border-gray-300 border-b-2 text-[17px] transition-colors duration-300 focus:border-[#1a75ff] placeholder-gray-400 focus:placeholder-[#1a75ff]"
                />
              </div>
              <div className="h-[50px] w-full mt-5">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="h-full w-full outline-none pl-4 rounded-[15px] border border-gray-300 border-b-2 text-[17px] transition-colors duration-300 focus:border-[#1a75ff] placeholder-gray-400 focus:placeholder-[#1a75ff]"
                />
              </div>
              <div className="h-[50px] w-full mt-5">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm password"
                  required
                  className="h-full w-full outline-none pl-4 rounded-[15px] border border-gray-300 border-b-2 text-[17px] transition-colors duration-300 focus:border-[#1a75ff] placeholder-gray-400 focus:placeholder-[#1a75ff]"
                />
              </div>

              {/* Animated Submit Button */}
              <div className="relative h-[50px] w-full mt-5 rounded-[15px] overflow-hidden group">
                <div className="absolute -left-full h-full w-[300%] bg-linear-to-r from-[#003366] via-[#0059b3] to-[#0073e6] rounded-[15px] transition-all duration-400 ease-in-out group-hover:left-0"></div>
                <button
                  disabled={isLoading}
                  type="submit"
                  value="Sign up"
                  className="relative z-10 h-full w-full bg-transparent border-none text-white text-[20px] font-medium cursor-pointer"
                >
                  {isLoading ? "Signing in..." : "Signup"}
                </button>
              </div>
              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <hr className="w-full border-[#003366]" />
                <p className="text-sm text-[#0059b3] text-center">or</p>
                <hr className="w-full border-[#0073e6]" />
              </div>

              {/* Google Button */}
              <button
                disabled={isLoading}
                onClick={handleGoogle}
                type="button"
                className="w-full flex items-center justify-center gap-4 py-2.5 px-6 text-[15px] font-medium tracking-wide text-[#003366] border-2 border-[#0059b3] rounded-[15px] bg-white hover:bg-[#0073e6] hover:border-white hover:text-white focus:outline-none cursor-pointer transition-all"
              >
                <svg
                  xmlns="http://www.w3.org"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.1 2.35 30.07 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C14.65 13.92 18.88 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.19h12.45c-.53 2.72-2.07 5.02-4.18 6.59l7.98 6.19c4.64-4.32 7.32-10.14 7.32-17.43z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.55 10.78l7.98-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.07 1.35-4.73 2.15-7.91 2.15-5.12 0-9.44-3.44-10.94-8.08l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                {isLoading ? "Loading..." : "Continue with Google"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
