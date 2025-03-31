export enum QuestionType {
    SINGLE_CHOICE = "单选",
    MULTIPLE_CHOICE = "多选",
}

export enum ExamStep {
    initStep = 0,
    examStep = 1,
    resultStep = 2,
    answerStep = 3,
}

export interface Question {
    type: QuestionType;
    stem: string;
    options: Record<"A" | "B" | "C" | "D", string>;
    answer: "A" | "B" | "C" | "D";
    analysis: string;
}

export interface Paper {
    paperId: number;
    questions: Question[];
    totalScore: number;
}