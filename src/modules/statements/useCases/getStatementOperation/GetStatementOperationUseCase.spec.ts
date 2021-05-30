import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

describe('GetStatementOperationUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it('should be able to get statement operation', async () => {
    const user = await createUserUseCase.execute({
      name: "Name test",
      email: "Email test",
      password: 'Test@123'
    })

    const statement = await statementsRepository.create({
      user_id: user.id!,
      description: 'desc test',
      amount: 100,
      type: "deposit" as OperationType
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!
    })

    expect(statementOperation).toHaveProperty("id")
  })

  it('should not be able to get statement if user not exists', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: 'statementid',
        user_id: 'nonexistentuser'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to get statement if statement not exists', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Name test",
        email: "Email test",
        password: 'Test@123'
      })

      await getStatementOperationUseCase.execute({
        statement_id: 'nonexistentstatement',
        user_id: user.id!
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
