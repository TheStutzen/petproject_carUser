import { IsEmail, IsPhoneNumber, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsPhoneNumber()
    phone: string

    @MinLength(6, { message: 'Пароль меньше 6 символов'})
    password: string
}
