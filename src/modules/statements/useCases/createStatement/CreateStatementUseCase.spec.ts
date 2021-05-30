import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {OperationType} from '../../entities/Statement'
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('CreateStatementUseCase', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('Should be able to create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: "Name test",
      email: "Email test",
      password: 'Test@123'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      description: 'desc test',
      amount: 100,
      type: "deposit" as OperationType
    });

    expect(statement).toHaveProperty("id")
  })

  it('Should not be able to create a new statement with insufficient founds', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Name test",
        email: "Email test",
        password: 'Test@123'
      })

      await createStatementUseCase.execute({
        user_id: user.id || '',
        description: 'desc test',
        amount: 100,
        type: "withdraw" as OperationType
      });
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a new statement with inexistent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'test',
        description: 'desc test',
        amount: 100,
        type: "withdraw" as OperationType
      });
    }).rejects.toBeInstanceOf(AppError)
  })
})
