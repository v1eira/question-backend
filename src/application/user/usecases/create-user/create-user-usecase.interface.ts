import { type CreateUserInputDTO } from './create-user-dto'

export default interface CreateUserUsecaseInterface {
  execute: (input: CreateUserInputDTO) => Promise<void>
}
