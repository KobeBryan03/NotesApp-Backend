import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Events} from '../models';
import {EventsRepository} from '../repositories';

export class EventsController {
  constructor(
    @repository(EventsRepository)
    public eventsRepository : EventsRepository,
  ) {}

  @post('/events')
  @response(200, {
    description: 'Events model instance',
    content: {'application/json': {schema: getModelSchemaRef(Events)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Events, {
            title: 'NewEvents',
            exclude: ['id'],
          }),
        },
      },
    })
    events: Omit<Events, 'id'>,
  ): Promise<Events> {
    return this.eventsRepository.create(events);
  }

  @get('/events/count')
  @response(200, {
    description: 'Events model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Events) where?: Where<Events>,
  ): Promise<Count> {
    return this.eventsRepository.count(where);
  }

  @get('/events')
  @response(200, {
    description: 'Array of Events model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Events, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Events) filter?: Filter<Events>,
  ): Promise<Events[]> {
    return this.eventsRepository.find(filter);
  }

  @patch('/events')
  @response(200, {
    description: 'Events PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Events, {partial: true}),
        },
      },
    })
    events: Events,
    @param.where(Events) where?: Where<Events>,
  ): Promise<Count> {
    return this.eventsRepository.updateAll(events, where);
  }

  @get('/events/{id}')
  @response(200, {
    description: 'Events model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Events, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Events, {exclude: 'where'}) filter?: FilterExcludingWhere<Events>
  ): Promise<Events> {
    return this.eventsRepository.findById(id, filter);
  }

  @patch('/events/{id}')
  @response(204, {
    description: 'Events PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Events, {partial: true}),
        },
      },
    })
    events: Events,
  ): Promise<void> {
    await this.eventsRepository.updateById(id, events);
  }

  @put('/events/{id}')
  @response(204, {
    description: 'Events PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() events: Events,
  ): Promise<void> {
    await this.eventsRepository.replaceById(id, events);
  }

  @del('/events/{id}')
  @response(204, {
    description: 'Events DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.eventsRepository.deleteById(id);
  }
}
