import { BaseElement, html, css } from '../base-element.mjs'

import './polyathlon-system-header.mjs';
import './polyathlon-system-footer.mjs';
import './polyathlon-system-left-aside.mjs';

import './pages/home-page/home-page.mjs'

class PolyathlonSystem extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' },
            successUserIn: { type: Boolean, default: false, attribute: 'auth', reflect: true, local: true},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    height: 1vh;
                    display: grid;
                    grid-template-columns: 0px 1fr;
                    grid-template-areas:
                      "header header"
                      "aside content"
                      "footer footer";

                    // flex-direction: column;
                    // justify-content: center;
                    position: relative;
                }
                :host([auth]) {
                    grid-template-columns: 50px 3fr;
                }
                main {
                    grid-area: content;
                    height: calc(100vh - 80px - var(--polyathlon-footer-height, 80px));
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                    box-sizing: border-box;
                }
                polyathlon-system-header {
                    grid-area: header;
                }
                polyathlon-system-aside {
                    grid-area: aside;
                }
                polyathlon-system-footer {
                    grid-area: footer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.successUserIn = this.isAuth();



        addEventListener("project-status", (e) => {
            console.log(e)
        });

        addEventListener("hashchange", () => {this.requestUpdate()});
        // this.lazyLoad = {};
        // this.lazyLoad[Symbol.iterator] = function* () {
        //     var index = 0;
        //     while (true) {
        //         console.log(index);
        //         yield index++;
        //     }
        // }
    }

    get pageName() {
        return location.hash.startsWith('#') ? location.hash.slice(1) : location.hash || 'home-page';
    }

    * lazyLoad() {
        // const lazyPages=['about-me', 'my-pride', 'my-stack', 'catch-me'];
        const lazyPages=[];
        for (const pageName of lazyPages) {
            import(`./pages/${pageName}/${pageName}.mjs`);
            yield pageName;
        }
    }

    isAuth() {
        if (localStorage.getItem('rememberMe')) {
            return localStorage.getItem('accessUserToken')
        }
        else {
            return sessionStorage.getItem('accessUserToken')
        }
    }

    leftAside() {
        return html`<polyathlon-system-left-aside></polyathlon-system-left-aside>`
    }

    render() {
        // const pagesPath = isAuth ? './pages/profile' : './pages'
        const pagesRootPath = './pages'
        if (!window.customElements.get(this.pageName)) {
            import(`./pages/${this.pageName}/${this.pageName}.mjs`);
        }
        const page = document.createElement(this.pageName);
        return html`
            <polyathlon-system-header active-page="${this.pageName}"></polyathlon-system-header>
            ${this.successUserIn ? this.leftAside() : ""}
            <main>
                ${page}
            </main>
            <polyathlon-system-footer></polyathlon-system-footer>
        `;
    }

    isAuth(){
        return localStorage.getItem('rememberMe') ?
            'accessUserToken' in localStorage :
            'accessUserToken' in sessionStorage;
    }

    firstUpdated() {
        super.firstUpdated();
        const lazyIterator = this.lazyLoad();
        const lazyInterval = setInterval(() => lazyIterator.next().done ? clearInterval(lazyInterval) : '', 2000);
    }
}

customElements.define("polyathlon-system", PolyathlonSystem);