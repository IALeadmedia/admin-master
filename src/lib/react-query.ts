import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { HttpClientFactory } from "../helpers/adapter";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 min
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            if (error instanceof AxiosError && error.response?.status) {
                HttpClientFactory.handleErrorRequest(error.response?.status)
            }
        },
    })
})
