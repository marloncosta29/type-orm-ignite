import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.createQueryBuilder('user')
      .innerJoinAndSelect(`user.games`, `games`)
      .where('user.id = :user_id', { user_id })
      .getOne()
    console.log(user)
    return user as User
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const raw = `select * from users order by first_name`;


    return this.repository.query(raw); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      select * from users u 
      where 
          lower(u.first_name) = '${first_name.toLowerCase()}' and 
          lower(u.last_name) = '${last_name.toLowerCase()}'`
      );
  }
}
