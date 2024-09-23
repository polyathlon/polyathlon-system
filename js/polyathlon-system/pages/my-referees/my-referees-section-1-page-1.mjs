import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import RefereeCategoryDataSource from '../my-referee-categories/my-referee-categories-datasource.mjs'
import RefereeCategoryDataset from '../my-referee-categories/my-referee-categories-dataset.mjs'
import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

class MyRefereesSection1Page1 extends BaseElement {
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
                <simple-select id="category" icon-name="judge-rank-solid" label="Category name:" .dataSource=${this.refereeCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-select id="region" icon-name="region-solid" label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-input id="order" icon-name="flag-solid" label="Order number:" .currentObject={this.item?.order} .value=${this.item?.order.name} @input=${this.validateInput}></simple-input>
                <simple-input id="orderLink" icon-name="flag-solid" label="Order link:" .currentObject={this.item?.order} .value=${this.item?.order.link} @input=${this.validateInput}></simple-input>
                <simple-input id="personLink" icon-name="user" label="Person link:" .value=${this.item?.link} @input=${this.validateInput}></simple-input>
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
        this.refereeCategoryDataSource = new RefereeCategoryDataSource(this, await RefereeCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
    }
}

customElements.define("my-referees-section-1-page-1", MyRefereesSection1Page1);