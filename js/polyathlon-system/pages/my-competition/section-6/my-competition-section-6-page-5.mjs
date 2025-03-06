import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'
import { throwingMask } from './masks.mjs'
import { isThrowingValid } from './validation.mjs'

class MyCompetitionSection6Page5 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
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

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <div class="name-group">
                    <simple-input id="flow" icon-name="throw-solid" label="${lang`Flow`}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.flow} @input=${this.validateInput}></simple-input>
                    <simple-input id="sector" icon-name="chart-pie-simple-solid" label="${lang`Sector`}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.sector} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="throw1" icon-name="throwing-ruler-solid" .mask=${throwingMask} label="${lang`Throw` + ' 1'}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.throw1} @input=${this.validateInput}></simple-input>
                    <simple-input id="throw2" icon-name="throwing-ruler-solid" .mask=${throwingMask} label="${lang`Throw` + ' 2'}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.throw2} @input=${this.validateInput}></simple-input>
                    <simple-input id="throw3" icon-name="throwing-ruler-solid" .mask=${throwingMask} label="${lang`Throw` + ' 3'}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.throw3} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="result" icon-name="map-location-dot-solid" .mask=${throwingMask} label="${lang`Result`}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.result} @input=${this.validateInput}></simple-input>
                    <simple-input id="points" icon-name="hundred-points-solid" label="${lang`Points`}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.points} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="place" icon-name="places-solid" label="${lang`Place`}:" .currentObject=${this.item?.throwing} .value=${this.item?.throwing?.place} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    resultToValue(result) {
        let parts = result.split(',')
        return +parts[0] * 10 + +minutes[1];
    }

    pointsFind(result, table) {
        let value  = resultToValue(result)
        return table.reduce((last, item) => {
            if (item.value <= value) {
                if (item.value <= value && item.points > last)
                    return item.points
                else
                    return last
            }
            return last;
        }, 0)
    }

    setPoints(target) {
        if (isThrowingValid(target.value)) {
            let a = this.parent.sportsDiscipline1.ageGroups.find( item => item.ageGroup._id === this.item.ageGroup._id)
            let b = a.sportsDisciplineComponents.find( item => item.group.name === "Метание")
            if (this.gender === "0") {
                this.$id("points").value = this.pointsFind(target.value, b.men)
            }
            else {
                this.$id("points").value = this.pointsFind(target.value, b.women)
            }
        }
        else {
            this.$id("points").value = ''
        }
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? {}
            if (!this.oldValues.has(e.target)) {
                this.item.shooting ??= currentItem
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

customElements.define("my-competition-section-6-page-5", MyCompetitionSection6Page5);