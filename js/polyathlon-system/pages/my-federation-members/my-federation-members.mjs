import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-federation-members-section-1.mjs';

class MyFederationMembers extends BaseElement {
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
            <my-federation-members-section-1></my-federation-members-section-1>
        `;
    }
}

customElements.define("my-federation-members", MyFederationMembers);