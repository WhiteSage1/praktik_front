import { useState, useEffect } from 'react'

export const usePersist = (key, value) => {
    // default to true (trust this device) when no value is stored
    const stored = localStorage.getItem("persist")
    const initial = stored !== null ? JSON.parse(stored) : true
    const [persist, setPersist] = useState(initial)

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}

export default usePersist