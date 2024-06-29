import { describe, expect, it, vitest } from 'vitest'
import CreateUserController from './create-user-controller'
import type CreateUserUsecaseInterface from '../../../../application/user/usecases/create-user/create-user-usecase.interface'

const MockUseCase = (): CreateUserUsecaseInterface => {
  return {
    execute: vitest.fn()
  }
}

describe('CreateUserController', () => {
  const usecase = MockUseCase()
  const createUserController = new CreateUserController(usecase)

  it('Should create an user', async () => {
    const input = {
      fullName: 'any_name',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      summary: 'any_summary',
      location: 'any_location'
    }
    await createUserController.handle(input)
    expect(usecase.execute).toHaveBeenCalledWith(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
  })

  it('Should throw if usecase throws', async () => {
    const input = {
      fullName: 'any_name',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      summary: 'any_summary',
      location: 'any_location'
    }
    vitest
      .spyOn(usecase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await expect(createUserController.handle(input)).rejects.toThrow()
  })
})
