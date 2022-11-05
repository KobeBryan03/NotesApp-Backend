import { AuthenticationStrategy } from '@loopback/authentication';
import { service } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security'
import parseBearerToken from 'parse-bearer-token';
import { AuthenticationService } from '../services';

export class StrategyAdmin implements AuthenticationStrategy {

    name : string = 'admin'

    constructor(
        @service(AuthenticationService)
        public authenticationService : AuthenticationService
    ){}

    async authenticate(req : Request) : Promise<UserProfile | undefined> {
        let token = parseBearerToken(req)
        if (token) {
            let valid = this.authenticationService.validateToken(token)
            console.log(valid)
            if (valid) {
                let profile : UserProfile = Object.assign({
                    data : valid
                })
                return profile
            }else {
                throw new HttpErrors[401]("Token is invalid")
            }
        }else {
            throw new HttpErrors[401]("Token not included in request")
        }
    }
}