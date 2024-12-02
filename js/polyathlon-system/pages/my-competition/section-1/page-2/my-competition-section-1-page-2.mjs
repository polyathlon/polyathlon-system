import { BaseElement, html, css } from '../../../../../base-element.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/inputs/gender-input.mjs'
import '../../../../../../components/inputs/birthday-input.mjs'
import '../../../../../../components/selects/simple-select.mjs'

import SportsCategoryDataSource from '../../../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../../../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../../my-clubs/my-clubs-dataset.mjs'

import AgeGroupDataSource from '../../../my-age-groups/my-age-groups-datasource.mjs'
import AgeGroupDataset from '../../../my-age-groups/my-age-groups-dataset.mjs'

import Dataset from './my-competition-section-1-dataset.mjs'
import DataSource from './my-competition-section-1-datasource.mjs'

import SportsmanDataset from '../../../my-sportsmen/my-sportsmen-dataset.mjs'

class MyCompetitionSection1Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: { type: Object, default: null },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
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
                    <simple-input id="lastName" icon-name="user" label="Last name:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="First name:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="Middle name:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <birthday-input id="birthday" label="Data of birth:" .value="${this.item?.birthday}" @input=${this.validateInput}></birthday-input>
                <simple-input id="sportsmanId" .dataSource=${this.findDataSource} icon-name="id-number-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} label="Sportsman ID:" .value=${this.item?.sportsmanId} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <gender-input id="gender" icon-name="gender" label="Gender:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="ageGroup" icon-name="age-group-solid" @icon-click=${() => this.showPage('my-age-groups')} label="Age group:" .dataSource=${this.ageGroupDataSource} .value=${this.item?.ageGroup} @input=${this.validateInput}></simple-select>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} label="Club name:" .dataSource=${this.clubDataSource} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-select id="category" icon-name="sports-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} label="Sports category:" .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsmanUlid" icon-name=${+this.item?.gender ? "sportsman-woman-solid" : "sportsman-man-solid"} @icon-click=${() => this.showPage('my-sportsman')} label="Sportsman Ulid:" .value=${this.item?.sportsmanUlid} @input=${this.validateInput}></simple-input>
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
            sportsman = await SportsmanDataset.getItemBySportsmanId(value)
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

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            sportsman.sportsmanUlid = sportsman._id
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

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem);
    }
    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        // this.dataSource = new DataSource(this)
        // await this.dataSource.getItem()
        this.sportsman = await Dataset.getSportsman()
        Object.assign(this.item, this.sportsman)
        if ("_id" in this.sportsman) {
            this.item.sportsmanUlid = this.sportsman._id
        }
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
        this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }

}

customElements.define("my-competition-section-1-page-2", MyCompetitionSection1Page2);