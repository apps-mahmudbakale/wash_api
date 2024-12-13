import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [];

  addCar(carDto) {
    const newCar = { id: Date.now(), ...carDto };
    this.cars.push(newCar);
    return newCar;
  }
}
