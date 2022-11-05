import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DsNotesAppDataSource} from '../datasources';
import {User, UserRelations, Notes, Events} from '../models';
import {NotesRepository} from './notes.repository';
import {EventsRepository} from './events.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly notes: HasManyRepositoryFactory<Notes, typeof User.prototype.id>;

  public readonly events: HasManyRepositoryFactory<Events, typeof User.prototype.id>;

  constructor(
    @inject('datasources.dsNotesApp') dataSource: DsNotesAppDataSource, @repository.getter('NotesRepository') protected notesRepositoryGetter: Getter<NotesRepository>, @repository.getter('EventsRepository') protected eventsRepositoryGetter: Getter<EventsRepository>,
  ) {
    super(User, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor('events', eventsRepositoryGetter,);
    this.registerInclusionResolver('events', this.events.inclusionResolver);
    this.notes = this.createHasManyRepositoryFactoryFor('notes', notesRepositoryGetter,);
    this.registerInclusionResolver('notes', this.notes.inclusionResolver);
  }
}
