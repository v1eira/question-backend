export interface GetAnswerInputDTO {
  id: string
}

export interface GetAnswerOutputDTO {
  id: string
  content: string
  responderId: string
  questionId: string
  likes: number
  createdAt: Date
}
