import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase

describe('GetBalanceUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  })

  it('Should be able to authenticate user', async () => {
    const user = await createUserUseCase.execute({
      name: "Name test",
      email: "test@email.com",
      password: 'Test@123'
    })

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: 'Test@123'
    })

    expect(authenticatedUser).toHaveProperty("token")
  })

  it('Should not be able to authenticate if user does not exists', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'inexistent@email.com',
        password: '5445454'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to authenticate if password is incorrect', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Name test",
        email: "test@email.com",
        password: 'Test@123'
      })

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '5445454'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
});
