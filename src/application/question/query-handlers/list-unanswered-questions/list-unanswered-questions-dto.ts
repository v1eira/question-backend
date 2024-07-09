import { type QuestionWithAsker } from '../../../../domain/question/query/question-query.interface'

export interface ListUnansweredQuestionsInputDto {
  recipientId: string
}

export interface ListUnansweredQuestionsOutputDto {
  questions: QuestionWithAsker[]
}
