export interface FindByQuestionIdInputDTO {
  questionId: string
}

export interface FindByQuestionIdOutputDTO {
  id: string
  content: string
  responderId: string
  questionId: string
  likes: number
  createdAt: Date
}
