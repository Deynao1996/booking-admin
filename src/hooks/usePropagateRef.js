import { useEffect, useRef } from 'react'

export const usePropagateRef = (props) => {
  const { name, value, setFieldValue } = props

  const flagRef = useRef(true)
  useEffect(() => {
    if (flagRef.current) {
      flagRef.current = false
      return
    }
    setFieldValue(value)
  }, [name])
}
