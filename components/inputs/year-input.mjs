import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/simple-button.mjs'

import styles from './input-css.mjs'

customElements.define("year-input", class YearInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'date'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            oldValue: { type: String, default: ''},
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
            `
        ]
    }

    constructor() {
        super();
        const date = new Date();
        this.year = date.getFullYear();
        this.years = ['Year'];
        for (let i = this.year; i >= this.year - 80; i--) {
            this.years.push(i)
        }
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
        return html`
            <simple-icon class="icon" icon-name=${this.iconName}></simple-icon>
        `
    }

    // get value() {
    //     return this._value;
    // }

    // set value(value) {
    //     const oldValue = this.value;
    //     this._value = value;
    //     this.requestUpdate('value', oldValue);
    // }

    get value() {
        return this.renderRoot?.querySelector('select')?.value ?? null;
    }

    set value(value) {
        const input = this.renderRoot?.querySelector('select');
        if (input) {
            input.value= value;
        }
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing} @click=${this.updateLoginValue}></simple-icon>
        `
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <select>
                    ${this.years.map(year => html`<option ?selected=${year==="Year"} value=${year ==="Year" ? nothing : year}>${year}</option>`)}
                </select>
                ${this.iconName ? this.#icon : ''}
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        const options = {
            bubbles: true,
            composed: true
          };
        this.dispatchEvent(new CustomEvent('value-changed', options));
    }
});