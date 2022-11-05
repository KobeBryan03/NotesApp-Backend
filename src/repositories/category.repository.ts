import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DsNotesAppDataSource} from '../datasources';
import {Category, CategoryRelations, Notes} from '../models';
import {NotesRepository} from './notes.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly notes: BelongsToAccessor<Notes, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.dsNotesApp') dataSource: DsNotesAppDataSource, @repository.getter('NotesRepository') protected notesRepositoryGetter: Getter<NotesRepository>,
  ) {
    super(Category, dataSource);
    this.notes = this.createBelongsToAccessorFor('notes', notesRepositoryGetter,);
    this.registerInclusionResolver('notes', this.notes.inclusionResolver);
  }
}
