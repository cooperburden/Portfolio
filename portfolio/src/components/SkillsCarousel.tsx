import { useState } from 'react';
import './SkillsCarousel.css';

interface Skill {
  name: string;
  icon: string;
}

const originalSkills: Skill[] = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
  { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
  { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
];

const loopCount = 4;
const totalSkills = originalSkills.length;
const skills = Array(loopCount).fill(originalSkills).flat();
const middleIndex = totalSkills * Math.floor(loopCount / 2);

const SkillsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(middleIndex);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const goToPrevSlide = () => {
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      // Reset if close to start
      if (newIndex <= 2) {
        setTimeout(() => {
          setIsAnimating(false);
          setCurrentIndex(middleIndex);
        }, 300);
      }
      return newIndex;
    });
  };
  
  const goToNextSlide = () => {
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      // Reset if close to end
      if (newIndex >= skills.length - 3) {
        setTimeout(() => {
          setIsAnimating(false);
          setCurrentIndex(middleIndex);
        }, 300);
      }
      return newIndex;
    });
  };
  
  // Get position class for each skill
  const getPositionClass = (index: number) => {
    const relativePosition = index - currentIndex;
    if (relativePosition === 0) return 'center';
    if (Math.abs(relativePosition) === 1) return 'adjacent';
    return 'outer';
  };
  
  return (
    <div className="skills-section">
      <h3 className="skills-title">Skills</h3>
      <div className="skills-carousel">
        <button 
          className="carousel-button prev" 
          onClick={goToPrevSlide}
        >
          &#8249;
        </button>
        
        <div className="skills-track">
          <div 
            className="skills-grid"
            style={{ 
              transform: `translateX(${-currentIndex * 20}%)`,
              transition: isAnimating ? 'transform 0.3s ease-in-out' : 'none'
            }}
          >
            {skills.map((skill, index) => (
              <div 
                key={`${skill.name}-${index}`}
                className={`skill-item ${getPositionClass(index)}`}
              >
                <img src={skill.icon} alt={skill.name} className="skill-icon" />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="carousel-button next" 
          onClick={goToNextSlide}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default SkillsCarousel; 