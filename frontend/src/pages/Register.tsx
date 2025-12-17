import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth.api";
import { useNotification } from "../context/NotificationContext";
import GradientBackground from "../components/GradientBackground";

export default function Register() {
  const { show } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      show("Account created successfully");
      navigate("/login");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      show(msg);
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <GradientBackground>
      <form
        onSubmit={submit}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-3 rounded-lg bg-white/30 outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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
          Create Account
        </button>

        <p className="text-center mt-4">
          Already registered? <a href="/login" className="underline">Login</a>
        </p>
      </form>
    </GradientBackground>
  );
}
