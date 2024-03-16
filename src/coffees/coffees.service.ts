import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Coffee } from "./entities/coffee.entity";
import { Flavor } from "./entities/flavor.entity";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  findAll() {
    return this.coffeeRepository.find({
      relations: {
        flavors: true
      }
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: {
        flavors: true
      }
    });
    if (!coffee) {
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = updateCoffeeDto.flavors && await Promise.all(
      updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    );
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors
    });

    if (!coffee) {
      throw new  HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);

    return this.coffeeRepository.remove(coffee)
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name }
    });

    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }
}
