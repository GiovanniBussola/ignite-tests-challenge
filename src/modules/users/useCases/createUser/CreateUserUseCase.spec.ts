import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: "Name test",
      email: "Email test",
      password: 'Test@123'
    })

    expect(user).toHaveProperty("id")
  })

  it('Should not be able to create an existent user', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Name test",
        email: "Email test",
        password: 'Test@123'
      })

      await createUserUseCase.execute({
        name: "Name test",
        email: "Email test",
        password: 'Test@123'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
