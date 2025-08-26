import { useState } from 'react'

const LinkedInCard = () => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <a 
      href="https://www.linkedin.com/in/cooperburden/"
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-card"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="linkedin-image">
        <img src="./linkedin-preview.png" alt="LinkedIn profile preview" />
      </div>
      <div className="linkedin-content">
        <h2>LinkedIn</h2>
        <p>Connect with me on LinkedIn</p>
      </div>
      <div className={`linkedin-options ${showOptions ? 'show' : ''}`}>
        <span className="linkedin-button">Visit Profile</span>
      </div>
    </a>
  )
}

export default LinkedInCard 