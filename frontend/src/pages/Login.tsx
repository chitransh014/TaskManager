import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import GradientBackground from "../components/GradientBackground";

export default function Login() {
  const { setUser, fetchProfile } = useAuth();
  const { show } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Login failed";
      show(msg);
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <GradientBackground>
      <form
        onSubmit={submit}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/30 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 rounded-lg bg-white/30 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg mt-3"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="underline">Register</a>
        </p>
      </form>
    </GradientBackground>
  );
}
