import {Entity, model, property} from '@loopback/repository';

@model()
export class Events extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  place: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Events>) {
    super(data);
  }
}

export interface EventsRelations {
  // describe navigational properties here
}

export type EventsWithRelations = Events & EventsRelations;
