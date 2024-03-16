import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Car } from './entities/car.entity'

@Injectable()
export class CarService {
  
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto, id: number) {
    const isExist = await this.carRepository.findBy({
      user: { id },
      brand: createCarDto.brand,
      model: createCarDto.model,
      year: createCarDto.year,
    })

    if (isExist.length)
      throw new BadRequestException('Данный автомобиль уже есть')

      const newCar = {
        brand: createCarDto.brand,
        model: createCarDto.model,
        year: createCarDto.year,
        user: {
          id,
        },
      }

      return await this.carRepository.save(newCar)
  }

  async findAll(id: number) {
    return await this.carRepository.find({
      where: {
        user: { id },
      },
    })
  }

  async findOne(id: number) {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    })

    if (!car) throw new NotFoundException('Автомобиль не найдены')

    return car
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carRepository.findOne({
      where: { id },
    })

    if (!car) throw new NotFoundException('Автомобиль не найден')

    return await this.carRepository.update(id, updateCarDto)
  }

  async remove(id: number) {
    const car = await this.carRepository.findOne({
      where: { id },
    })
    
    if (!car) throw new NotFoundException('Автобиль не найден')

    return await this.carRepository.delete(id)
  }

  async findUsersByCarBrand(brand: string): Promise<Car[]> {
    return this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.user', 'user')
      .where('car.brand = :brand', { brand })
      .getMany()
  }
}
