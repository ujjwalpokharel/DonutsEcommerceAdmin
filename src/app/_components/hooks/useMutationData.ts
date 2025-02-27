import useSWRMutation from "swr/mutation";
import axiosInstance from "../utils/axiosInstance";

export const usePostData = <TArgs, TResponse>(url: string) => {
  const postData = async (
    url: string,
    data: TArgs,
    method: "POST" | "PATCH" | "DELETE" = "POST"
  ) => {
    let response;
    if (method === "PATCH") {
      response = await axiosInstance.patch(`${url}/${data?.id}`, data);
    } else if (method === "DELETE") {
      response = await axiosInstance.delete(`${url}/${data?.id}`);
    } else {
      // Default to POST method
      response = await axiosInstance.post(url, data);
    }

    return response.data as TResponse;
  };

  const { trigger: mutatePost, isMutating } = useSWRMutation<
    TResponse,
    unknown
  >(
    url,
    (
      url: string,
      { arg }: { arg: { data: TArgs; method?: "POST" | "PATCH" } }
    ) => {
      return postData(url, arg.data, arg.method); // Pass method along with data
    }
  );

  return { mutatePost, isMutating };
};
