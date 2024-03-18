import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-responde.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapter/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axios: AxiosAdapter
  ) { }

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const pokemonInsert: { "name": string, "no": number }[] = [];

    const data = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=200');
    data.results.forEach(({ name, url }) => {
      let filtrado = url.split('/');
      let no = +filtrado[filtrado.length - 2];
      pokemonInsert.push({ name, no });
    })

    await this.pokemonModel.insertMany(pokemonInsert);

    return "Seed executed successfully!";
  }

}
