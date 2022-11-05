import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import cryptoJS from 'crypto-js';
import { UserRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import twilio from 'twilio';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  client = twilio(environment.accountSid, environment.authToken)

  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository
  ) {}

  generatePassword() {
    let password = passwordGenerator(12, false)
    return password;
  }

  encryptPass(password : string) {
    let encrypted = cryptoJS.AES.encrypt(password, environment.secretKeyAES).toString();
    return encrypted;
  }

  decryptPass(encryptedPassword : string) {
    let bytes = cryptoJS.AES.decrypt(encryptedPassword, environment.secretKeyAES)
    let decrypted = bytes.toString(cryptoJS.enc.Utf8);
    return decrypted;
  }

  logIn(paramEmail : string, paramPassword : string) {
    try {
      let search = this.userRepository.findOne({
        where : {email : paramEmail}
      })
  
      if (search != null) {
      }else {
        return false
      }
    }catch(err){
      return false
    }
  }
  async logInAsync(email : string, password : string) {
    try {
      let user = await this.userRepository.findOne({
        where : {email : email}
      })
      if (user != null) {
        let decrypt = this.decryptPass(user.password)
        if (decrypt == password) {
          return user
        }else {
          return false
        }
      }else {
        return false
      }
    }catch (err) {
      return false
    }
  }
  generateToken(user : User) {
    let token = jwt.sign({
      data: {
        id : user.id,
        email: user.email,
        name: user.names + ' ' + user.lastNames
      },
    }, environment.secretJWT,
    {expiresIn : 60 })
    return token
  }
  validateToken(token : string) {
    try {
      let data = jwt.verify(token, environment.secretJWT)
      return data
    }catch(err) {
      return false
    }
  }
  sendSMS(message : string, toPhoneNumber : string) {

    this.client.messages 
          .create({   
            body: message,
            messagingServiceSid: environment.messagingServiceSid,
            to: '+57' + toPhoneNumber
          }) 
          .then((message : any) => {
            return (message.sid)
          });
      }
}

