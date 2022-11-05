import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Events,
} from '../models';
import {UserRepository} from '../repositories';

export class UserEventsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/events', {
    responses: {
      '200': {
        description: 'Array of User has many Events',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Events)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Events>,
  ): Promise<Events[]> {
    return this.userRepository.events(id).find(filter);
  }

  @post('/users/{id}/events', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Events)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Events, {
            title: 'NewEventsInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) events: Omit<Events, 'id'>,
  ): Promise<Events> {
    return this.userRepository.events(id).create(events);
  }

  @patch('/users/{id}/events', {
    responses: {
      '200': {
        description: 'User.Events PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Events, {partial: true}),
        },
      },
    })
    events: Partial<Events>,
    @param.query.object('where', getWhereSchemaFor(Events)) where?: Where<Events>,
  ): Promise<Count> {
    return this.userRepository.events(id).patch(events, where);
  }

  @del('/users/{id}/events', {
    responses: {
      '200': {
        description: 'User.Events DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Events)) where?: Where<Events>,
  ): Promise<Count> {
    return this.userRepository.events(id).delete(where);
  }
}
