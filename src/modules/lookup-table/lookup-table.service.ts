import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NationalityEntity } from '../user/entities/nationality.entity';

@Injectable()
export class LookupTableService {
  constructor(
    @InjectRepository(NationalityEntity)
    private readonly nationalityRepository: Repository<NationalityEntity>,
  ) {}

  async getNationalitiesList() {
    const listNationality = await this.nationalityRepository.find({
      order: {
        countryName: 'ASC',
      },
    });

    return listNationality.map((nationality) => nationality.toDto());
  }
}
