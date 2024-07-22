import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/simple-button.mjs'

import styles from './input-css.mjs'

customElements.define("gender-input", class GenderInput extends BaseElement {
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
                    color: var(--form-label-input-color, white);
                    margin-top: 8px;
                }
                fieldset {
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                }

                label {
                    display: inline-flex;
                    line-height: 1rem;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }
                input {
                    appearance: none;
                    width: 1rem;
                    aspect-ratio: 1;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    margin: 0;
                    transition: .3s easy-in;
                }
                input:checked {
                    border-width: 4px;
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    get #legend() {
        return html`<legend>${this.label}</legend>`;
    }

    setChecked(gender) {
        const input = this.renderRoot.getElementById(gender);
        if (!input) {
            return false
        }
        return input.checked = this.value === gender;
    }
    render() {
        return html`
            <fieldset class="fieldset">
                ${this.label ? this.#legend : ''}
                <label><input type="radio" name="gender" ?checked=${this.setChecked("male")} id="male" value="male" @input=${this.changeValue}>Male</label>
                <label><input type="radio" name="gender" ?checked=${this.setChecked("female")} id="female" value="female" @input=${this.changeValue}>Female</label>
            </fieldset>
        `;
    }

    changeValue(e) {
        this.value = e.target.value
    }
});