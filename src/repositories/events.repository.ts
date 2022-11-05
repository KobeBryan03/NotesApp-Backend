import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DsNotesAppDataSource} from '../datasources';
import {Events, EventsRelations} from '../models';

export class EventsRepository extends DefaultCrudRepository<
  Events,
  typeof Events.prototype.id,
  EventsRelations
> {
  constructor(
    @inject('datasources.dsNotesApp') dataSource: DsNotesAppDataSource,
  ) {
    super(Events, dataSource);
  }
}
