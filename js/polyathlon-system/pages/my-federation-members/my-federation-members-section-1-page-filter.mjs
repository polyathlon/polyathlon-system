import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/gender-input.mjs'
import '../../../../components/selects/simple-select.mjs'

import lang from '../../polyathlon-dictionary.mjs'


import FederationMemberPositionDataset from '../my-federation-member-positions/my-federation-member-positions-dataset.mjs'
import FederationMemberPositionDataSource from '../my-federation-member-positions/my-federation-member-positions-datasource.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

import DataSet from './my-federation-members-dataset.mjs'

class MyFederationMembersSection1PageFilter extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            federationMemberPositionDataSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
            findDataSource: { type: Object, default: null },
            item: { type: Object, default: null },
            currentItemRefresh: { type: Boolean, default: false, local: true },
            isFilterModified: { type: Boolean, default: false, local: true },
            oldValues: { type: Map, default: null },
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
                simple-input[hidden] {
                    display: none;
                }
            `
        ]
    }

    cityShowValue(item) {
        return item?.name ? `${item?.type?.shortName || ''} ${item?.name}` : ''
    }

    cityListLabel(item) {
        if (item?.name) {
            return item?.type?.shortName ? `${item?.type?.shortName} ${item?.name}` : item?.name
        }
        return ''
    }

    cityListStatus(item) {
        return { name: item?.region?.name ?? ''}
    }

    refereeListStatus(item) {
        return { name: item?.region?.name + (item?.city?.name ? ' ' + this.cityShowValue(item.city) : '') }
    }

    refereeListIcon(item) {
        return item?.gender == true ? "sportsman-woman-solid" : "sportsman-man-solid"
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" @icon-click=${this.gotoPersonalPage} .dataSource=${this.findDataSource} button-name="user-magnifying-glass-solid" @button-click=${this.findRefereeByName} .listLabel=${this.refereeListLabel} .listIcon=${this.refereeListIcon} .listStatus=${this.refereeListStatus.bind(this)} .value=${this.item?.lastName} @input=${this.validateInput} @select-item=${this.sportsmanChoose}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="position" label="${lang`Position`}:" icon-name="federation-member-position-solid" @icon-click=${() => this.showPage('my-federation-member-positions')} .dataSource=${this.federationMemberPositionDataSource} .value=${this.item?.position} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-input id="federationMemberPC" label="${lang`Federation member PC`}:" icon-name="federation-member-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createFederationMemberPC} .value=${this.item?.federationMemberPC} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    gotoPersonalPage() {
        if (!this.item?.refereeId) {
            return
        }
        location.hash = "#my-referee";
        location.search = `?referee=${this.item?.refereeId.split(':')[1]}`
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        if (e.target.id === 'city' && !e.target.value) {
            delete currentItem[e.target.id]
        }

        if (e.target.id === 'region' && !e.target.value) {
            delete currentItem[e.target.id]
        }

        this.isFilterModified = this.oldValues.size !== 0;
    }

    async findRefereeByName(e) {
        const target = e.target
        let sportsman
        const lastName = target.value
        if (target.isShowList)
            target.isShowList = false
        if (!lastName) {
            await this.errorDialog('Вы не задали фамилию для поиска')
            return
        }
        sportsman = await RefereeDataset.getItemByLastName(lastName)
        if (sportsman.rows.length === 0) {
            this.showDialog('Такой тренер не найден')
            return
        }

        if (sportsman.rows.length >= 1) {
            this.findDataSource = {}
            this.findDataSource.items = sportsman.rows.map(item => item.doc)
            target.isShowList = true
            return
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
            sportsman = await RefereeDataset.getItemBySportsmanPC(value)
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
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            this.item.refereeId = sportsman._id
            // Object.assign(this.item, sportsman)
            this.requestUpdate()
        } else {
            this.showDialog('Такой спортсмен не найден')
        }
    }

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            const inputs = this.$id()
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            this.item.refereeId = sportsman._id
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
    }

    async firstUpdated() {
        super.firstUpdated();
        this.federationMemberPositionDataSource = new FederationMemberPositionDataSource(this, await FederationMemberPositionDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-federation-members-section-1-page-filter", MyFederationMembersSection1PageFilter)