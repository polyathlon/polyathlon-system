import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-competitions-section-1.mjs';
import '../../../../components/buttons/aside-button.mjs';

class MyCompetitions extends BaseElement {
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
            <my-competitions-section-1></my-competitions-section-1>
        `;
    }
     dd() {
        let a = {
            "_id": "competition:01H21JXETHH6GX2YVHK84AZB52",
            "_rev": "1-aa00965d199c1e454d9ba33ddba3f0a9",
            "name": "Первенство России",
            "eventDate": "01.06.2023",
            "eventPlace": "Губкин",
            "regionDelegateNumber": "70",
            "clubDelegateNumber": "70",
            "language": "Русский",
            "year": "2023",
            "competitionKind": "competitionkind:01H1PRNSJDE9HGWWYQXA9F1TM3"
          }
        a._id
        a.clubDelegateNumber
     }
}

customElements.define("my-competitions", MyCompetitions);