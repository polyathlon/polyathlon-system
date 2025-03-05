import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'
import { shootingMask } from './masks.mjs'
import { isShootingValid } from './result-validation.mjs'

class MyCompetitionSection6Page1 extends BaseElement {
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
                    <simple-input id="shift" icon-name="shift-solid" label="${lang`Shift`}:" .currentObject=${this.item?.shooting} .value=${this.item?.shooting?.shift} @input=${this.validateInput}></simple-input>
                    <simple-input id="shield" icon-name="shield-solid" label="${lang`Shield`}:" .currentObject=${this.item?.shooting} .value=${this.item?.shooting?.shield} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="result" icon-name="bullseye-sharp-solid" .mask=${shootingMask} label="${lang`Result`}:" .currentObject=${this.item?.shooting} .value=${this.item?.shooting?.result} @input=${this.validateInput}></simple-input>
                    <simple-input id="points" icon-name="hundred-points-solid" label="${lang`Points`}:" .currentObject=${this.item?.shooting} .value=${this.item?.shooting?.points} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="place" icon-name="places-solid" label="${lang`Place`}:" .currentObject=${this.item?.shooting} .value=${this.item?.shooting?.place} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }


    showPage(page) {
        location.hash = page;
    }

    ballFind(result, balls) {
        let value  = +result * 10
        return balls.reduce((last, item) => {
            if (item.value <= value) {
                if (item.value <= value && item.points > last)
                    return item.points
                else
                    return last
            }
            return last;
        }, 0)
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
                if (isShootingValid(e.target.value)) {
                    let a = this.parent.sportsDiscipline1.ageGroups.find( item => item.ageGroup._id === this.item.ageGroup._id)
                    let b = a.sportsDisciplineComponents.find( item => item.group.name === "Стрельба")
                    if (this.gender === "0") {
                        this.$id("points").value = b.men[0].points
                    }
                    else {
                        this.$id("points").value = this.ballFind(e.target.value, b.women)
                    }
                }
                else {
                    this.$id("points").value = ''
                }
                console.log(this.parent)
                console.log(this.item)
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

customElements.define("my-competition-section-6-page-1", MyCompetitionSection6Page1);