import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-discipline-names-section-1.mjs';
import '../../../../components/buttons/aside-button.mjs';

class MyDisciplineNames extends BaseElement {
    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    box-sizing: border-box;
                    height: 100%
                }
                aside {
                    display: flex;
                    flex-direction: column;
                }
            `
        ]
    }

    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
        }
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-discipline-names-section-1></my-discipline-names-section-1>
        `;
    }
}

customElements.define("my-discipline-names", MyDisciplineNames);