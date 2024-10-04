import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'

import DataSet from './my-referees-dataset.mjs'

import RefereeCategoryDataSource from '../my-referee-categories/my-referee-categories-datasource.mjs'
import RefereeCategoryDataset from '../my-referee-categories/my-referee-categories-dataset.mjs'
import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

class MyRefereesSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            refereeCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
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
                    <simple-input id="lastName" icon-name="user" label="Referee LastName:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="Referee FistName:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="Referee MiddleName:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <simple-select id="category" icon-name="referee-category-solid" .iconClick=${() => this.showPage('my-referee-categories')} label="Category name:" .dataSource=${this.refereeCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-select id="region" icon-name="region-solid" label="Region name:" .iconClick=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-input id="hashNumber" icon-name="hash-number-solid" button-name="add-solid" .iconClick=${this.copyToClipboard} .buttonClick=${this.createHashNumber} label="Sportsman number:" .value=${this.item?.hashNumber} @input=${this.validateInput}></simple-input>
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
        this.setValue(hashNumber)
    }

    copyToClipboard() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.value)
        }
    }

    linkClick(e) {
        window.open(this.value);
    }

    showPage(page) {
        location.hash = page;
    }

    numberClick(e) {
        window.open(this.getRootNode().host.$id('order.link').value);
    }

    validateInput(e) {
        // if (e.target.value !== "") {
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

            if ( e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        // }
    }

    async firstUpdated() {
        super.firstUpdated();
        this.refereeCategoryDataSource = new RefereeCategoryDataSource(this, await RefereeCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
    }
}

customElements.define("my-referees-section-1-page-1", MyRefereesSection1Page1);