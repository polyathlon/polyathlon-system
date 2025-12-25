import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'

import lang from '../../../polyathlon-dictionary.mjs'

import FederationMemberPositionDataSource from '../../my-federation-member-positions/my-federation-member-positions-datasource.mjs'
import FederationMemberPositionDataset from '../../my-federation-member-positions/my-federation-member-positions-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import FederationMembersDataset from '../../my-federation-members/my-federation-members-dataset.mjs'

class MyFederationMemberSection2Page4 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            federationMemberPositionSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
            federationMemberDataSource: { type: Object, default: null },
            findDataSource: { type: Object, default: null },
            item: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
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

                #birthday {
                    --text-align: center;
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


    sportsmanListLabel(item) {
        if (!item) {
            return item
        }
        let result = item.lastName ?? ''
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        result += (item.position?.shortName ? ' (' + item.position.shortName + ')' : '')
        return result
    }

    sportsmanListStatus(item) {
        return { name: item?.region?.name }
    }

    sportsmanListIcon(item) {
        return item?.gender == true ? "federation-member-woman-solid" : "federation-member-man-solid"
    }

    federationMemberShowValue(item) {
        if (!item) {
            return item
        }
        if (typeof item === 'string') {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        result += (item.position ? ' (' + item.position.shortName + ')' : '')
        return result
    }

    federationMemberListLabel(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        result += (item.position ? ' (' + item.position.shortName + ')' : '')
        return result
    }

    federationMemberListStatus(item) {
        return { name: item?.region?.name }
    }

    federationMemberListIcon(item) {
        return item?.gender == true ? "federation-member-woman-solid" : "federation-member-man-solid"
    }

    federationMemberIcon(item) {
        return item?.gender == true ? "federation-member-woman-solid" : "federation-member-man-solid"
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.payload?.lastName} .currentObject=${this.item?.payload} @input=${this.validateInput} .listLabel=${this.sportsmanListLabel} .listIcon=${this.sportsmanListIcon} .listStatus=${this.sportsmanListStatus} .dataSource=${this.findDataSource} button-name="user-magnifying-glass-solid" @button-click=${this.findSportsman} @select-item=${this.sportsmanChoose}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.payload?.firstName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.payload?.middleName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.payload?.gender}" .currentObject=${this.item?.payload} @input=${this.validateInput}></gender-input>
                <simple-select id="position" label="${lang`Position`}:" icon-name="federation-member-position-solid" @icon-click=${() => this.showPage('my-federation-member-positions')} .dataSource=${this.federationMemberPositionDataSource} .value=${this.item?.payload?.position} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-input id="federationMemberPC" label="${lang`Federation member PC`}:" icon-name="federation-member-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createFederationMemberPC} .value=${this.item?.payload?.federationMemberPC} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <simple-input id="federationMember" label="${lang`Federation member`}:" icon-name=${this.federationMemberIcon(this.item?.payload?.federationMember)} @icon-click=${() => this.showPage('my-federation-member')} .listStatus=${this.federationMemberListStatus} .dataSource=${this.federationMemberDataSource} .showValue=${this.federationMemberShowValue} button-name="user-magnifying-glass-solid" @button-click=${this.findFederationMember} .listLabel=${this.federationMemberListLabel} .listIcon=${this.federationMemberListIcon} .value=${this.item?.payload?.federationMember} .currentObject=${this.item?.payload} @input=${this.validateInput} @select-item=${this.federationMemberChoose}></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.payload?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.payload?.city} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
            </div>
        `;
    }

    async createFederationMemberPC(e) {
        const target = e.target
        const id = await DataSet.createFederationMemberPC({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.region?.code,
            ulid: this.item?.profileUlid,
        })
        target.setValue(id)
    }

    async findSportsman(e) {
        const target = e.target
        let sportsman
        const value = target.value
        if (target.isShowList)
            target.isShowList = false

        const lastName = this.$id('lastName').value
        if (!lastName) {
            await this.errorDialog('Вы не задали фамилию для поиска')
            return
        }
        sportsman = await FederationMembersDataset.getItemByLastName(lastName)
        if (sportsman.rows.length === 0) {
            this.parentNode.parentNode.host.showDialog('Такой представитель федерации не найден')
            return
        }
        if (sportsman.rows.length >= 1) {
            this.findDataSource = {}
            this.findDataSource.items = sportsman.rows.map(item => item.doc)
            target.isShowList = true
            return
        }
    }

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            this.$id('federationMember').setValue(sportsman)
            if (sportsman.federationMemberPC) {
                this.$id('federationMemberPC').setValue(sportsman.federationMemberPC)
            }
            this.requestUpdate()
        }
    }

    async findFederationMember(e) {
        const target = e.target
        let sportsman
        const value = target.value
        if (target.isShowList)
            target.isShowList = false

        // const lastName = this.$id('lastName').value
        const lastName = value instanceof Object ? value.lastName : value ? value.split?.(' ')?.[0] : this.$id('lastName').value

        if (!lastName) {
            await this.errorDialog('Вы не задали фамилию тренера для поиска')
            return
        }
        sportsman = await FederationMembersDataset.getItemByLastName(lastName)
        if (sportsman.rows.length === 0) {
            this.parentNode.parentNode.host.showDialog('Такой представитель федерации не найден')
            return
        }
        if (sportsman.rows.length >= 1) {
            this.federationMemberDataSource = {}
            this.federationMemberDataSource.items = sportsman.rows.map(item => item.doc)
            target.isShowList = true
            return
        }
    }

    federationMemberChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            this.$id('federationMember').setValue(sportsman)
            if (sportsman.federationMemberPC) {
                this.$id('federationMemberPC').setValue(sportsman.federationMemberPC)
            }
            this.requestUpdate()
        }
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    showPage(page) {
        location.hash = page;
    }

    linkClick(e) {
        window.open(e.target.value);
    }

    numberClick(e) {
        window.open(this.$id('order.link').value);
    }

    validateInput(e) {
        let id = e.target.id
        let currentItem = e.target.currentObject ?? this.item
        if (id == "order.number") {
            id = "number"
            if (!currentItem.order) {
                currentItem.order = {}
            }
            currentItem = currentItem.order
        }
        if (id == "order.link") {
            id = "link"
            if (!currentItem.order) {
                currentItem.order = {}
            }
            currentItem = currentItem.order
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

        if (e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName' || e.target.id === 'gender') {
            this.parentNode.parentNode.host.requestUpdate()
        }

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        this.federationMemberPositionDataSource = new FederationMemberPositionDataSource(this, await FederationMemberPositionDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }
}

customElements.define("my-federation-member-section-2-page-4", MyFederationMemberSection2Page4);