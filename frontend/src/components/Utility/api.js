import { useEffect, useState } from 'react' 
import axios from 'axios'

export const generateApi = (authToken) => {
    const api = axios.create({
        baseURL: 'http://localhost:5000/',
        headers: {
            "auth-token": authToken
        }
    })

    return api
}


export const useApiGet = (api, url) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    // getting the data from the url provided
    // equivalent to component did mount
    useEffect(()=>{
        const getData = async () => {
            try {
                setIsLoading(true)
                const result = await api.get(url)
                
                // setting the states
                setIsLoading(false)
                setData(result.data)
            } catch (error) {
                console.log(error)
    
                // setting the state
                setIsLoading(false)
            }
        }

        getData()
    }, [])

    // return the needed data
    return [isLoading, data]
}
