import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import RefereeCategoriesDataset from '../../my-referee-categories/my-referee-categories-dataset.mjs'
import RefereeCategoriesDataSource from '../../my-referee-categories/my-referee-categories-datasource.mjs'

import RefereePositionsDataset from '../../my-referee-positions/my-referee-positions-dataset.mjs'
import RefereePositionsDataSource from '../../my-referee-positions/my-referee-positions-datasource.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import RefereeDataset from '../../my-referees/my-referees-dataset.mjs'


class MyCompetitionSection3Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            refereeCategoriesDataSource: {type: Object, default: null},
            refereePositionsDataSource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
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
            <modal-dialog></modal-dialog>
            <div class="container">
                <div class="name-group">
                    <simple-input id="lastName" icon-name="user" label="LastName:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="FirstName:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="MiddleName:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <simple-input id="refereeId" .dataSource=${this.findDataSource} icon-name="id-number-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} label="Referee ID:" .value=${this.item?.refereeId} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <simple-select id="position" icon-name="referee-position-solid" @icon-click=${() => this.showPage('my-referee-positions')} label="Position:" .dataSource=${this.refereePositionsDataSource} .value=${this.item?.position} @input=${this.validateInput}></simple-select>
                <gender-input id="gender" icon-name="gender" label="Gender:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="City name:" .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-select id="category" icon-name="sports-category-solid" @icon-click=${() => this.showPage('my-referee-categories')} label="Category:" .dataSource=${this.refereeCategoriesDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="refereeUlid" icon-name=${+this.item?.gender ? "referee-woman-solid" : "referee-man-solid"} @icon-click=${() => this.showPage('my-referee')} label="Referee Ulid:" .value=${this.item?.refereeUlid} @input=${this.validateInput}></simple-input>
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
            if (e.target.id === 'birthday' || e.target.id === 'gender') {
                try {
                    this.changeAgeGroup()
                    this.requestUpdate()
                }
                catch {

                }
            }
            this.isModified = this.oldValues.size !== 0;
        }
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
            sportsman = await RefereeDataset.getItemByLastName(lastName)
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
            sportsman = await RefereeDataset.getItem(value)
        } else if (target.value.includes("-")) {
            sportsman = await RefereeDataset.getItemBySportsmanId(value)
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
            sportsman = await RefereeDataset.getItemByLastName(value)
            if (sportsman.rows.length >= 0) {
                this.findDataSource = sportsman.rows
            }
        }
        if (sportsman) {
            const inputs = this.$id()
            sportsman.refereeUlid = sportsman._id
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

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            sportsman.refereeUlid = sportsman._id
            const inputs = this.$id()
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            //Object.assign(this.item, sportsman)
            this.requestUpdate()
        }
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

    changeAgeGroup() {
        const gender = this.$id('gender').value
        const year = this.$id('birthday').value.split('.')[2]
        if ((gender || gender === 0) && year) {
            const ageGroupComponent = this.$id('ageGroup')
            const nowYear = this.parent.startDate.split("-")[0]
            const age = nowYear - year
            const item = this.parent.ageGroups.find( item => item.gender == gender && age >= item.minAge && age <= item.maxAge)
            if (item) {
                ageGroupComponent.setValue(item)
            } else {
                this.errorDialog("Такая возрастная группа в соревновании не найдена")
                delete this.item.ageGroup
                ageGroupComponent.setValue('')
            }
        }
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        this.refereeCategoriesDataSource = new RefereeCategoriesDataSource(this, await RefereeCategoriesDataset.getDataSet())
        this.refereePositionsDataSource = new RefereePositionsDataSource(this, await RefereePositionsDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-competition-section-3-page-1", MyCompetitionSection3Page1);