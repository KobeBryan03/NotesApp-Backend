import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { environment } from '../config/environment';

const config = {
  name: 'dsNotesApp',
  connector: 'mongodb',
  url: environment.mongodbUrl,
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DsNotesAppDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'dsNotesApp';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.dsNotesApp', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
