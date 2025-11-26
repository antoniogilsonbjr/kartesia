import { CourseData } from './types';

export const INITIAL_DATA: CourseData = {
  professor: {
    name: "Prof. René Kartesia",
    title: "Doutor em Filosofia Natural & Mecânica",
    bio: "Dedico minha vida ao ensino da física através do método rigoroso da dedução. Acredito que o universo é um grande relógio, cujas engrenagens podem ser compreendidas através da linguagem matemática. Minha missão é trazer clareza onde há confusão e luz onde há sombras.",
    photoUrl: "https://picsum.photos/id/1/400/400", // Placeholder
    socials: {
      youtube: "https://youtube.com",
      instagram: "https://instagram.com"
    }
  },
  topics: [
    {
      id: 't1',
      title: 'Mecânica Clássica',
      description: 'O estudo do movimento dos corpos sob a ação de forças, a base da visão mecanicista do universo.',
      subtopics: [
        {
          id: 's1-1',
          title: 'Cinemática Escalar',
          theoryVideoUrl: 'https://www.youtube.com/watch?v=M5u_XyJ6Wgs', // Placeholder
          exercises: [
            {
              id: 'e1-1-1',
              title: 'Velocidade Média',
              imageUrl: 'https://picsum.photos/600/300', // Placeholder for pasted image
              answerKey: 'Alternativa B (20 m/s)',
              resolutionVideoUrl: 'https://www.youtube.com/watch?v=example'
            }
          ]
        },
        {
          id: 's1-2',
          title: 'Leis de Newton',
          theoryVideoUrl: '',
          exercises: []
        }
      ]
    },
    {
      id: 't2',
      title: 'Geometria Analítica',
      description: 'A unificação da álgebra e geometria, fundamental para o método cartesiano.',
      subtopics: []
    }
  ]
};

export const SYSTEM_PROMPT = `
Você é o assistente virtual da plataforma educacional "Kartesia".
Sua persona é baseada em um filósofo natural racionalista, lógico e preciso, mas pedagógico.
Você valoriza a clareza, o método científico e a dedução lógica.
O foco da plataforma é Mecânica Clássica e visões matematizantes do mundo.
Ao responder perguntas, tente quebrar o problema em partes menores (análise) antes de sintetizar a resposta.
Se o aluno perguntar em Esperanto, responda em Esperanto.
`;