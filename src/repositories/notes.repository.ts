import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DsNotesAppDataSource} from '../datasources';
import {Notes, NotesRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class NotesRepository extends DefaultCrudRepository<
  Notes,
  typeof Notes.prototype.id,
  NotesRelations
> {

  constructor(
    @inject('datasources.dsNotesApp') dataSource: DsNotesAppDataSource,
  ) {
    super(Notes, dataSource);
  }
}
