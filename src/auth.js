import auth0 from 'auth0-js';

import history from './history';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'dev-dje0lfse.eu.auth0.com',
        clientID: 'VSSc8ziGbuKYdjrOhDV21IoLj41o9Tbk',
        redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://my-personal-bookshelf.herokuapp.com/callback',
        audience: 'my-go-library',
        responseType: 'token id_token',
        scope: 'openid'
    });

    login = () => {
        this.auth0.authorize();
    }

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                history.replace('/home');
            } else if (err) {
                history.replace('/home');
                console.log(err);
            }
        });
    }

    setSession = (authResult) => {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        history.replace('/home');
    }

    logout = () => {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        let retUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://my-personal-bookshelf.herokuapp.com/callback',

        this.auth0.logout({returnTo: retUrl});
               
    }

    isAuthenticated = () => {
        if (localStorage.getItem('access_token')) {
            // Check whether the current time is past the
            // access token's expiry time
            let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        }
        return false;
    }
}
