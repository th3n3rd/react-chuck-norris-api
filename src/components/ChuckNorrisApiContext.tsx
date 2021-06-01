import React, {createContext, useContext} from "react";
import {ChuckNorrisApi} from "./ChuckNorrisApi";

const ChuckNorrisContext = createContext<ChuckNorrisApi | undefined>(undefined)

interface Props {
    children: React.ReactNode
    apiClient: ChuckNorrisApi
}

export const ChuckNorrisApiProvider = ({ children, apiClient } : Props) => {
    return <ChuckNorrisContext.Provider value={apiClient}>
        {children}
    </ChuckNorrisContext.Provider>
}

export const useChuckNorrisApi = (): ChuckNorrisApi => {
    const apiClient = useContext(ChuckNorrisContext)
    if (apiClient === undefined) {
        throw new Error("ChuckNorrisApi not found")
    }
    return apiClient
}
