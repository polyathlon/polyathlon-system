import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-disciplines-section-1.mjs';

class MyDisciplines extends BaseElement {
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
            <my-disciplines-section-1></my-disciplines-section-1>
        `;
    }
}

customElements.define("my-disciplines", MyDisciplines);