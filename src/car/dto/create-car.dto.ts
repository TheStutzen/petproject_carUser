import { IsNotEmpty, IsOptional } from "class-validator"
import { User } from "src/users/entities/user.entity"


export class CreateCarDto {
    @IsNotEmpty()
    brand: string
    @IsNotEmpty()
    model: string
    @IsNotEmpty()
    year: string
    @IsOptional()
    user?: User
}
