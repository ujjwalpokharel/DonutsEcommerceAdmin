"use client";
import useSWR from "swr";
import axiosInstance from "../utils/axiosInstance";
export const useFetchData = <T>(url: string) => {
  const fetcher = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };
  const { data, error: isError, isLoading } = useSWR<T>(url, fetcher);
  return { data, isError, isLoading };
};
