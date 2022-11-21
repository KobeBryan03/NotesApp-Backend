import { authenticate } from '@loopback/authentication'
import { service } from '@loopback/core';
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
  HttpErrors,
} from '@loopback/rest';
import {User, UserLogin, Email} from '../models';
import {UserRepository} from '../repositories';
import { AuthenticationService } from '../services';

@authenticate('admin')
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(AuthenticationService)
    public authenticationService : AuthenticationService,
  ) {}
  @authenticate.skip()
  @post('/sendEmail')
  @response(200, {
    description: 'Email sent successfully'
  })
  async sendEmail(
    @requestBody() email : Email
  ) {
    try {
      let result = await this.authenticationService.sendEmailPromise(email.to, email.subject, email.message)
      console.log(result)
      return (result[0].statusCode == 202 ? {status : 'Email Sent successfully'} : {status : 'Email Sent failed'})
    } catch(err) {
      return {error : err.message, code : err.code}
    }
  }

  @authenticate.skip()
  @post('/login')
  @response(200, {
    description : 'User loged success',
  })
  async login(
    @requestBody() userLogin : UserLogin
  )
  {
    let user = await this.authenticationService.logInAsync(userLogin.email, userLogin.password)
    if (user) {
      let token = this.authenticationService.generateEncryptedToken(user)

      // Obtain time
      let today = new Date()
      let now = today.toLocaleTimeString()

      // Send SMS notification
      let result = await this.authenticationService.sendSMS('Loged In from ' + user.email + ' at ' + now, user.phoneNumber)

      // // Send Email notification
      // let message = `
      //   <h3>Bienvenido ${user.names} ${user.lastNames} a NotesApp</h3>
      //   <br><br>
      //   <p>Puedes empezar a crear tus primeras notas o enventos de una manera muy sencilla</p>
      //   <p>Recibirás periodicamente SMS donde te notificaremos sobre logueos y entre otras cosas</p>
      //   <p><a href="https://github.com/KobeBryan03" target="_blank">Click para ver repositorio de GitHub</a></p>
      // `
      // this.authenticationService.sendEmail(user.email, 'Bienvenido a NotesApp', message)

      return {
        data : {
          id : user.id,
          name : user.names + ' ' + user.lastNames,
          email : user.email,
          phone : user.phoneNumber,
        },
        //resultSMS : result,
        token : token,
      }
    }else {
      throw new HttpErrors[401]("Unauthorized access")
    }
  }
  @authenticate.skip()
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    // Password encryption
    user.password = this.authenticationService.encryptPass(user.password);

    // Obtain time
    let today = new Date()
    let now = today.toLocaleTimeString()

    //Message
    let message = user.names + ' ' + user.lastNames + ' was registered succesfully ' + ' at ' + now

    // Send SMS notification
    let result = await this.authenticationService.sendSMS(message, user.phoneNumber)

    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
