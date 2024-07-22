import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './modal-dialog-css.mjs'
import '../buttons/close-button.mjs';

customElements.define('modal-dialog', class ModalDialog extends BaseElement {

    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' },
            message: { type: String, default: 'Модальное окно'},
            opened: { type: Boolean, default: false},
            animateClose: { type: Boolean, default: false}
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    color: var(--form-color);
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <div id="dialog" class="modal-dialog ${this.opened ? 'show': ''} ${this.animateClose ? 'animate-close': ''}">
                <div class="modal-dialog-content animate" id="modal-dialog">
                    <div class="dialog-header">
                        <span id="dialog-title" class="dialog-title no-select">Message</span>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="dialog-body">
                        <span id="message" class="no-select">${this.message}</span>
                    </div>

                    <div class="dialog-footer no-select">
                        <div class="footer-buttons">
                            <button type="button" id="ok-button" class="footer-button btn-ok" @click=${()=>this.ok()}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
    }

    show(message) {
        this.message = message;
        this.opened = true;
        return new Promise( resolve => {
            this.modalResult = resolve;
        })
    }

    ok() {
        this.modalResult('Ok');
        this.opened = false;
    }

    close() {
        this.opened = false;
        this.modalResult('Close');
    }
});