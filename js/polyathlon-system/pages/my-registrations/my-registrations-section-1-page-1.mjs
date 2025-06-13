import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import '../../../../components/inputs/gender-input.mjs'

import lang from '../../polyathlon-dictionary.mjs'

//import DataSet from './my-registrations-dataset.mjs'

import CompetitionStageDataset from '../my-competition-stages/my-competition-stages-dataset.mjs'
import CompetitionStageDataSource from '../my-competition-stages/my-competition-stages-datasource.mjs'

import RegistrationCategoryDataset from '../my-registration-items/my-registration-items-dataset.mjs'
import RegistrationCategoryDataSource from '../my-registration-items/my-registration-items-datasource.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

class MyRegistrationsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            registrationCategoryDataSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: {type: Object, default: null},
            item: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            oldValues: { type: Map, default: null},
            competitionStageDataSource: { type: Object, default: null},
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
                <simple-input id="name" label="${lang`Competition name`}:" icon-name="competition-solid" @icon-click=${() => this.showPage('my-competition-types')} .dataSource=${this.competitionTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="ekpNumber" label="${lang`EKP Number`}:" icon-name="ekp-number-solid" @icon-click=${this.copyToClipboard} .value=${this.item?.ekpNumber} @input=${this.validateInput}></simple-input>
                <simple-select id="stage" label="${lang`Stage`}:" icon-name="order-number-solid" @icon-click=${() => this.showPage('my-competition-stages')} .dataSource=${this.competitionStageDataSource} .value=${this.item?.stage} @input=${this.validateInput}></simple-select>
                <simple-input id="competitionPC" label="${lang`Competition PC`}:" icon-name="competition-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard} @button-click=${this.createCompetitionPC} .value=${this.item?.competitionPC} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="startDate" type="date" label="${lang`Start date`}:" icon-name="start-competition-solid" .value=${this.item?.startDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                    <simple-input id="endDate" type="date" label="${lang`End date`}:" icon-name="end-competition-solid" .value=${this.item?.endDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="lastName" icon-name="user" label="${lang`Last name`}:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="${lang`First name`}:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="${lang`Middle name`}:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <simple-input id="birthday" label="${lang`Date of birth`}:" icon-name="cake-candles-solid" .value=${this.item?.birthday} @input=${this.validateInput} lang="ru-Ru" type="date" ></simple-input>
                <gender-input id="gender" icon-name="gender" label="${lang`Gender`}:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="${lang`Region name`}:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} label="${lang`Club name`}:" .dataSource=${this.clubDataSource} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-input id="profileUlid" icon-name="hash-number-solid" @icon-click=${this.copyToClipboard} label="${lang`Sportsman Ulid`}:" .value=${this.item?.profileUlid} @input=${this.validateInput}></simple-input>
                <simple-input id="sportsmanPC" label="${lang`Sportsman PC`}:" .dataSource=${this.findDataSource} icon-name="sportsman-pc-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .value=${this.item?.sportsmanPC} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <simple-select id="category" icon-name="sports-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} label="${lang`Sports category`}:" .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" icon-name="order-number-solid" @icon-click=${this.numberClick} label="${lang`Order number`}:" .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" icon-name="link-solid" @icon-click=${this.linkClick} label="${lang`Order link`}:" .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" icon-name="user-link" @icon-click=${this.linkClick} label="${lang`Person link`}:" .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    async findSportsman(e) {
        const target = e.target
        let sportsman
        const value = target.value
        if (target.isShowList)
            target.isShowList = false
        if (!value) {
            const lastName = this.$id('lastName').value
            if (!lastName) {
                await this.errorDialog('Вы не задали фамилию для поиска')
                return
            }
            sportsman = await SportsmanDataset.getItemByLastName(lastName)
            if (sportsman.rows.length === 0) {
                this.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length >= 1) {
                this.findDataSource = {}
                this.findDataSource.items = sportsman.rows.map(item => item.doc)
                target.isShowList = true
                return
            }
            sportsman = sportsman.rows[0].doc
        } else if (value.includes(":")) {
            sportsman = await SportsmanDataset.getItem(value)
        } else if (target.value.includes("-")) {
            sportsman = await SportsmanDataset.getItemBySportsmanPC(value)
            if (sportsman.rows.length === 0) {
                this.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length > 1) {
                this.showDialog('Найдено несколько спортсменов с таким ID')
                return
            }
            sportsman = sportsman.rows[0].doc
        } else {
            sportsman = await SportsmanDataset.getItemByLastName(value)
            if (sportsman.rows.length >= 0) {
                this.findDataSource = sportsman.rows
            }
        }
        if (sportsman) {
            const inputs = this.$id()
            sportsman.sportsmanUlid = sportsman._id
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            // Object.assign(this.item, sportsman)
            this.requestUpdate()
        } else {
            this.showDialog('Такой спортсмен не найден')
        }
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
        //console.log({ ...sessionStorage });
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

            if (e.target.id === 'name' || e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        // }
    }

    async firstUpdated() {
        super.firstUpdated();
        this.registrationCategoryDataSource = new RegistrationCategoryDataSource(this, await RegistrationCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        this.competitionStageDataSource = new CompetitionStageDataSource(this, await CompetitionStageDataset.getDataSet())
    }
}

customElements.define("my-registrations-section-1-page-1", MyRegistrationsSection1Page1);