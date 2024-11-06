import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './modal-dialog-css.mjs'
import '../buttons/close-button.mjs';

customElements.define('modal-dialog', class ModalDialog extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' },
            title: { type: String, default: 'Сообщение'},
            message: { type: String, default: 'Модальное окно'},
            opened: { type: Boolean, default: false},
            animateClose: { type: Boolean, default: false},
            type: {type: String, default: 'message'},
        }
    }

    static get styles() {
        return [
            formStyles,
            BaseElement.styles,
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

    #buttons() {
        switch (this.type) {
            case "confirm":
                return html`
                    <button class="footer-button" @click=${this.ok}>Да</button>
                    <button class="footer-button" @click=${this.close}>Нет</button>
                `
            case "message":
            case "error":
                return html`
                    <button class="footer-button" @click=${this.ok}>Ок</button>
                `
            default:
                break;
        }
    }
    render() {
        return html`
            <div class="modal-dialog ${this.opened ? 'show': ''} ${this.animateClose ? 'animate-close': ''}">
                <div class="modal-dialog-content animate">
                    <header>
                        <span id="dialog-title" class="dialog-title no-select">${this.title}</span>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </header>

                    <main>
                        <span id="message" class="no-select">${this.message}</span>
                    </main>

                    <footer>
                        <div class="footer-buttons">
                            ${this.#buttons()}
                        </div>
                    </footer>
                </div>
            </div>
        `;
    }

    show(message) {
        this.message = message;
        this.opened = true;
        return new Promise( resolve => {
            this.modalResult = resolve;
        })
    }

    ok() {
        this.opened = false;
        this.modalResult('Ok');
    }

    close() {
        this.opened = false;
        this.modalResult('Close');
    }
});