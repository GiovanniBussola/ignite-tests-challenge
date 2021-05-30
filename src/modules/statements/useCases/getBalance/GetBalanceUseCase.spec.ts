import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe('GetBalanceUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository,usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('Should be able to list balance', async () => {
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

    const findBalance = await getBalanceUseCase.execute({user_id: user.id!})
    expect(findBalance).toHaveProperty("balance")
    expect(findBalance.balance).toEqual(statement.amount)
  })

  it('Should not be able to list balance to inexistent user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'test_id'})
    }).rejects.toBeInstanceOf(AppError)
  })
});
