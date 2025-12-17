import { api } from "./axios";

export const loginApi = async (data: { email: string; password: string }) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const registerApi = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/api/auth/profile");
  return res.data.user;
};

export const logoutApi = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

export const getUsersApi = async () => {
  const res = await api.get("/api/auth/users");
  return res.data.users;
};

export const updateProfileApi = async (data: { name?: string; email?: string; password?: string }) => {
  const res = await api.put("/api/auth/profile", data);
  return res.data.user;
};
