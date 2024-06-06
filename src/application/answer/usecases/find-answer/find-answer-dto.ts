export interface FindAnswerInputDTO {
  id: string
}

export interface FindAnswerOutputDTO {
  id: string
  content: string
  responderId: string
  questionId: string
  likes: number
  createdAt: Date
}
