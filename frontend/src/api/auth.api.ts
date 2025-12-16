import { api } from "./axios";

export const loginApi = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data.user;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getUsersApi = async () => {
  const res = await api.get("/auth/users");
  return res.data.users;
};

export const updateProfileApi = async (data: { name?: string; email?: string; password?: string }) => {
  const res = await api.put("/auth/profile", data);
  return res.data.user;
};
