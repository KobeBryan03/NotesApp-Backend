import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Category,
  Notes,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryNotesController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/notes', {
    responses: {
      '200': {
        description: 'Notes belonging to Category',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Notes)},
          },
        },
      },
    },
  })
  async getNotes(
    @param.path.string('id') id: typeof Category.prototype.id,
  ): Promise<Notes> {
    return this.categoryRepository.notes(id);
  }
}
