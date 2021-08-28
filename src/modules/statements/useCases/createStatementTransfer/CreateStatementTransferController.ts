import { Request, Response } from "express";
import { container } from "tsyringe";
import { OperationType } from "../../entities/Statement";
import { CreateStatementTransferUseCase } from "./CreateStatementTransferUseCase";

export class CreateStatementTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const createStatementTransferUseCase = container.resolve(CreateStatementTransferUseCase);

    await createStatementTransferUseCase.execute({
      user_id,
      sender_id,
      type: 'transfer' as OperationType,
      amount,
      description
    });

    return response.status(201).json({ message: 'Transferência realizada com sucesso' })
  }
}
