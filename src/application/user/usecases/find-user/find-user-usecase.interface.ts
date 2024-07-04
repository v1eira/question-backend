import { type FindUserInputDTO, type FindUserOutputDTO } from './find-user-dto'

export default interface FindUserUsecaseInterface {
  execute: (input: FindUserInputDTO) => Promise<FindUserOutputDTO>
}
