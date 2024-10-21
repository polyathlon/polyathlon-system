import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'

import CompetitionTypeDataSource from '../my-competition-types/my-competition-types-datasource.mjs'
import CompetitionTypeDataset from '../my-competition-types/my-competition-types-dataset.mjs'
import CompetitionKindDataSource from '../my-competition-kinds/my-competition-kinds-datasource.mjs'
import CompetitionKindDataset from '../my-competition-kinds/my-competition-kinds-dataset.mjs'
import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

class MyCompetitionSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            competitionTypeDataSource: {type: Object, default: null},
            competitionKindDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
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

                .right-container {
                    max-width: 600px;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="right-container">
                <simple-select id="name" icon-name="type-solid" @icon-click=${() => this.showPage('my-competition-types')} label="Name:" .dataSource=${this.competitionTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-select>
                <simple-select id="kind" icon-name="category-solid" @icon-click=${() => this.showPage('my-competition-kinds')} label="Name:" .dataSource=${this.competitionKindDataSource} .value=${this.item?.kind} @input=${this.validateInput}></simple-select>
                <simple-select id="city" icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="City name:" .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                    <div class="name-group">
                        <simple-input type="date" label="Дата начала:" id="startDate" icon-name="calendar-days-solid" .value=${this.item?.startDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                        <simple-input type="date" label="Дата окончания:" id="endDate" icon-name="calendar-days-solid" .value=${this.item?.endDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                    </div>
                </div>
        `;
    }

//     <div>
//     <simple-input id="firstName" icon-name="user" label="Country name:" .value=${this.item?.personalInfo?.firstName} @input=${this.validateInput}></simple-input>
//     <simple-input id="lastName" icon-name="flag-solid" label="Flag name:" .value=${this.item?.personalInfo?.lastName} @input=${this.validateInput}></simple-input>
// </div>
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
        this.competitionTypeDataSource = new CompetitionTypeDataSource(this, await CompetitionTypeDataset.getDataSet())
        this.competitionKindDataSource = new CompetitionKindDataSource(this, await CompetitionKindDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-competition-section-1-page-1", MyCompetitionSection1Page1);