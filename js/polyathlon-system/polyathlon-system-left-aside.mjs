import { BaseElement, html, css, nothing } from '../base-element.mjs'


import '../../components/buttons/aside-button.mjs';

class PolyathlonSystemLeftAside extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            successUserIn: { type: Boolean, default: false, local: true},
            activePage: { type: String, default: '', local: true },
            notificationMaxOffset: { type: String, default: '', local: true },
            notificationCurrentOffset: { type: String, default: '', local: true },
        }
    }

    get title() {
        return 'Vladislav Antoshkin';
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0;
                    height: 100%;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }
                nav {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.buttons = [
            {iconName: 'house-sharp-solid', title: 'Home', page: 'home-page', click: () => this.showPage('')},
            {iconName: 'user', title: 'Profile', page: 'my-profile', click: () => this.showPage('my-profile')},
            {iconName: 'square-list-sharp-solid', page: 'my-projects', title: 'Project', click: () => this.showPage('my-projects')},
            // {name: 'square-list-sharp-solid', title: 'Project', click: () => this.showPage('my-projects')},
            // {name: 'chart-pie-simple-circle-dollar-solid', title: 'tariff plan', click: () => this.showPage('traffic-plan')},
            // {name: 'download-file', title: 'Download File', click: () => this.showPage('my-projects')},
            // {name: 'credit-card', title: 'Tariff Plans', click: () => this.showPage('tariff-plans')},
            {iconName: 'chart-pie-simple-circle-dollar-solid', page: 'tariff-plans', title: 'Tariff Plans', click: () => this.showPage('tariff-plans')},
            {iconName: 'bell-sharp-solid', page: 'my-notifications', title: 'Notifications', blink: 1, click: () => this.showPage('my-notifications')},
            {iconName: 'settings-solid', page: 'my-settings', title: 'Settings', click: () => this.showPage('my-settings')},
        ]
        console.log(this.notificationMaxOffset);
        console.log(this.notificationCurrentOffset);
    }


    showPage(page) {
        location.hash = page;
    }

    render() {
        console.log('aside',this.notificationCurrentOffset)
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
            <aside-button icon-name="right-from-bracket-solid" title="Sign Out" @click=${this.signOut}></aside-button>
        `;
    }

    clearStorage(){
        if (localStorage.getItem('rememberMe')) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('accessUserToken');
            localStorage.removeItem('refreshUserToken');
        }
        else {
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('rememberMe');
            sessionStorage.removeItem('accessUserToken');
            sessionStorage.removeItem('refreshUserToken');
        }
    }

    signOut() {
        this.successUserIn = false;
        this.clearStorage();
        window.location.hash = '';
    }

    firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("polyathlon-system-left-aside", PolyathlonSystemLeftAside);