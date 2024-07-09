import type AnswerRepositoryInterface from '../../../../domain/answer/repository/answer-repository.interface'
import { NotFoundError } from '../../../../domain/error/errors'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import { type FindAnsweredQuestionInputDTO, type FindAnsweredQuestionOutputDTO } from './find-answered-question-dto'

export default class FindAnsweredQuestionUsecase {
  constructor (
    private readonly questionRepository: QuestionRepositoryInterface,
    private readonly answerRepository: AnswerRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute (input: FindAnsweredQuestionInputDTO): Promise<FindAnsweredQuestionOutputDTO> {
    const question = await this.questionRepository.findByID(input.id)
    if (question === null) {
      throw new NotFoundError('Question not found')
    }

    const asker = await this.userRepository.findByID(question.askerId)
    if (asker === null) {
      throw new NotFoundError('Asker not found')
    }

    const responder = await this.userRepository.findByID(question.recipientId)
    if (responder === null) {
      throw new NotFoundError('Responder not found')
    }

    const answer = await this.answerRepository.findByQuestionID(question.id)
    if (answer === null) {
      throw new NotFoundError('Answer not found')
    }

    return {
      question: {
        id: question.id,
        content: question.content,
        createdAt: question.createdAt,
        asker: {
          id: asker.id,
          fullName: asker.fullName,
          username: asker.username,
          email: asker.email
        }
      },
      answer: {
        id: answer.id,
        content: answer.content,
        likes: answer.likes,
        createdAt: answer.createdAt,
        responder: {
          id: responder.id,
          fullName: responder.fullName,
          username: responder.username,
          email: responder.email
        }
      }
    }
  }
}
