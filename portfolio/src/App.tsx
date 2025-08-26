import { useEffect, useState } from 'react'
import './App.css'
import TypingText from './components/TypingText'
import ProjectsSection from './components/ProjectsSection'
import RapNameGenerator from './components/RapNameGenerator'
import { projects } from './data/projects'

function App() {
  const [showProjects, setShowProjects] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)
  
  useEffect(() => {
    // Add Fira Code font
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  const handleTypingComplete = () => {
    setHasTyped(true)
    setTimeout(() => {
      setShowProjects(true)
    }, 500)
  }

  return (
    <div className="app">
      <div className="content">
        <TypingText 
          text="cooper burden" 
          onComplete={handleTypingComplete}
          shouldAnimate={!hasTyped}
        />
        <ProjectsSection 
          show={showProjects} 
          projects={projects}
        />
      </div>
    </div>
  )
}

export default App
