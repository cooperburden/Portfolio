import { useEffect, useState } from 'react'

interface TypingTextProps {
  text: string;
  onComplete?: () => void;
  shouldAnimate?: boolean;
}

const TypingText = ({ text, onComplete, shouldAnimate = true }: TypingTextProps) => {
  const [displayText, setDisplayText] = useState(shouldAnimate ? '' : text)
  
  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayText(text)
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, 150)

    return () => clearInterval(interval)
  }, [text, onComplete, shouldAnimate])

  return (
    <h1>
      {displayText}
      <span className="cursor">|</span>
    </h1>
  )
}

export default TypingText 