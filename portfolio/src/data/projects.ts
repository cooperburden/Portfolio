export interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    title: "Turtle Shelter",
    description: "A website dedicated to providing warmth and comfort to those experiencing homelessness through innovative vest technology.",
    link: "https://cooperburden.github.io/Intex1Port/",
    imageUrl: "./turtle-shelter-preview.png"
  },
  {
    title: "CineNiche",
    description: "A streaming platform for movie enthusiasts, featuring a curated collection of films and shows with detailed information and ratings.",
    link: "https://cooperburden.github.io/Intex2Port/",
    imageUrl: "./cineniche-preview.png"
  },
  {
    title: "Missionaries World Wide",
    description: "A web application for missionaries to learn more about the places they are serving in. Login with\nUsername: coop\nPassword: 12345",
    link: "https://missionaryport.onrender.com/",
    imageUrl: "./missionary-port-preview.png"
  }
  // Add more projects here as needed
] 