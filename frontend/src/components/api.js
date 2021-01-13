import { useEffect, useState } from 'react' 
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:5000/'
})

export const useApiGet = (url) => {
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


export const useApiPost = (url, data) => {
    const [isPosted, setIsPosted] = useState(false)

    // equivalent to component did mount
    useEffect(()=>{
        // posting the data to the url provided
        const postData = async () => {
            try {
                await api.post(url, data)
                setIsPosted(true)
            } catch (error) {
                console.log(error)
                setIsPosted(false)
            }
        }
        postData()
    }, [])

    // return the needed data
    return isPosted
}
