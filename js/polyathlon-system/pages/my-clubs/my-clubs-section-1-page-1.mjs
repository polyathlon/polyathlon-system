import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import CountryDataSource from '../my-countries/my-countries-datasource.mjs'
import CountryDataset from '../my-countries/my-countries-dataset.mjs'
import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'
import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

class MyClubsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            countryDataSource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
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
                    align-items: center;
                    overflow-x: hidden;
                    gap: 10px;
                }
                .container {
                    width: 600px;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="club-solid" label="Club name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-select id="country" icon-name="earth-americas-solid" image-name=${this.item?.country?.flag && 'https://hatscripts.github.io/circle-flags/flags/' + this.item?.country?.flag + '.svg'} label="Country name:" .dataSource=${this.countryDataSource} .value=${this.item?.country} @input=${this.validateInput}></simple-select>
                <simple-select id="region" icon-name="regions-solid" label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" icon-name="city-solid" label="City name:" .dataSource=${this.cityDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
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
            this.isModified = this.oldValues.size !== 0;
        }
    }
    async firstUpdated() {
        super.firstUpdated();
        this.countryDataSource = new CountryDataSource(this, await CountryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }
}

customElements.define("my-clubs-section-1-page-1", MyClubsSection1Page1);