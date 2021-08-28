import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementTransferDTO } from "./ICreateStatementTransferDTO";

@injectable()
export class CreateStatementTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {

  }

  async execute({ user_id, sender_id, amount, description, type }: ICreateStatementTransferDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    await this.statementsRepository.createTransfer({
      user_id,
      type,
      sender_id,
      amount,
      description
    });
  }
}
