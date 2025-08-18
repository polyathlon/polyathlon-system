import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'
import { sprintMask } from './masks.mjs'
import { isSprintValid } from './validation.mjs'

class MyCompetitionSection6Page6 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
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

    sportsmanName(item) {
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
        return result
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-input id="sportsman" icon-name=${this.item?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid"} label="${lang`Sportsman`}:" .value=${this.sportsmanName(this.item)}></simple-input>
                <simple-input id="sportsNumber" label="${lang`Sports number`}:" icon-name="sports-number-solid" .value=${this.item?.sportsNumber} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                <div class="name-group">
                    <simple-input id="sprint" icon-name="sprint-solid" label="${lang`Race`}:" .currentObject=${this.item?.sprinting} .value=${this.item?.sprinting?.sprint} @input=${this.validateInput}></simple-input>
                    <simple-input id="track" icon-name="race-track-solid" label="${lang`Track`}:" .currentObject=${this.item?.sprinting} .value=${this.item?.sprinting?.track} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="result" icon-name="timer-solid" .mask=${sprintMask} label="${lang`Result`}:" .currentObject=${this.item?.sprinting} .value=${this.item?.sprinting?.result} @input=${this.validateInput}></simple-input>
                    <simple-input id="points" icon-name="hundred-points-solid" label="${lang`Points`}:" .currentObject=${this.item?.sprinting} .value=${this.item?.sprinting?.points} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="place" icon-name="places-solid" label="${lang`Place`}:" .currentObject=${this.item?.sprinting} .value=${this.item?.sprinting?.place} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    resultToValue(result) {
        let parts = result.split(',')
        return +parts[0] * 10 + +parts[1];
    }

    pointsFind(result, table) {
        let value = this.resultToValue(result)
        return table.reduce( (last, item) =>
            value <= item.value && item.points > last ? item.points : last
        , 0)
    }

    setPoints(target) {
        if (isSprintValid(target.value)) {
            let a = this.parent.sportsDiscipline1.ageGroups.find( item => item.ageGroup._id === this.item.ageGroup._id)
            let b = a.sportsDisciplineComponents.find( item => item.group.name === "Спринт")
            this.$id("points").value = this.pointsFind(target.value, this.item.gender == 0 ? b.men : b.women)
            this.$id("points").fire('input')
        }
        else {
            this.$id("points").value = ''
            this.$id("points").fire('input')
        }
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item.sprinting ?? {}
            if (!this.oldValues.has(e.target)) {
                this.item.sprinting ??= currentItem
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value

            if (e.target.id === "result")
            {
                this.setPoints(e.target)
            }

            this.isModified = this.oldValues.size !== 0;
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
        let input = this.$id("result")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
    }

}

customElements.define("my-competition-section-6-page-6", MyCompetitionSection6Page6);