import {Entity, model, property, hasMany} from '@loopback/repository';
import {Notes} from './notes.model';
import {Events} from './events.model';

@model()
export class User extends Entity {
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
  names: string;

  @property({
    type: 'string',
    required: true,
  })
  lastNames: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'date',
    
  })
  birthDate: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @hasMany(() => Notes)
  notes: Notes[];

  @hasMany(() => Events)
  events: Events[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
