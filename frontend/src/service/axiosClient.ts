"use client";
import { WarningDialog } from "@/utils/SweetAlert";
import axios from "axios";
import { signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(async function (config) {
  let accessToken = localStorage.getItem("accessToken") || "";

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      await WarningDialog({
        title: "Session Expire",
        text: error?.response?.data?.message || "",
        showConfirmButton: false,
        showCancelText: false,
        timer: 3000,
      });
      localStorage.removeItem("accessToken");
      signOut({ redirect: true });
    } else if (error.response.status === 400) {
      await WarningDialog({
        title: "Warning",
        text: error?.response?.data?.message || "",
        showConfirmButton: true,
        confirmText: "OK",
        showCancelText: false,
        timer: 3000,
      });
    }
  }
);

export default axiosInstance;
