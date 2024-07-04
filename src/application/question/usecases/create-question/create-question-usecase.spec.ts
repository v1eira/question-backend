import { afterEach, describe, expect, it, vitest } from 'vitest'
import UserBuilder from '../../../../domain/user/entity/user-data-builder'
import type UserRepositoryInterface from '../../../../domain/user/repository/user-repository.interface'
import type QuestionRepositoryInterface from '../../../../domain/question/repository/question-repository.interface'
import CreateQuestionUsecase from './create-question-usecase'
import { type CreateQuestionInputDTO } from './create-question-dto'

const MockUserRepository = (): UserRepositoryInterface => {
  return {
    create: vitest.fn(),
    update: vitest.fn(),
    findByEmail: vitest.fn(),
    findByUsername: vitest.fn(),
    findAll: vitest.fn(),
    findByID: vitest.fn().mockImplementation(
      (id: string) => ['fromID', 'toID'].includes(id)
        ? new UserBuilder().withId(id).build()
        : null
    ),
    delete: vitest.fn()
  }
}

const MockQuestionRepository = (): QuestionRepositoryInterface => {
  return {
    create: vitest.fn(),
    findByID: vitest.fn(),
    findRecipientQuestions: vitest.fn(),
    findAll: vitest.fn(),
    delete: vitest.fn()
  }
}

describe('Create Question Usecase tests', async () => {
  const questionRepository = MockQuestionRepository()
  const userRepository = MockUserRepository()
  const createQuestionUsecase = new CreateQuestionUsecase(questionRepository, userRepository)

  afterEach(() => {
    vitest.clearAllMocks()
  })

  it('Should create a new question', async () => {
    const createQuestionInput: CreateQuestionInputDTO = {
      content: 'How are u?',
      fromId: 'fromID',
      toId: 'toID'
    }

    await createQuestionUsecase.execute(createQuestionInput)

    expect(userRepository.findByID).toBeCalledTimes(2)
    expect(userRepository.findByID).toBeCalledWith('fromID')
    expect(userRepository.findByID).toBeCalledWith('toID')
    expect(questionRepository.create).toBeCalledTimes(1)
    expect(questionRepository.create).toBeCalledWith({
      _id: expect.any(String),
      _content: 'How are u?',
      _askerId: 'fromID',
      _recipientId: 'toID',
      _createdAt: expect.any(Date)
    })
  })

  it('Should not create a new question because SOURCE and TARGET are the same', async () => {
    const createQuestionInput: CreateQuestionInputDTO = {
      content: 'How are u?',
      fromId: 'sameUser',
      toId: 'sameUser'
    }

    await expect(createQuestionUsecase.execute(createQuestionInput)).rejects.toThrow('Source and target users should be different')
    expect(userRepository.findByID).not.toBeCalled()
    expect(questionRepository.create).not.toBeCalled()
  })

  it('Should not create a new question because SOURCE USER doesnt exist', async () => {
    const createQuestionInput: CreateQuestionInputDTO = {
      content: 'How are u?',
      fromId: 'userDoesntExist',
      toId: 'toID'
    }

    await expect(createQuestionUsecase.execute(createQuestionInput)).rejects.toThrow('Source user not found')
    expect(userRepository.findByID).toBeCalledTimes(1)
    expect(userRepository.findByID).toBeCalledWith('userDoesntExist')
    expect(questionRepository.create).not.toBeCalled()
  })

  it('Should not create a new question because TARGET USER doesnt exist', async () => {
    const createQuestionInput: CreateQuestionInputDTO = {
      content: 'How are u?',
      fromId: 'fromID',
      toId: 'userDoesntExist'
    }

    await expect(createQuestionUsecase.execute(createQuestionInput)).rejects.toThrow('Target user not found')
    expect(userRepository.findByID).toBeCalledTimes(2)
    expect(userRepository.findByID).toBeCalledWith('fromID')
    expect(userRepository.findByID).toBeCalledWith('userDoesntExist')
    expect(questionRepository.create).not.toBeCalled()
  })
})
