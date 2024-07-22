import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("password-input", class PasswordInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'password' },
            required: { type: Boolean, default: false },
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            textAlign: { type: String, default: 'center' },
            iconName: { type: String, default: '', attribute: 'icon-name' },
            visibleIcon: { type: String, default: '', attribute: 'visible-icon' },
            invisibleIcon: { type: String, default: '', attribute: 'invisible-icon' },
            placeholder: { type: String, default: '' },
        }
    }

    static get styles() {
        return [
            styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    width: 100%;
                    user-select: none;
                    color: var(--form-input-color, gray);
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name="${this.iconName}"></simple-icon>
        `
    }

    changeType() {
        this.type = this.type === "text" ? "password" : "text"
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.type==="password" ? this.visibleIcon : this.invisibleIcon} @mouseenter=${this.changeType} @mouseleave=${this.changeType}></simple-icon>
        `
    }

    get value() {
        return this.renderRoot?.querySelector('#input')?.value ?? null;
    }

    set value(value) {
        const input = this.renderRoot?.querySelector('#input');
        if (input) {
            input.value = value;
        }
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input type=${this.type}
                    id="input"
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.value || nothing} @change=${this.changeValue}>
                ${this.iconName ? this.#icon : ''}
                ${this.visibleIcon || this.invisibleIcon ? this.#button : ''}
            </div>
        `;
    }
});