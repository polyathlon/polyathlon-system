import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/gender-input.mjs'
import '../../../../components/inputs/birthday-input.mjs'

class MyProfileSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null, attribute: "old-values" },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }

                .right-container {
                    max-width: 600px;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="right-container">
                    <div class="name-group">
                        <simple-input label="First Name:" id="firstName" icon-name="user" .value=${this.item?.personalInfo?.firstName} @input=${this.validateInput}></simple-input>
                        <simple-input label="Last Name:" id="lastName" icon-name="user-group-solid" .value=${this.item?.personalInfo?.lastName} @input=${this.validateInput}></simple-input>
                    </div>
                    <simple-input label="NickName:" id="nickName" icon-name="user-alien-solid" .value=${this.item?.personalInfo?.nickName} @input=${this.validateInput}></simple-input>
                    <simple-input label="Email:" id="email" icon-name="envelope1" .value="${this.item?.personalInfo?.email}" @input=${this.validateInput}></simple-input>
                    <gender-input label="Gender:" id="gender" icon-name="gender" .value="${this.item?.personalInfo?.gender}" @input=${this.validateInput}></gender-input>
                    <birthday-input label="Data of Birth:" id="birthday" .value="${this.item?.personalInfo?.birthday}" @input=${this.validateInput}></birthday-input>
                </div>

        `;
    }

//     <div>
//     <simple-input id="firstName" icon-name="user" label="Country name:" .value=${this.item?.personalInfo?.firstName} @input=${this.validateInput}></simple-input>
//     <simple-input id="lastName" icon-name="flag-solid" label="Flag name:" .value=${this.item?.personalInfo?.lastName} @input=${this.validateInput}></simple-input>
// </div>
    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item.personalInfo
            if (!this.oldValues.has(e.target)) {
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value
            if (e.target.id === 'name') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

}

customElements.define("my-profile-section-1-page-1", MyProfileSection1Page1);