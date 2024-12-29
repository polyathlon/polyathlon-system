import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'

import AgeGroupsDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupsDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

// import RefereePositionsDataset from '../../my-referee-positions/my-referee-positions-dataset.mjs'
// import RefereePositionsDataSource from '../../my-referee-positions/my-referee-positions-datasource.mjs'

// import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
// import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

// import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
// import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import RefereeDataset from '../../my-referees/my-referees-dataset.mjs'


class MySportsDisciplinesSection2Page1 extends BaseElement {
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
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-select id="ageGroup" label="${lang`Age group`}:" icon-name="referee-position-solid" @icon-click=${() => this.showPage('my-age-groups')} .dataSource=${this.ageGroupsDataSource} .value=${this.item?.ageGroup} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <!-- <simple-input id="refereeId" label="${lang`Referee ID`}:" .dataSource=${this.findDataSource} icon-name="id-number-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .value=${this.item?.refereeId} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input> -->
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

    // async findSportsman(e) {
    //     const target = e.target
    //     let sportsman
    //     const value = target.value
    //     if (target.isShowList)
    //         target.isShowList = false
    //     if (!value) {
    //         const lastName = this.$id('lastName').value
    //         if (!lastName) {
    //             await this.errorDialog('Вы не задали фамилию для поиска')
    //             return
    //         }
    //         sportsman = await RefereeDataset.getItemByLastName(lastName)
    //         if (sportsman.rows.length === 0) {
    //             this.showDialog('Такой спортсмен не найден')
    //             return
    //         }
    //         if (sportsman.rows.length >= 1) {
    //             this.findDataSource = {}
    //             this.findDataSource.items = sportsman.rows.map(item => item.doc)
    //             target.isShowList = true
    //             return
    //         }
    //         sportsman = sportsman.rows[0].doc
    //     } else if (value.includes(":")) {
    //         sportsman = await RefereeDataset.getItem(value)
    //     } else if (target.value.includes("-")) {
    //         sportsman = await RefereeDataset.getItemBySportsmanId(value)
    //         if (sportsman.rows.length === 0) {
    //             this.showDialog('Такой спортсмен не найден')
    //             return
    //         }
    //         if (sportsman.rows.length > 1) {
    //             this.showDialog('Найдено несколько спортсменов с таким ID')
    //             return
    //         }
    //         sportsman = sportsman.rows[0].doc
    //     } else {
    //         sportsman = await RefereeDataset.getItemByLastName(value)
    //         if (sportsman.rows.length >= 0) {
    //             this.findDataSource = sportsman.rows
    //         }
    //     }
    //     if (sportsman) {
    //         const inputs = this.$id()
    //         sportsman.refereeUlid = sportsman._id
    //         inputs.forEach(input => {
    //             if (input.id in sportsman) {
    //                 input.setValue(sportsman[input.id])
    //             }
    //         })
    //         // Object.assign(this.item, sportsman)
    //         this.requestUpdate()
    //     } else {
    //         this.showDialog('Такой спортсмен не найден')
    //     }
    // }

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

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        this.ageGroupsDataSource = new AgeGroupsDataSource(this, await AgeGroupsDataset.getDataSet())
        // this.refereePositionsDataSource = new RefereePositionsDataSource(this, await RefereePositionsDataset.getDataSet())
        // this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        // this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-sports-disciplines-section-2-page-1", MySportsDisciplinesSection2Page1);