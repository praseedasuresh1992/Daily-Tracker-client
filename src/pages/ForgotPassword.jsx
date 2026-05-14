import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  console.log("welcome")

  // SEND OTP
  const handleSendOTP = async () => {

    try {

      const res = await API.post(
        "auth/send-reset-otp",
        { email }
      );

      alert(res.data.message);

      setStep(2);

    } catch (error) {

      alert(error.response?.data?.message);
    }
  };
  const handleLogin=()=>{
    navigate("/login")
  }

  // VERIFY OTP + RESET PASSWORD
  const handleResetPassword = async () => {

    try {

      const res = await API.post(
        "auth/reset-password-otp",
        {
          email,
          otp,
          password,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mb-4 p-3 border rounded-lg"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
            >
              Send OTP
            </button>
            <button type="button" className="w-full text-green-500 bg-white mt-5 py-3  underline  hover:text-green-600" 
            onClick={handleLogin}>
          Want to login?
        </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-4 p-3 border rounded-lg"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-4 p-3 border rounded-lg"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-500 text-white py-3 rounded-lg"
            >
              Reset Password
            </button>
            
          </>
        )}
      </div>
    </div>
  );
}