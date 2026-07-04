export interface QuestionDTO {
  id?: number;                        // optionnel : absent avant création
  contenu: string;
  choix: string[];
  bonneReponseIndex: number | null;   // null quand renvoyé à l'apprenant
  points: number;
  ordre: number;
}

export interface QuestionnaireRequest {
  titre: string;
  description: string;
  theme: string;
  dureeSecondes: number;
  statut: string;
  questions: QuestionDTO[];
}

export interface QuestionnaireResponse {
  id: number;
  titre: string;
  description: string;
  theme: string;
  dureeSecondes: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  createdByNom: string;
  nombreQuestions: number;
  questions: QuestionDTO[];
}

export interface SoumissionRequest {
  questionnaireId: number;
  reponses: (number | null)[];
}

export interface ScoreResponse {
  id: number;
  utilisateurId: number;
  utilisateurNom: string;
  utilisateurPrenom: string;
  questionnaireId: number;
  questionnaireTitre: string;
  scoreObtenu: number;
  scoreMax: number;
  pourcentage: number;
  dateSoumission: string;
}