
import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

import refreshToken, {getToken, saveToken} from "../../js/polyathlon-system/refresh-token.mjs";

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
                        <simple-input id="login" icon-name="user" placeholder="Login"></simple-input>
                        <email-input id="email" icon-name="mail" placeholder="EMail" size="28"></email-input>
                        <password-input id="password" sign-up="true" icon-name="lock" placeholder="Password" visible-icon="eye-slash-regular" invisible-icon="eye-regular"></password-input>
                        <div class="sign-up-options">
                            <div class="checkbox-remember">
                                <label for="remember"><b>Remember me</b></label>
                                <input type="checkbox" id="remember" name="remember" @click=${this.RememberMe}>
                            </div>
                        </div>
                        <button type="button" @click=${()=>this.sendSimpleUser()}>Sign Up</button>
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

    static fetchCheckUsername(token, username) {
        return fetch(`https://localhost:4500/api/sign-up/check-username`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: { username }
        })
    }

    static async CheckUsername(username) {
        const token = getToken();
        let response = await DataSet.fetchAddItem(token, username)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.fetchAddItem(token, username)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static fetchSendSimpleUser(user) {
        return fetch(`https://localhost:4500/api/sign-up`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
    }

    async sendSimpleUser() {
        const user = { username: this.#login, password: this.#password, type: 'simple', email: this.#email}

        let response = await SignUpForm.fetchSendSimpleUser(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        saveToken(result.token)

        await this.getSimpleUserInfo()
    }


    static fetchSimpleUserInfo(token) {
        return fetch(`https://localhost:4500/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
    }

    async getSimpleUserInfo() {

        const token = getToken();
        let response = await SignUpForm.fetchSimpleUserInfo(token)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await SignUpForm.fetchSimpleUserInfo(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.saveUserInfo(JSON.stringify(result))

        const modalResult = await this.showDialog("Регистрация прошла успешно")
        if (modalResult === "Ok") {
            this.close(modalResult);
        }
    }

    saveUserInfo(userInfo) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('userInfo', userInfo)
        }
        else {
            sessionStorage.setItem('userInfo', userInfo)
        }
    }

    firstUpdated() {
        super.firstUpdated();
    }

    open() {
        this.opened = true;
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

    async loginValidate(e) {
        const target = e.target
        if (target.value === '') {
            await this.errorDialog("Вы забыли задать имя пользователя")
            target.focus()
        }
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);

    }

    async errorDialog(message) {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = 'error'
        modalDialog.Title = 'Ошибка'
        return modalDialog.show(message);
    }
}

customElements.define("sign-up-form", SignUpForm);