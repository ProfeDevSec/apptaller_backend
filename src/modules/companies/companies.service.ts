import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresas } from '../../models/entities/Empresas';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Empresas)
    private companieRepository: Repository<Empresas>,
  ) {}

  async findOne(user: any) {
    const companie: Empresas = await this.companieRepository.findOne({
      select: {
        id: true,
        nid: true,
        nombre: true,
        habilitada: true,
        nombreContacto: true,
        contactoEmail: true,
      },
      where: {
        nid: user.empresa.nid,
      },
    });

    if (!companie) {
      return {
        status: 'error',
        message: 'Compañia no encontrada',
        statusCode: 401,
      };
    }

    return companie;
  }
}
