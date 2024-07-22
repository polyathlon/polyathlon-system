import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/email-input.mjs'
import '../../../../components/inputs/password-input.mjs'



class MyProfileSection1 extends BaseElement {
        static get properties() {
            return {
                version: { type: String, default: '1.0.0', save: true },
            }
        }

        static get styles() {
            return [
                css`
                    :host {
                        display: flex;
                        padding-top: 50px;
                        padding-bottom: 50px;
                        gap: 20px;
                        background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                        justify-content: space-around;
                    }

                    * {
                        box-sizing: border-box;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }

                    .left-layout {
                        grid-area: sidebar;
                        display: flex;
                        flex-direction: column;

                        overflow-y: auto;
                        overflow-x: hidden;
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .right-layout {
                        grid-area: sidebar;
                        background: rgba(255, 255, 255, 0.1);

                        display: flex;
                        flex-basis: 50%;
                        align-items: flex-start;
                        justify-content: center;
                    }

                    p {
                        font-size: 1rem;
                        margin-left: 2rem;
                    }

                    a:hover {
                        background-color: var(--button-hover-color);
                    }

                    .avatar-placeholder {
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        background-color: var(--native-color);
                        margin-left: 1rem;
                    }

                    button {
                        padding: 10px 25px;
                        background-color: var(--background-green);
                        color: var(--native-color);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 600;
                    }

                    button:hover {
                        background-color: var(--button-hover-color);
                    }

                    button:first-child {
                        margin-left: 1.5rem;
                        margin-right: 20px;
                    }

                    label {
                        margin-left: 1rem;
                        font-size: 1.15rem;
                        margin-bottom: 5px;
                        flex-direction: column;
                    }

                    img {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        overflow: hidden;
                        background-color: var(--native-color);
                    }

                    input[type="file"] {
                        margin-left: 1rem;
                        margin-bottom: 20px;
                        lang: en-US;
                    }

                    simple-input {
                        margin-bottom: 1.5rem;
                        margin-left: 1rem;
                        margin-right: 5.5rem;
                        width: 300px;
                        flex-direction: column;
                        display: block;
                    }

                    h1 {
                        margin: 1rem;
                    }

                    fieldset {
                        margin-bottom: 1.5rem;
                        border: none;
                    }

                    legend {
                        font-size: 1.15rem;
                        margin-bottom: 5px;
                    }

                `
            ]
        }

        constructor() {
            super();

            this.name = '';
            this.surname = '';
            this.middlename = '';
            this.email = '';
            this.phone = '';
            this.avatar = '';
            this.female = '';
            this.male = '';
        }
        //<simple-input id="name" icon-name="user" placeholder="Project name" .value=${this.currentProject.name} @value-changed=${this.validateInput}></simple-input>

        render() {
            return html`
                <div class="left-layout">
                    <h1 for="avatar">Profile picture</h1>
                    <input type="file" id="avatar" accept="image/*" @change="${(e) => this.handleAvatarChange(e)}">
                    ${this.avatar
                        ? html`<img src="${this.avatar}" alt="Avatar">`
                        : html`<div class="avatar-placeholder" title="Size 100x100px" icon-name="noavatar"></div>`}
                </div>
                <div class="right-layout">
                    <div>
                        <h1>Personal data</h1>

                        <label for="name">Name:</label>
                        <simple-input type="text" id="name" icon-name="user" .value="${this.name}" @input="${(e) => this.name = e.target.value}"></simple-input>

                        <label for="surname">Surname:</label>
                        <simple-input type="text" id="surname" icon-name="user" .value="${this.surname}" @input="${(e) => this.surname = e.target.value}"></simple-input>

                        <label for="email">EMail:</label>
                        <simple-input type="text" id="email" icon-name="mail" .value="${this.email}" @input="${(e) => this.email = e.target.value}"></simple-input>

                        <fieldset class="fieldset">
                            <legend>Gender:</legend>

                            <div>
                                <input type="radio" id="male" name="gender" value="male" />
                                <label for="male">Male</label>
                            </div>

                            <div>
                                <input type="radio" id="female" name="gender" value="female" />
                                <label for="female">Female</label>
                            </div>
                        </fieldset>

                      <div>
                        <label for="email">Date of Birth: </label>
                        <simple-input type="date" id="date" .value="${this.email}" @input="${(e) => this.email = e.target.value}"/>
                      </div>



                        <div class="button-container">
                            <button @click="${this.handleSave}">Save</button></button>
                            <button @click="${this.handleCancel}">Cancel</button>
                        </div>
                    </div>

                </div>
            `;
        }

        handleAvatarChange(event) {
            const fileInput = event.target;
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatar = e.target.result;
                    this.requestUpdate(); // Обновить компонент, чтобы перерисовать изображение
                };
                reader.readAsDataURL(file);
            }
        }

        handleSave() {
            console.log('Saving data:', this.name, this.surname, this.middlename, this.email, this.phone, this.avatar);
        }

        handleCancel() {
            console.log('Canceling changes');
        }

        firstUpdated() {
            super.firstUpdated();
        }
}

customElements.define("my-profile-section-1", MyProfileSection1);