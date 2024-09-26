import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/simple-button.mjs'

import styles from './input-css.mjs'

customElements.define("simple-input", class SimpleInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            imageName: { type: String, default: '', attribute: 'image-name'},
            iconClick: { type: Function, default: undefined},
            errorImage: { type: String, default: 'error-image', attribute: 'error-image'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            oldValue: { type: String, default: ''},
            currentObject: { type: Object, default: undefined},
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
                    color: var(--form-input-color, gray);
                }
                img {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: relative;
                    height: 28px;
                    aspect-ratio: 1 / 1;
                    position: absolute;
                    left: 8px;
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.oldValue ??= this.value;
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        if (!this.iconName) {
            return ''
        }
        return html`
            <simple-icon class="icon" icon-name=${this.iconName} @click=${this.iconClick || nothing}></simple-icon>
        `
    }

    get #image() {
        if (!this.imageName) {
            return this.#icon
        }
        return html`
            <img src=${this.imageName} alt="" title=${this.title || nothing} @error=${this.defaultImage} @click=${this.iconClick || nothing}/>
        `
    }

    defaultImage(e) {
        e.target.src = `../../images/${this.errorImage}.svg`
        e.onerror = null
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing}></simple-icon>
        `
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input type=${this.type}
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.value || ''} @input=${this.changeValue}
                >
                ${this.#image}
                ${this.buttonName ? this.#button : ''}
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        this.value = e.target.value;
    }
});