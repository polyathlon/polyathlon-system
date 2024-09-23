import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'

class MyCountriesSection1Page1 extends BaseElement {
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
                .container {
                    max-width: 600px;
                }
            `
        ]
    }

    render() {
        return html`
            <div>
                <simple-input id="name" icon-name="country-solid" image-name=${this.item?.flag && 'https://hatscripts.github.io/circle-flags/flags/' + this.item?.flag + '.svg' } error-image="country-red-solid" label="Country name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="flag" icon-name="flag-solid" label="Flag:" .value=${this.item?.flag} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item
            if (!this.oldValues.has(e.target)) {
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value
            if (e.target.id === 'name' || e.target.id === 'flag') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            if (e.target.id === 'flag') {
                this.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

}

customElements.define("my-countries-section-1-page-1", MyCountriesSection1Page1);