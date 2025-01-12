import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PurchasePlanDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
