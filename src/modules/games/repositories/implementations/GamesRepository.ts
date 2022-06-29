import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .where("lower(title) like :param", { param: `%${param.toLowerCase()}%` })
      .getMany();
    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const usersGames = await this.repository.createQueryBuilder('games')
      .leftJoinAndSelect('games.users', 'users')
      .where(`games.id = :id`, {id})
      .getOne();
    return usersGames?.users || []
  }
}
