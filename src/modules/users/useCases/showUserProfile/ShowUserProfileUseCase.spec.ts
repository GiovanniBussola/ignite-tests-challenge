import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository
let createUserUseCase: CreateUserUseCase;

describe('ShowUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Name test",
      email: "test@email.com",
      password: 'Test@123'
    })

    const userContents = await showUserProfileUseCase.execute(user.id!)

    expect(userContents).toBeInstanceOf(User)
  });

  it("should not be able to show user if user does not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('johnDoe')
    }).rejects.toBeInstanceOf(AppError)
  });
})
