export interface GetByQuestionIdInputDTO {
  questionId: string
}

export interface GetByQuestionIdOutputDTO {
  id: string
  content: string
  responderId: string
  questionId: string
  likes: number
  createdAt: Date
}
