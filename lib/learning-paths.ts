export interface LearningStep {
  id: string
  title: string
  description: string
  duration: string
  resources: string[]
  completed: boolean
}

export interface LearningPath {
  id: string
  userId: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  steps: LearningStep[]
  createdAt: string
  progress: number
}

export const saveLearningPath = (path: LearningPath): void => {
  const pathsStr = localStorage.getItem("learningPaths")
  const paths: LearningPath[] = pathsStr ? JSON.parse(pathsStr) : []
  paths.push(path)
  localStorage.setItem("learningPaths", JSON.stringify(paths))
}

export const getLearningPaths = (userId: string): LearningPath[] => {
  const pathsStr = localStorage.getItem("learningPaths")
  if (!pathsStr) return []
  const paths: LearningPath[] = JSON.parse(pathsStr)
  return paths.filter((path) => path.userId === userId)
}

export const updateLearningPath = (pathId: string, updates: Partial<LearningPath>): void => {
  const pathsStr = localStorage.getItem("learningPaths")
  if (!pathsStr) return
  const paths: LearningPath[] = JSON.parse(pathsStr)
  const index = paths.findIndex((p) => p.id === pathId)
  if (index !== -1) {
    paths[index] = { ...paths[index], ...updates }
    localStorage.setItem("learningPaths", JSON.stringify(paths))
  }
}

export const deleteLearningPath = (pathId: string): void => {
  const pathsStr = localStorage.getItem("learningPaths")
  if (!pathsStr) return
  const paths: LearningPath[] = JSON.parse(pathsStr)
  const filtered = paths.filter((p) => p.id !== pathId)
  localStorage.setItem("learningPaths", JSON.stringify(filtered))
}

export const generateLearningPath = (
  userId: string,
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  category: string,
): LearningPath => {
  const stepTemplates = {
    beginner: [
      { title: "Introduction and Fundamentals", duration: "1-2 weeks" },
      { title: "Core Concepts", duration: "2-3 weeks" },
      { title: "Practical Exercises", duration: "2 weeks" },
      { title: "Building Your First Project", duration: "2-3 weeks" },
      { title: "Review and Next Steps", duration: "1 week" },
    ],
    intermediate: [
      { title: "Advanced Concepts", duration: "2-3 weeks" },
      { title: "Best Practices and Patterns", duration: "2 weeks" },
      { title: "Real-World Applications", duration: "3-4 weeks" },
      { title: "Performance and Optimization", duration: "2 weeks" },
      { title: "Capstone Project", duration: "3-4 weeks" },
    ],
    advanced: [
      { title: "Expert-Level Techniques", duration: "3-4 weeks" },
      { title: "Architecture and Design", duration: "3 weeks" },
      { title: "Advanced Problem Solving", duration: "4 weeks" },
      { title: "Industry Standards", duration: "2-3 weeks" },
      { title: "Master Project", duration: "4-6 weeks" },
    ],
  }

  const templates = stepTemplates[difficulty]
  const steps: LearningStep[] = templates.map((template, index) => ({
    id: `${Date.now()}-${index}`,
    title: template.title,
    description: `Learn ${template.title.toLowerCase()} for ${topic}`,
    duration: template.duration,
    resources: ["Official documentation", "Video tutorials", "Interactive exercises", "Community forums"],
    completed: false,
  }))

  return {
    id: Date.now().toString(),
    userId,
    title: `${topic} Learning Path`,
    description: `A comprehensive ${difficulty}-level learning path for mastering ${topic}`,
    category,
    difficulty,
    steps,
    createdAt: new Date().toISOString(),
    progress: 0,
  }
}
