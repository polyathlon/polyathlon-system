import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'

import lang from '../../polyathlon-dictionary.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

import ClubTypesDataset from '../my-club-types/my-club-types-dataset.mjs'
import ClubTypesDataSource from '../my-club-types/my-club-types-datasource.mjs'

class MyClubsSection1PageFilter extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
            clubTypesDataSource: { type: Object, default: null },
            item: { type: Object, default: null },
            currentItemRefresh: { type: Boolean, default: false, local: true },
            isFilterModified: { type: Boolean, default: false, local: true },
            oldValues: { type: Map, default: null },
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
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
            `
        ]
    }

    cityShowValue(item) {
        return item?.name ? `${item?.type?.shortName || ''} ${item?.name}` : ''
    }

    cityListLabel(item) {
        if (item?.name) {
            return item?.type?.shortName ? `${item?.type?.shortName} ${item?.name}` : item?.name
        }
        return ''
    }

    cityListStatus(item) {
        return { name: item?.region?.name ?? ''}
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="club-solid" label="${lang`Club name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="fullName" icon-name="club-solid" label="${lang`Full name`}:" .value=${this.item?.fullName} @input=${this.validateInput}></simple-input>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="${lang`Region name`}:" .dataSource=${this.regionDataSource} .value=${this.item?.city?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" .showValue=${this.cityShowValue} .listStatus=${this.cityListStatus} .listLabel=${this.cityListLabel} icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="${lang`City name`}:" .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-select id="type" icon-name="club-type-solid" @icon-click=${() => this.showPage('my-club-types')} label="${lang`Club type name`}:" .dataSource=${this.clubTypesDataSource} .value=${this.item?.type} @input=${this.validateInput}></simple-select>
                <simple-input id="clubPC" label="${lang`Club PC`}:" icon-name="club-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createClubPC} .value=${this.item?.clubPC} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    gotoPersonalPage() {
        if (!this.item?._id) {
            return
        }
        location.hash = "#my-club";
        location.search = `?club=${this.item?._id.split(':')[1]}`
    }

    async createClubPC(e) {
        const target = e.target
        const id = await DataSet.createRefereePC({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.region?.code
        })
        target.setValue(id)
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    linkClick(e) {
        window.open(e.target.value);
    }

    showPage(page) {
        location.hash = page;
    }

    numberClick(e) {
        window.open(this.$id('order.link').value);
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        if (e.target.id === 'city' && !e.target.value) {
            delete currentItem[e.target.id]
        }

        if (e.target.id === 'region' && !e.target.value) {
            delete currentItem[e.target.id]
        }

        this.isFilterModified = this.oldValues.size !== 0;
    }

    async showDialog(message, type='message', title='') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        if (title) {
            modalDialog.title = title
        }
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
    }

    async firstUpdated() {
        super.firstUpdated()
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        this.clubTypesDataSource = new ClubTypesDataSource(this, await ClubTypesDataset.getDataSet())
    }
}

customElements.define("my-clubs-section-1-page-filter", MyClubsSection1PageFilter)