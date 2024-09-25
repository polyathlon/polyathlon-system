import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'

import CountryDataSource from '../my-countries/my-countries-datasource.mjs'
import CountryDataset from '../my-countries/my-countries-dataset.mjs'

class MyRegionsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            countryDataSource: {type: Object, default: null},
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
                #country {
                    --icon-height: 90%;
                    --image-height: 90%
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="region-solid" label="Region name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-select id="country" icon-name="country-solid" image-name=${this.item?.country?.flag && 'https://hatscripts.github.io/circle-flags/flags/' + this.item?.country?.flag + '.svg' } error-image="country-red-solid" label="Country:" .dataSource=${this.countryDataSource} .value=${this.item?.country} @input=${this.validateInput}></simple-select>
                <simple-input id="link" icon-name="region-solid" label="Link:" .value=${this.item?.link} @input=${this.validateInput}></simple-input>
                <simple-input id="code" icon-name="order-number-solid" label="Code:" .value=${this.item?.code} @input=${this.validateInput}></simple-input>
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
            if (e.target.id === 'name') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            if (e.target.id === 'country') {
                this.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }
    async firstUpdated() {
        super.firstUpdated();
        this.countryDataSource = new CountryDataSource(this, await CountryDataset.getDataSet())
    }
}

customElements.define("my-regions-section-1-page-1", MyRegionsSection1Page1);