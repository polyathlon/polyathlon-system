import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/simple-button.mjs'
import '../buttons/country-button.mjs'

import styles from '../inputs/input-css.mjs'

customElements.define("simple-select", class SimpleInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            oldValue: { type: String, default: ''},
            isFocus: {type: Boolean, default: false},
            dataSource: {type: Object, default: null},
            currentItem: {type: Object, default: null},
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

    // get value() {
    //     return this.renderRoot?.querySelector('input')?.value ?? null;
    // }

    // set value(value) {
    //     const input = this.renderRoot?.querySelector('input');
    //     if (input) {
    //         input.value= value;
    //     }
    // }

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
                    .value=${this.value || ''}
                    @input=${this.changeValue}
                    @focus=${this.changeFocus}


                >
                ${this.iconName ? this.#icon : ''}
                ${this.buttonName ? this.#button : ''}
            </div>
            ${this.isFocus ? this.#list : ''}
        `;
    }

    get #list() {
      return html`
        ${this.dataSource?.items?.map((item, index) =>
          html `
            <country-button
              label=${item.name}
              title=${item._id}
              .logotype=${item.flag && 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' }
              .status=${this.statusDataSet?.get(item._id)}
              ?selected=${this.currentItem === item}
              @click=${() => this.selectItem(index, item._id)}
            >
            </country-button>
      `)}
      `
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        this.value = e.target.value;
    }

    changeFocus(e) {
      this.isFocus = true;
    }

    selectItem(index, indexId) {
        alert(index)
    }
});