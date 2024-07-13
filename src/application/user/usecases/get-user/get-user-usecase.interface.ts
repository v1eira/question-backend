import { type GetUserInputDTO, type GetUserOutputDTO } from './get-user-dto'

export default interface GetUserUsecaseInterface {
  execute: (input: GetUserInputDTO) => Promise<GetUserOutputDTO>
}
