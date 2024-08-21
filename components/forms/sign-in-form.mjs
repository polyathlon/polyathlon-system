import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

//import { default as wsClient, sendMessage, setDialog, repairDialog, setForm} from '../../js/ws-client.mjs'

import '../dialogs/modal-dialog.mjs';
import './sign-up-form.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/password-input.mjs';
import '../buttons/close-button.mjs';
import '../auth/vk-auth.mjs';

customElements.define("sign-in-form", class SignInForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' },
            opened: { type: Boolean, default: false, category: 'settings' },
            login: { type: String, default: ''},
            password: {type: String, default: ''},
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    user-select: none;
                }
                .icon-font-2.user {
                    color: red;
                    font-family: FontAwesome;
                }
                .icon-font-2.user::before {
                    font-family: FontAwesome;
                    content:"\f001";
                }
                .form-footer {
                    display: flex;
                    justify-content: right;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    // <span id="close" class="close-button no-select" title="Закрыть"  @click=${()=>this.close('CANCEL')}>&times;</span>
    render() {
        return html`
            <div id="form-background" class="form-background" style="${this.opened ? 'display: block' : ''}">
                <modal-dialog></modal-dialog>
                <cancel-dialog></cancel-dialog>
                <close-dialog></close-dialog>
                <sign-up-form></sign-up-form>
                <form class="form animate" method="post" id="form">
                    <div class="form-header">
                        <div class="form-tabs no-select">
                            <div class="form-tab" selected>
                                Sign in
                            </div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <simple-input id="login" type="text" icon-name="user" placeholder="Login" size="20"></simple-input>
                            <password-input id="password" placeholder="Password" icon-name="lock" visible-icon="eye-slash-regular" invisible-icon="eye-regular" @keydown=${this.enterDown}></password-input>

                            <div class="login-options">
                                <div class="checkbox-remember">
                                    <label for="remember">Remember me</label>
                                    <input type="checkbox" id="remember" name="remember" @click=${this.RememberMe}>
                                </div>
                                <a href="http://localhost/forgot" class="forgot-password" title="Forgot password?">Forgot password?</a>
                            </div>

                            <button type="button" @click=${()=>this.sendSimpleUser()}>Login</button>
                            <div id="google"></div>
                            <vk-auth></vk-auth>
                        </div>
                    </div>

                    <div class="form-footer">
                        <a class="sign-up-link" title="Sign Up" @click=${this.signUpClick}>New user? Sign up!</a>
                    </div>
                </form>
            </div>
        `;
    }

    sendGoogleToken(res) {        
        const token = { token: res.credential, type: 'google'}        
        fetch('https://cs.rsu.edu.ru:4500/api/sign-in-google', {        
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(token)
          })
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            this.saveToken(json.token)
            return json.token
        })
        .then(token => this.getSimpleUserInfo(token))
        .catch(err => {console.error(err.message)});
      }

    createGoogleButton() {
        google.accounts.id.initialize({
            client_id: '152529125992-h422kajfg36g0e9gptsu7auv090okqlv.apps.googleusercontent.com',
            callback: res => this.sendGoogleToken(res)
        });
        google.accounts.id.renderButton(
            this.renderRoot.querySelector('#google'),
            { theme: 'outline', size: 'large'}
        );
    }

    sendVKToken(res) {
        const token = { token: res.credential, type: 'google'}
        console.log(JSON.stringify(token))
        fetch('https://cs.rsu.edu.ru:4500/api/sign-in-google', {
        // fetch('https://localhost:4500/api/sign-in-google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(token)
          })
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            this.saveToken(json.token)
            return json.token
        })
        .then(token => this.getSimpleUserInfo(token))
        .catch(err => {console.error(err.message)});
    }


    firstUpdated() {
        super.firstUpdated();
        this.createGoogleButton();        
        let params = new URLSearchParams(window.location.search)
        let code = params.get("code")
        let device_id = params.get("device_id")       
        // window.VKIDSDK.Auth.exchangeCode(code, device_id).then(d => console.log(d))
    }

    open() {
        this.opened = true;
        return new Promise((res, rej) => {
            this.resolveForm = res
            this.rejectFrom = rej
        })
    }

    close(modalResult) {
        this.opened = false
        this.#login = ''
        this.#password = ''
        this.#rememberMe = ''
        if (modalResult == 'Ok')
            this.resolveForm(modalResult)
        else
            this.rejectFrom(modalResult)        
    }

    signUpClick() {
        this.opened = false;
        this.#signUpForm.open().then(modalResult => {
            if (modalResult == "SINGIN") {
                this.opened = false;
            }
            else {
                this.close(modalResult)
            }
        }, modalResult => this.close(modalResult));
    }

    get #signUpForm() {
        return this.parentElement.querySelector('sign-up-form') ?? null;
    }
    get #login() {
        return this.renderRoot?.querySelector('#login')?.value ?? null;
    }

    set #login(value) {
        if (this.renderRoot?.querySelector('#login')) {
            this.renderRoot.querySelector('#login').value = value;
        }
    }

    get #password() {
        return this.renderRoot?.querySelector('#password')?.value ?? null;
    }

    set #password(value) {
        if (this.renderRoot?.querySelector('#password')) {
            this.renderRoot.querySelector('#password').value = value;
        }
    }

    get #rememberMe() {
        return this.renderRoot?.querySelector('#remember')?.checked ?? null;
    }

    set #rememberMe(value) {
        if (this.renderRoot?.querySelector('#remember')) {
            this.renderRoot.querySelector('#remember').checked = value;
        }
    }

    sendSimpleUser() {
        const user = { username: this.#login, password: this.#password, type: 'simple'}
        console.log(JSON.stringify(user))
        fetch('https://cs.rsu.edu.ru:4500/api/sign-in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
            body: JSON.stringify(user)
        })
        .then( response => response.json() )
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            this.saveToken(json.token)
            return json.token
        })
        .then(token => this.getSimpleUserInfo(token))        
        .catch(err => {console.error(err.message)});
    }
    
    async saveToken(token) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('accessUserToken', token)
        }
        else {
            sessionStorage.setItem('accessUserToken', token)
        }
    }

    getSimpleUserInfo(token) {
        return fetch('https://cs.rsu.edu.ru:4500/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            return json.user;
        })
        .then(user => this.saveUserInfo(JSON.stringify(user)))
        .then(() => this.modalDialogShow())
        .catch(err => {console.error(err.message)});
    }

    saveUserInfo(userInfo) {
        sessionStorage.setItem('userInfo', userInfo)
    }

    RememberMe(){
        if (this.#rememberMe) {
            localStorage.setItem('rememberMe', this.#rememberMe)
        }
        else {
            localStorage.removeItem('rememberMe')
        }
    }

    async modalDialogShow() {
        const dialog =  this.renderRoot.querySelector('modal-dialog');
        let modalResult = await dialog.show("Подключение прошло успешно");
        if (modalResult === "Ok") {
            this.close(modalResult);
        }
    }
   
    enterDown(e) {   
        if (e.key === 'Enter') 
            this.sendSimpleUser()
    }
})