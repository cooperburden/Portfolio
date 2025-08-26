import { useState } from 'react'

const GitHubCard = () => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <a 
      href="https://github.com/cooperburden"
      target="_blank"
      rel="noopener noreferrer"
      className="github-card"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="github-image">
        <img src="./images/github.jpg" alt="GitHub profile preview" />
      </div>
      <div className="github-content">
        <h2>GitHub</h2>
        <p>Check out my projects on GitHub</p>
      </div>
      <div className={`github-options ${showOptions ? 'show' : ''}`}>
        <span className="github-button">Visit Profile</span>
      </div>
    </a>
  )
}

export default GitHubCard
