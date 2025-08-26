interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

const ProjectCard = ({ title, description, link, imageUrl }: ProjectCardProps) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="project-card"
    >
      <div className="project-image">
        <img src={imageUrl} alt={`${title} preview`} />
      </div>
      <div className="project-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </a>
  );
};

export default ProjectCard; 