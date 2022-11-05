import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import cryptoJS from 'crypto-js';
import { UserRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail'

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  client = twilio(environment.accountSid, environment.authToken)
  
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository
  ) {
    sgMail.setApiKey(environment.SENDGRID_API_KEY)
  }

  generatePassword() {
    let password = passwordGenerator(12, false)
    return password;
  }

  encryptPass(password : string) {
    let encrypted = cryptoJS.AES.encrypt(password, environment.secretKeyAES).toString();
    return encrypted;
  }

  encryptObject(data : any) {
    let encrypted = cryptoJS.AES.encrypt(JSON.stringify(data), environment.secretKeyAES).toString();
    return encrypted;
  }

  decryptPass(encryptedPassword : string) {
    let bytes = cryptoJS.AES.decrypt(encryptedPassword, environment.secretKeyAES)
    let decrypted = bytes.toString(cryptoJS.enc.Utf8);
    return decrypted;
  }

  decryptObject(data : string) {
    let bytes = cryptoJS.AES.decrypt(data, environment.secretKeyAES)
    let decrypted = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
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
  logInPromise(email : string, password : string) {
      let user = this.userRepository.findOne({
        where : {email : email}
      })
      user.then(result => {
        console.log('Promise resolved')
      }).catch(err => {
        console.log('Promise rejected')
      })

      if (user != null) {
        let decrypt = this.decryptPass('xxxxxx')
        if (decrypt == password) {
          return user
        }else {
          return false
        }
      }else {
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
  generateEncryptedToken(user : User) {
    let data = {
        id : user.id,
        email: user.email,
        name: user.names + ' ' + user.lastNames
      }
    let enctrypted = this.encryptObject(data)

    let token = jwt.sign({
      data : enctrypted
    }, environment.secretJWT, {expiresIn : 60 })
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
  async sendSMS(message : string, toPhoneNumber : string) {
    let send = this.client.messages 
          .create({   
            body: message,
            messagingServiceSid: environment.messagingServiceSid,
            to: '+57' + toPhoneNumber
          }) 
    return send;
  }
  sendEmail(to : string, subject : string,  message : string) {
    const msg = {
    to: to,
    from: environment.sendGrid_Email,
    subject: subject,
    text: message,
    html: message,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error : any) => {
      console.error(error)
    })
  }
  async sendEmailPromise(to : string, subject : string,  message : string) {
    const msg = {
      to: to,
      from: environment.sendGrid_Email,
      subject: subject,
      text: message,
      html: message,
    }
    return sgMail.send(msg)
  }
}