import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-referees-section-1.mjs';

class MyReferees extends BaseElement {
    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    height: 100%
                }
            `
        ]
    }

    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
        }
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-referees-section-1></my-referees-section-1>
        `;
    }
}

customElements.define("my-referees", MyReferees);