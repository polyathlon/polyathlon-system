import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

import '../dialogs/modal-dialog.mjs';
import './sign-up-form.mjs';
import './password-recovery-form.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/radio-group-input.mjs';
import '../inputs/simple-informer.mjs';
import '../inputs/groupbox-input.mjs';
import '../buttons/close-button.mjs';
import '../buttons/form-button.mjs';
import '../buttons/link-button.mjs';


import lang from '../../js/polyathlon-system/polyathlon-dictionary.mjs'

customElements.define("lot-form", class LotForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0'},
            opened: { type: Boolean, default: false},
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    user-select: none;
                    --form-label-input-color: black;
                }
                .form-footer {
                    display: flex;
                    justify-content: right;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
                .form {
                    width: 70%; /* Could be more or less, depending on screen size */
                    max-width: 700px;
                }

            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.items1 = [
            { name: 'По разрядам', checked: true },
            { name: 'По текущим местам' },
            { name: 'По предварительным результатам' },
            { name: 'Случайно' },
            { name: 'По личным рекордам' },
        ]
        this.items2 = [
            { name: 'Заканчивать первую группу', checked: true },
            { name: 'Не заканчивать группу' },
            { name: 'Заканчивать последнюю группу' },
        ]
        this.items3 = [
            { name: 'Лучшие в начале', checked: true },
            { name: 'Лучшие в конце' },
        ]
        this.items4 = [
            { name: 'В начале', checked: true },
            { name: 'В середине' },
            { name: 'В конце' },
        ]
        this.items5 = [
            { name: 'С учетом возрастных групп', checked: true },
            { name: 'Без учета возрастных групп' },
        ]
    }

    render() {
        return html`
            <div id="form-background" class="form-background" style=${this.opened ? 'display: block' : ''}>
                <modal-dialog></modal-dialog>
                <form class="form animate" method="post" id="form">
                    <div class="form-header">
                        <div class="form-tabs no-select">
                            <div class="form-tab" selected data-label=${lang`Sign in`}>${lang`Lot`}</div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <div class="name-group">
                                <simple-input id="initial.shift" label="${lang`Shooting initial shift`}:" icon-name="shift-solid" .value=${this.item?.shooting?.shift} @input=${this.validateInput}></simple-input>
                                <simple-input id="count.shield" label="${lang`Number of shields`}:" icon-name="shield-solid" .value=${this.item?.shooting?.shield} @input=${this.validateInput}></simple-input>
                                <simple-input id="initial.shield" label="${lang`Initial shield`}:" icon-name="shield-solid" .value=${this.item?.shooting?.shield} @input=${this.validateInput}></simple-input>
                            </div>
                            <div class="name-group">
                                <simple-input id="start.shift" label="${lang`Shift start time`}:" icon-name="clock-solid" .value=${this.item?.shooting?.start} @input=${this.validateInput}></simple-input>
                                <simple-input id="duration.shield" label="${lang`Shift duration`}:" icon-name="hourglass-clock-solid" .value=${this.item?.shooting?.duration} @input=${this.validateInput}></simple-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input label="${lang`Parameters of lot`}:" .items=${this.items1}></radio-group-input>
                                <radio-group-input label="${lang`End parameters`}:" .items=${this.items2}></radio-group-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input label="${lang`Order of the lot`}:" .items=${this.items3}></radio-group-input>
                                <radio-group-input label="${lang`Best shield`}:" .items=${this.items4}></radio-group-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input label="${lang`Lot age groups`}:" .items=${this.items5}></radio-group-input>
                            </div>
                        </div>
                    </div>

                    <div class="form-footer">
                        <form-button @click=${this.sendSimpleUser}>${lang`Start lot`}</form-button>
                        <form-button @click=${this.sendSimpleUser}>${lang`Cancel`}</form-button>
                    </div>
                </form>
            </div>
            `;
    }

    open() {
        this.opened = true;
        return new Promise((res, rej) => {
            this.resolveForm = res
            this.rejectFrom = rej
        })
    }

    close(modalResult) {
        this.opened = false

        if (modalResult == 'Ok')
            this.resolveForm(modalResult)
        else
            this.rejectFrom(modalResult)
    }
})