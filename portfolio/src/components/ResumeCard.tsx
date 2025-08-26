import { useState } from 'react'

const ResumeCard = () => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div 
      className="resume-card"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="resume-image">
        <img src="./resume-preview.png" alt="Resume preview" />
      </div>
      <div className="resume-content">
        <h2>Resume</h2>
        <p>Click to view or download my resume</p>
      </div>
      <div className={`resume-options ${showOptions ? 'show' : ''}`}>
        <a 
          href="/resume.pdf" 
          download 
          className="resume-button download"
          onClick={(e) => e.stopPropagation()}
        >
          Download PDF
        </a>
        <button 
          className="resume-button preview"
          onClick={() => window.open('/resume.pdf', '_blank')}
        >
          Preview
        </button>
      </div>
    </div>
  )
}

export default ResumeCard 