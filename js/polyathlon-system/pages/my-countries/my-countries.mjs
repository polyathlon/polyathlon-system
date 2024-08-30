import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-countries-section-1.mjs';
import '../../../../components/buttons/aside-button.mjs';

class MyCountries extends BaseElement {
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
            <my-countries-section-1></my-countries-section-1>
        `;
    }
}

customElements.define("my-countries", MyCountries);