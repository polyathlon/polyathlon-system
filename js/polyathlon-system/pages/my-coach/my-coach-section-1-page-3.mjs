import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import '../../../../components/inputs/gender-input.mjs'
import '../../../../components/inputs/birthday-input.mjs'

import DataSet from '../my-sportsman-registrations/my-sportsman-registrations-dataset.mjs'

import SportsCategoryDataSource from '../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../my-clubs/my-clubs-dataset.mjs'

class MyRefereeSection1Page3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
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
                <div class="name-group">
                    <simple-input id="lastName" icon-name="user" label="LastName:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="FistName:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="MiddleName:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <birthday-input id="birthday" label="Data of Birth:" .value="${this.item?.birthday}" @input=${this.validateInput}></birthday-input>
                <gender-input id="gender" icon-name="gender" label="Gender:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="region" icon-name="region-solid" .iconClick=${() => this.showPage('my-regions')} label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" icon-name="club-solid" .iconClick=${() => this.showPage('my-clubs')} label="Club name:" .dataSource=${this.clubDataSource} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-input id="profileUlid" icon-name="card-id-solid" .iconClick=${this.copyToClipboard} label="Sportsman ulid:" .value=${this.item?.profileUlid} @input=${this.validateInput}></simple-input>
                <simple-input id="hashNumber" icon-name="hash-number-solid" button-name="add-solid" .iconClick=${this.copyToClipboard}  .buttonClick=${this.createHashNumber} label="Sportsman number:" .value=${this.item?.hashNumber} @input=${this.validateInput}></simple-input>
                <simple-select id="category" icon-name="sports-category-solid" .iconClick=${() => this.showPage('my-sports-categories')} label="Category name:" .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" icon-name="order-number-solid" .iconClick=${this.numberClick} label="Order number:" .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" icon-name="link-solid" .iconClick=${this.linkClick} label="Order link:" .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" icon-name="user-link" .iconClick=${this.linkClick} label="Person link:" .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    async createHashNumber() {
        const host = this.getRootNode().host
        const hashNumber = await DataSet.createHashNumber({
            countryCode: host.item?.region?.country?.flag.toUpperCase(),
            regionCode: host.item?.region?.code,
            ulid: host.item?.profileUlid,
        })
        this.value = hashNumber;
    }

    copyToClipboard() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.value)
        }
    }

    showPage(page) {
        location.hash = page;
    }

    linkClick(e) {
        window.open(this.value);
    }

    numberClick(e) {
        window.open(this.getRootNode().host.$id('order.link').value);
    }

    validateInput(e) {
        if (e.target.value !== "") {
            let id = e.target.id
            let currentItem = this.item
            if (id == "order.number") {
                id = "number"
                if (!this.item.order) {
                    this.item.order = {}
                }
                currentItem = this.item.order
            }
            if (id == "order.link") {
                id = "link"
                if (!this.item.order) {
                    this.item.order = {}
                }
                currentItem = this.item.order
            }

            if (!this.oldValues.has(e.target)) {
                if (currentItem[id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[id] = e.target.value

            if ( e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName' || e.target.id === 'gender' ) {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

    async firstUpdated() {
        super.firstUpdated();
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
    }
}

customElements.define("my-coach-section-1-page-3", MyRefereeSection1Page3);