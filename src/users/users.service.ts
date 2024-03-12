import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        phone: createUserDto.phone,
      },
    })
    if (existUser) throw new BadRequestException('Данная почта или номер телефона уже зарегестрированы')

    const user = await this.userRepository.save({
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: await argon2.hash(createUserDto.password),
    })

    const token = this.jwtService.sign({ email: createUserDto })

    return { user, token }
  }

  findAll() {
    return `This action returns all users`
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    }) 
  }
}
