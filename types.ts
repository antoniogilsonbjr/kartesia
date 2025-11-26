export interface Exercise {
  id: string;
  title: string;
  imageUrl: string; // Base64 or URL
  answerKey: string; // The correct answer text
  resolutionVideoUrl?: string; // Optional YouTube URL
}

export interface Subtopic {
  id: string;
  title: string;
  theoryVideoUrl?: string; // YouTube URL for the lecture
  exercises: Exercise[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  email?: string;
}

export interface ProfessorProfile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  socials: SocialLinks;
}

export interface CourseData {
  topics: Topic[];
  professor: ProfessorProfile;
}

export enum ViewMode {
  STUDENT = 'STUDENT',
  CREATOR = 'CREATOR',
}

// Helper to check for YouTube URL
export const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};