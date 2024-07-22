
import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

import '../dialogs/modal-dialog.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/email-input.mjs';
import '../inputs/password-input.mjs';
import '../buttons/close-button.mjs';

class SignUpForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' },
            opened: { type: Boolean, default: false, category: 'settings' },
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

    render() {
        return html`
           <div id="form-background" class="form-background" style="${this.opened ? 'display: block' : ''}">
            <modal-dialog></modal-dialog>
            <cancel-dialog></cancel-dialog>
            <close-dialog></close-dialog>
            <form class="form animate" method="post" id="form">
                <div class="form-header">
                    <div class="form-tabs no-select">
                        <div class="form-tab" selected>
                            <span id="db-tab" class="form-tab-link select">Sign Up</span>
                        </div>
                    </div>
                    <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                </div>

                <div class="form-body">
                    <div id="db-tab-section" class="form-tab-section selected">
                        <simple-input id="login" icon-name="user" placeholder="Логин" label="Пользователь"></simple-input>
                        <email-input id="email" icon-name="mail" placeholder="EMail" label="Почта" size="28"></email-input>
                        <password-input id="password" label="Пароль" icon-name="password" visible-icon="eye-slash-regular" invisible-icon="eye-regular"></password-input>
                        <div class="sign-up-options">
                            <div class="checkbox-remember">
                                <label for="remember"><b>Remember me</b></label>
                                <input type="checkbox" id="remember" name="remember" @click=${this.RememberMe}>
                            </div>
                        </div>

                        <button type="button" @click=${()=>this.sendSimpleUser()}>Sign Up</button>
                        <div id="google"></div>
                    </div>
                </div>
            </div>
            </form>
        </div>
        `;
    }

    RememberMe(){
        if (this.#rememberMe) {
            localStorage.setItem('rememberMe', this.#rememberMe)
        }
        else {
            localStorage.removeItem('rememberMe')
        }
    }

    sendSimpleUser() {
        const user = { username: this.#login, password: this.#password, type: 'simple', email: this.#email }
        console.log(JSON.stringify(user))
        let response = fetch('https://cs.rsu.edu.ru:4500/api/sign-up', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
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

    sendGoogleUserToken(res) {
        console.log(res)
        const token = { token: res.credential, type: 'google'}
        console.log(JSON.stringify(token))
        let response = fetch('https://cs.rsu.edu.ru:4500/api/sign-up', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(token)
        })
        .then(response =>response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            this.saveToken(json.token)
            return json.token
        })
        .then(token => this.getUserInfo(token))
        .catch(err => {console.error(err.message)});
    }


    getUserInfo(token) {
        return fetch('https://cs.rsu.edu.ru:4500/api/user?info=fle', {
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
        .then(() => this.close('OK'))
        .catch(err => {console.error(err.message)});
    }

    getSimpleUserInfo(token) {
        return fetch('https://cs.rsu.edu.ru:4500/api/user?info=fle', {
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
        .then(() => this.close('OK'))
        .catch(err => {console.error(err.message)});
    }

    saveUserInfo(userInfo) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('userInfo', userInfo)
        }
        else {
            sessionStorage.setItem('userInfo', userInfo)
        }
    }

    async saveToken(token) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('accessUserToken', token)
        }
        else {
            sessionStorage.setItem('accessUserToken', token)
        }
    }

    getTokenToSessionStorage(token) {
        return sessionStorage.getItem('accessUserToken')
    }

    createGoogleButton() {
        google.accounts.id.initialize({
            client_id: '152529125992-enoddnchd7n8mug7he2juk5fh3fhevqe.apps.googleusercontent.com',
            callback: res => this.sendGoogleUserToken(res)
        });
        google.accounts.id.renderButton(
            this.renderRoot.querySelector('#google'),
            { theme: 'outline', size: 'large'}
        );
    }

    firstUpdated() {
        super.firstUpdated();
        this.createGoogleButton();
    }

    open() {
        this.opened = true;
        // setDialog(this.renderRoot.querySelector('modal-dialog'))
        // setForm(this);
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    close(modalResult) {
        this.opened = false
        this.#login = "";
        this.#password = "";
        this.#email = "";
        this.#rememberMe = "";
        // repairDialog()
        this.resolve(modalResult)
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

    get #email() {
        return this.renderRoot?.querySelector('#email')?.value ?? null;
    }

    set #email(value) {
        if (this.renderRoot?.querySelector('#email')) {
            this.renderRoot.querySelector('#email').value = value;
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

    async authOk(message) {
        console.log(JSON.stringify(message))
        const dialog =  this.renderRoot.querySelector('modal-dialog');
        let modalResult = await dialog.show(message.text);
        if (modalResult === "Ok") {
            this.close();
        }
    }

    async modalDialogShow() {
        const dialog =  this.renderRoot.querySelector('modal-dialog');
        let modalResult = await dialog.show("Подключение прошло успешно");
        if (modalResult === "Ok") {
            this.close(modalResult);
        }
    }

    updateLoginValue (e) {
        this.login = e.target.value
        console.log(this.login)
    }

    updatePasswordValue (e) {
        this.password = e.target.value
        console.log(this.password)
    }
}

customElements.define("sign-up-form", SignUpForm);