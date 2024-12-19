import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'

import CompetitionTypeDataset from '../../my-competition-types/my-competition-types-dataset.mjs'
import CompetitionTypeDataSource from '../../my-competition-types/my-competition-types-datasource.mjs'

import CompetitionStageDataset from '../../my-competition-stages/my-competition-stages-dataset.mjs'
import CompetitionStageDataSource from '../../my-competition-stages/my-competition-stages-datasource.mjs'

import SportsDisciplineDataset from '../../my-sports-disciplines/my-sports-disciplines-dataset.mjs'
import SportsDisciplineDataSource from '../../my-sports-disciplines/my-sports-disciplines-datasource.mjs'

import RegionDataset from '../../my-regions/my-regions-dataset.mjs'
import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'

import CityDataset from '../../my-cities/my-cities-dataset.mjs'
import CityDataSource from '../../my-cities/my-cities-datasource.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

import DataSet from './my-competition-dataset.mjs'

class MyCompetitionSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            competitionTypeDataSource: {type: Object, default: null},
            competitionStageDataSource: {type: Object, default: null},
            sportsDisciplineDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
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
                <simple-select id="name" label="${lang`Competition name`}:" icon-name="competition-solid" @icon-click=${() => this.showPage('my-competition-types')} .dataSource=${this.competitionTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-select>
                <simple-select id="stage" label="${lang`Stage`}:" icon-name="order-number-solid" @icon-click=${() => this.showPage('my-competition-stages')} .dataSource=${this.competitionStageDataSource} .value=${this.item?.stage} @input=${this.validateInput}></simple-select>
                <simple-select id="sportsDiscipline1" label="${lang`Sports discipline` + ' 1:'} icon-name="category-solid" @icon-click=${() => this.showPage('my-sports-disciplines')} .dataSource=${this.sportsDisciplineDataSource} .value=${this.item?.sportsDiscipline1} @input=${this.validateInput}></simple-select>
                <simple-select id="sportsDiscipline2" label="${lang`Sports discipline` + ' 2:'} icon-name="category-solid" @icon-click=${() => this.showPage('my-sports-disciplines')} .dataSource=${this.sportsDisciplineDataSource} .value=${this.item?.sportsDiscipline2} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-input id="competitionId" label="${lang`Competition ID`}:" icon-name="id-number-solid" button-name="add-solid" @icon-click=${this.copyToClipboard} @button-click=${this.createCompetitionId} .value=${this.item?.competitionId} @input=${this.validateInput}></simple-input>
                <simple-input id="ekpNumber" label="${lang`EKP Number`}:" icon-name="square-list-sharp-solid" @icon-click=${this.copyToClipboard} .value=${this.item?.ekpNumber} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input type="date" label="${lang`Дата начала`}:" id="startDate" icon-name="calendar-days-solid" .value=${this.item?.startDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                    <simple-input type="date" label="${lang`Дата окончания`}:" id="endDate" icon-name="calendar-days-solid" .value=${this.item?.endDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                </div>
                <div class="name-group">
                    <simple-input type="date" label="${lang`Начало регистрации`}:" id="startRegistration" icon-name="calendar-days-solid" .value=${this.item?.startDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                    <simple-input type="date" label="${lang`Окончание регистрации`}:" id="endRegistration" icon-name="calendar-days-solid" .value=${this.item?.endDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                </div>
            </div>
        `;
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    async createCompetitionId(e) {
        const target = e.target
        const year = this.item.startDate.split("-")[0]
        const id = await DataSet.createCompetitionId({
            countryCode: this.item?.city?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.city?.region?.code,
            year,
        })
        target.setValue(id);
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item
            if (!this.oldValues.has(e.target)) {
                if (Array.isArray(e.target.value)) {
                    this.oldValues.set(e.target, e.target.oldValue)
                } else {
                    this.oldValues.set(e.target, e.target.value)
                }
            }
            else {
                const oldValue = this.oldValues.get(e.target)
                if (Array.isArray(oldValue) && oldValue.length === e.target.value.length) {
                    if (e.target.value.every(item1 => oldValue.some( item2 =>
                        item1.name ===  item2.name &&
                        item1.gender ===  item2.gender
                    ))) {
                        this.oldValues.delete(e.target)
                    }
                } else if (oldValue === e.target.value) {
                    this.oldValues.delete(e.target)
                }
            }

            currentItem[e.target.id] = e.target.value

            if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

    async firstUpdated() {
        super.firstUpdated();
        this.competitionTypeDataSource = new CompetitionTypeDataSource(this, await CompetitionTypeDataset.getDataSet())
        this.sportsDisciplineDataSource = new SportsDisciplineDataSource(this, await SportsDisciplineDataset.getDataSet())
        this.competitionStageDataSource = new CompetitionStageDataSource(this, await CompetitionStageDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }
}

customElements.define("my-competition-section-1-page-1", MyCompetitionSection1Page1);