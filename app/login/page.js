
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner"; // Or whatever toast library you're using
import axios from "axios";

export default function Page() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // Password format check (ddmmyyyy)
    if(!password || !employeeId){
      toast.error("Please enter employeeId and password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password should be in ddmmyyyy format.");
      return;
    }

    try {
      const response = await axios.post('https://feedbackrml.vercel.app/user/login', { employeeId, password });
      // console.log("data", response.data.data);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        const userDetails = {
          userId: response.data.data.user._id,
          empId: response.data.data.user.employeeId
        };
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        toast.success("Logged in successfully");
        router.push("/feedbackTable");
      }
    } catch (err) {
      console.log("error", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Toaster position="top-right" autoClose={3000}/>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Login
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Enter your Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="rounded-xl"
              />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
              />
              <Button
                onClick={handleLogin}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition rounded-xl"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

