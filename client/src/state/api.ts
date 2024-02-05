import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//This is a staple boiler plate code that is used for making api calls with redux
import { GetKpisResponse, GetProductsResponse, GetTransactionsResponse } from "./types";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),  ////so what happens here is we are basically using redux toolkit query and 
    //"createApi" to allow us make endpoints that we can use to call our backend serve also, so we can grab data from our backend as well
    //so this means VITE_BASE_URL is the url we call anytime we make an api call
    reducerPath: "main",  
    tagTypes: ["Kpis", "Products", "Transactions"],
    endpoints: (build)=> ({
        getKpis: build.query<Array<GetKpisResponse>, void>({         // esssentially we are using this endpoint to get kpis. This will set up a function
            query: () => "kpi/kpis/",   //that will grab kpis (key performance indicators) and we will be saving it into kpis tag 
            providesTags: ["Kpis"],
        }),
        getProducts: build.query<Array<GetProductsResponse>, void>({         // esssentially we are using this endpoint to get kpis. This will set up a function
            query: () => "product/products/",   //that will grab kpis (key performance indicators) and we will be saving it into kpis tag 
            providesTags: ["Products"],
        }),
        getTransactions: build.query<Array<GetTransactionsResponse>, void>({         // esssentially we are using this endpoint to get kpis. This will set up a function
            query: () => "transaction/transactions/",   //that will grab kpis (key performance indicators) and we will be saving it into kpis tag 
            providesTags: ["Transactions"],
        }),
    }),
});



export const { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } = api;
