import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'

import FederationMemberCategoryDataset from '../../my-federation-member-categories/my-federation-member-categories-dataset.mjs'
import FederationMemberCategoryDataSource from '../../my-federation-member-categories/my-federation-member-categories-datasource.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

class MyFederationMemberSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            federationMemberCategoryDataSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
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

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="category" label="${lang`Category`}:" icon-name="federation-member-category-solid" @icon-click=${() => this.showPage('my-federation-member-categories')} .dataSource=${this.federationMemberCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-input id="federationMemberPC" label="${lang`Federation member PC`}:" icon-name="federation-member-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createFederationMemberPC} .value=${this.item?.federationMemberPC} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
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
        this.federationMemberCategoryDataSource = new FederationMemberCategoryDataSource(this, await FederationMemberCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-federation-member-section-1-page-1", MyFederationMemberSection1Page1);