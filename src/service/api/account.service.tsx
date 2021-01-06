import axios from 'axios';

export class AccountService {
    url = 'http://localhost:8080/accounts/';
    login(email: string, password: string) {
        console.log(this.url + 'email=' + email + '&password=' + password);
        return axios.post(this.url + 'email=' + email + '&password=' + password);
    }
}
