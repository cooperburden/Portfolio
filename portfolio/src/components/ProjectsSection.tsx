import ProjectCard from './ProjectCard'
import ResumeCard from './ResumeCard'
import LinkedInCard from './LinkedInCard'
import GitHubCard from './GitHubCard'
import RapNameGenerator from './RapNameGenerator'
import RunningGame from './RunningGame'
import SkillsCarousel from './SkillsCarousel'

interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

interface ProjectsSectionProps {
  show: boolean;
  projects: Project[];
}

const ProjectsSection = ({ show, projects }: ProjectsSectionProps) => {
  return (
    <div className={`projects-section ${show ? 'show' : ''}`}>
      <h2 className="section-header">Me</h2>
      <div className="projects">
        <ResumeCard />
        <LinkedInCard />
        <GitHubCard />
      </div>
      <SkillsCarousel />
      <h2 className="section-header">Projects</h2>
      <div className="projects">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
      <h2 className="section-header games-header">Games</h2>
      <div className="games-grid">
        <RapNameGenerator />
        <RunningGame />
      </div>
    </div>
  )
}

export default ProjectsSection 