import { type UpdateUserInputDTO } from './update-user-dto'

export default interface UpdateUserUsecaseInterface {
  execute: (input: UpdateUserInputDTO) => Promise<void>
}
