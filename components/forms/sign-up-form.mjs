
import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

import refreshToken, {getToken, saveToken} from "../../js/polyathlon-system/refresh-token.mjs";

import '../dialogs/modal-dialog.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/email-input.mjs';
import '../inputs/password-input.mjs';
import '../inputs/simple-informer.mjs';
import '../buttons/close-button.mjs';

class SignUpForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            opened: { type: Boolean, default: false },
            isLoginError: { type: Boolean, default: false },
            isLoginValid: { type: Boolean, default: false },
            isCopyToClipboard: { type: Boolean, default: false },
            loginErrorMessage: { type: String, default: '' },
            loginInfoMessage: { type: String, default: '' },
            isEmailError: { type: Boolean, default: false },
            isEmailValid: { type: Boolean, default: false },
            emailErrorMessage: { type: String, default: '' },
            emailInfoMessage: { type: String, default: '' },
            isPasswordError: { type: Boolean, default: false },
            isPasswordValid: { type: Boolean, default: false },
            passwordErrorMessage: { type: String, default: '' },
            passwordInfoMessage: { type: String, default: '' },
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
                #login,
                #email,
                #confirm {
                    --input-button-color: var(--background-green);
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
                        <simple-input id="login" icon-name="user" placeholder="Login" @blur=${this.loginValidation} button-name=${this.isLoginValid ? "circle-check-sharp-regular" : ''} @input=${this.loginInput}>
                            ${ this.isLoginError ?
                                html`
                                    <simple-informer slot="informer" info-message=${this.loginErrorMessage} error-message=${this.loginInfoMessage} ></simple-informer>
                                `
                            : ''}
                        </simple-input>
                        <simple-input id="email" type="mail" icon-name="mail" placeholder="E-mail" @blur=${this.emailValidation} @input=${this.emailInput} button-name=${this.isEmailValid ? "circle-check-sharp-regular" : ''}>
                            ${ this.isEmailError ?
                                html`
                                    <simple-informer slot="informer" info-message=${this.emailErrorMessage} error-message=${this.emailInfoMessage} ></simple-informer>
                                `
                            : ''}
                        </simple-input>
                        <password-input id="password" sign-up="true" icon-name="lock" placeholder="Password" visible-icon="eye-slash-regular" invisible-icon="eye-regular" @generate=${this.generatePassword} @input=${this.passwordChange}></password-input>
                        <simple-input id="confirm" type="password" icon-name="lock-confirm" placeholder="Confirm" button-name=${this.isPasswordValid ? "copy-to-clipboard-solid" : ''} @input=${this.passwordConfirm} @button-click=${this.copyToClipboard}>
                            ${ this.isPasswordError || this.isCopyToClipboard?
                                html`
                                    <simple-informer slot="informer" info-message=${this.passwordErrorMessage} error-message=${this.passwordInfoMessage} ></simple-informer>
                                `
                            : ''}
                        </simple-input>
                        <div class="sign-up-options">
                            <div class="checkbox-remember">
                                <label for="remember"><b>Remember me</b></label>
                                <input type="checkbox" id="remember" name="remember" @click=${this.RememberMe}>
                            </div>
                        </div>
                        <button type="button" class=${(this.isActive() ? "active" : "" ) || nothing} @click=${()=>this.sendSimpleUser()}>Sign Up</button>
                    </div>
                </div>
            </div>
            </form>
        </div>
        `;
    }

    isActive () {
        return this.isLoginValid && this.isEmailValid && this.isPasswordValid
    }
    RememberMe(){
        if (this.#rememberMe) {
            localStorage.setItem('rememberMe', this.#rememberMe)
        }
        else {
            localStorage.removeItem('rememberMe')
        }
    }

    passwordChange(e) {
        const password = this.$id('password')
        const confirm = this.$id('confirm')
        this.isCopyToClipboard = false
        if (!password.value) {
            this.passwordErrorMessage = "Пароль не задан"
            this.passwordInfoMessage = "Вы должны задать пароль"
            this.isPasswordError = true
            this.isPasswordValid = false
            this.$id("confirm").value = ''
        } else if (password.value !== confirm.value) {
            this.passwordErrorMessage = "Пароли не совпадают"
            this.passwordInfoMessage = "Пароль и подтверждение должны быть одинаковыми"
            this.isPasswordError = true
            this.isPasswordValid = false
        }
        else {
            this.isPasswordError = false
            this.isPasswordValid = true
        }
    }

    generatePassword(e) {
        this.$id('confirm').value = e.target.value
        this.isPasswordError = false
        this.isPasswordValid = true
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
            this.passwordErrorMessage = "Пароль скопирован в буфер обмена"
            this.passwordInfoMessage = "Нажмите Ctrl+V, чтобы сохранить его"
            this.isCopyToClipboard = true;
        }
    }

    loginInput(e) {
        if (!e.target.value) {
            this.isLoginError = true
            this.isLoginValid = false
            this.loginErrorMessage = "Не задано имя пользователя"
            this.loginInfoMessage = "Имя пользователя не может быть пустым"
            return
        }
        if (e.target.value.length < 4 && !this.isLoginError) {
            return
        }
        const regexp = /(?=^.{4,60}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;

        const matches = e.target.value.match(regexp) || [];
        if (!matches.length) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.loginInfoMessage = "от 4 до 16 символов [a-Z] [0-9] [._-] или E-mail"
            this.isLoginError = true
            this.isLoginValid = false
        }
        else {
            this.isLoginError = false
            this.loginErrorMessage = ""
            this.loginInfoMessage = ""
        }
    }

    async loginValidation(e) {
        if (!e.target.value) {
            this.isLoginError = true
            this.isLoginValid = false
            this.loginErrorMessage = "Не задано имя пользователя"
            this.loginInfoMessage = "Имя пользователя не может быть пустым"
            return
        }

        const regexp = /(?=^.{4,60}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;
        const matches = e.target.value.match(regexp) || [];
        if (!matches.length) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.loginInfoMessage = "от 4 до 16 символов [a-Z] [0-9] [._-] или E-mail"
            this.isLoginError = true
            this.isLoginValid = false
            return
        }
        const user = { username: e.target.value}
        try {
            await SignUpForm.checkUsername(user)
            this.isLoginError = false
            this.isLoginValid = true
        } catch (e) {
            this.loginErrorMessage = "Пользователь с таким именем уже существует"
            this.loginInfoMessage = "Придумайте другое имя"
            this.isLoginError = true
            this.isLoginValid = false
        }
    }

    emailInput(e) {
        if (!e.target.value) {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Не задана электронная почта"
            this.emailInfoMessage = "E-mail не может быть пустым"
            return
        }
        const matches = e.target.value.match(/^.+@.+\..+$/) || [];
        if (matches.length) {
            this.isEmailError = false
        }
        else if (!this.isLoginError){
            return
        } else {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Неправильный формат электронной почты"
            this.emailInfoMessage = "email@example.com"
        }
    }

    async emailValidation(e) {
        if (!e.target.value) {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Не задана электронная почта"
            this.emailInfoMessage = "E-mail не может быть пустым"
            return
        }
        const matches = e.target.value.match(/^.+@.+\..+$/) || [];
        if (!matches.length) {
            this.emailErrorMessage = "Неправильный формат электронной почты"
            this.emailInfoMessage = "email@example.com"
            this.isEmailError = true
            this.isEmailValid = false
            return
        }

        const user = { email: e.target.value}
        try {
            await SignUpForm.checkEmail(user)
            this.isEmailError = false
            this.isEmailValid = true
        } catch (e) {
            this.emailErrorMessage = e.message
            if (e.message === 'Вы ошиблись в имени сервера электронной почты') {
                this.emailInfoMessage = "Задайте правильное имя сервера"
            }
            else if (e.message === 'Неправильный формат электронной почты') {
                this.emailInfoMessage = "Формат должен быть email@example.com"
            } else if (e.message === 'Вы указали одноразовую электронную почту. Ай-я-яй') {
                this.emailInfoMessage = "Задайте фактическую почту"
            } else if (e.message === 'Нет mx записи для данной почты в DNS') {
                this.emailInfoMessage = "Проверьте сервер Вашей электронной почты"
            } else if (e.message === 'Такой электронной почты не существует') {
                this.emailInfoMessage = "Вы указали несуществующую электронную почту"
            } else if (e.message === 'Не могу проверить электронную почту') {
                this.emailInfoMessage = "Что-то накрылось у разработчика. Пишите: polyathlon.system@gmail.com"
            }
            this.isEmailError = true
            this.isEmailValid = false
        }
    }

    passwordConfirm(e) {
        const password = this.$id('password')
        const confirm = this.$id('confirm')
        this.isCopyToClipboard = false
        if (!password.value) {
            this.passwordErrorMessage = "Пароль не задан"
            this.passwordInfoMessage = "Вы должны задать пароль"
            this.isPasswordError = true
            this.isPasswordValid = false

        } else if (password.value !== confirm.value) {
            this.passwordErrorMessage = "Пароли не совпадают"
            this.passwordInfoMessage = "Пароль и подтверждение должны быть одинаковыми"
            this.isPasswordError = true
            this.isPasswordValid = false
        }
        else {
            this.isPasswordError = false
            this.isPasswordValid = true
        }
    }

    static fetchCheckUsername(user) {
        return fetch(`https://localhost:4500/api/sign-up/check-username`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
    }

    static async checkUsername(user) {
        const response = await SignUpForm.fetchCheckUsername(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
    }

    static fetchCheckEmail(user) {
        return fetch(`https://localhost:4500/api/sign-up/check-email`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
    }

    static async checkEmail(user) {
        const response = await SignUpForm.fetchCheckEmail(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
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
        this.#login = ""
        this.#password = ""
        this.#email = ""
        this.#confirm = ""
        this.#rememberMe = ""
        this.isLoginError = false
        this.isLoginValid = false
        this.isEmailError = false
        this.isEmailValid = false
        this.isPasswordError = false
        this.isPasswordValid = false
        this.isCopyToClipboard = false;
        this.$id('password').strength = -1
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

    get #confirm() {
        return this.renderRoot?.querySelector('#confirm')?.value ?? null;
    }

    set #confirm(value) {
        if (this.renderRoot?.querySelector('#confirm')) {
            this.renderRoot.querySelector('#confirm').value = value;
        }
    }

    // async loginValidate(e) {
    //     const target = e.target
    //     if (target.value === '') {
    //         await this.errorDialog("Вы забыли задать имя пользователя")
    //         target.focus()
    //     }
    // }

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

//(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[\t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\]\000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\]\000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)