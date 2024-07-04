import { type DeleteUserInputDTO } from './delete-user-dto'

export default interface DeleteUserUsecaseInterface {
  execute: (input: DeleteUserInputDTO) => Promise<void>
}
