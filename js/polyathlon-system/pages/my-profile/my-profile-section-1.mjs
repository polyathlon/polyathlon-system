import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/country-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import './my-profile-section-1-page-1.mjs'
// import './my-competitions-section-1-page-2.mjs'

class MyProfileSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSet: {type: Array, default: []},
            statusDataSet: {type: Map, default: null },
            oldValues: {type: Map, default: null },
            currentItem: {type: Object, default: null},
            isModified: {type: Boolean, default: "", local: true},
            isReady: {type: Boolean, default: true},
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: {type: BigInt, default: 0},
            isFirst: {type: Boolean, default: false}
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "sidebar content"
                        "footer  footer";
                    gap: 0 20px;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #competition-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #competition-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                    gap: 10px;
                }

                .avatar {
                    width: 100%
                }

                avatar-input {
                    width: 80%;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    overflow-y: auto;
                    overflow-x: hidden;
                    grid-area: content;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 20px;
                    background: var(--layout-background-color);
                }

                 /* width */
                 ::-webkit-scrollbar {
                    width: 10px;
                }

                /* Track */
                ::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 5px grey;
                    border-radius: 5px;
                }

                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background: red;
                    border-radius: 5px;
                }

                h1 {
                    font-size: 3.4375rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                h2 {
                    font-weight: 300;
                    line-height: 1.2;
                    font-size: 1.25rem;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                a {
                    display: inline-block;
                    text-transform: uppercase;
                    color: var(--native-color);
                    margin: 20px auto 0 0;
                    background-color: var(--background-green);
                    letter-spacing: 1px;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    border-radius: 0;
                    font-weight: 600;
                }

                a:hover {
                    background-color: var(--button-hover-color);
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }
                #drop_zone {
                    border: 5px solid blue;
                    width: 200px;
                    height: 100px;
                }

                .left-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                .right-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                simple-icon[visible] {
                    display: none;
                }

            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Person information', 'Passport information']
        this.currentPage = 0;
        this.oldValues = new Map();
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._rev, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(index, itemId) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok')
                this.saveItem().then(() => this.currentItem = this.dataSet[index]);
        }
        else {
            this.setCurrentItem(this.dataSet[index])
        }
    }

    #page() {
        return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    #page1() {
        return html`
            <my-profile-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-profile-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-profile-section-1-page-1 .item=${this.currentItem}></my-profile-section-1-page-1>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    get #loginInfo() {
        if (localStorage.getItem('rememberMe')) {
            return localStorage.getItem('userInfo')
        }
        else {
            return sessionStorage.getItem('userInfo')
        }
    }
    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <header id="competition-header"><p>Profile ${this.currentItem?.name}</p></header>
            <header id="property-header">${this.#pageName}</header>
            <div class="left-layout">
                <div class="avatar">
                    ${this.isFirst ? html`<avatar-input id="avatar" .currentObject=${this} .avatar=${this.avatar || 'images/no-avatar.svg'} @input=${this.validateAvatar}></avatar-input>` : ''}
                </div>
                <div class="label">
                    ${JSON.parse(this.#loginInfo).login}
                </div>
                <div class="statistic">
                    <statistic-button label="Projects" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                    <statistic-button label="Sales" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                    <statistic-button label="Wallet" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                </div>
            </div>
            <div class="right-layout">
                <div class="left-aside">
                    <simple-icon icon-name="square-arrow-left-sharp-solid" @click=${this.prevPage} ?visible=${this.currentPage === 0} title=${this.pageNames[this.currentPage - 1]}></simple-icon>
                </div>
                ${this.#page()}
                <div class="right-aside">
                    <simple-icon icon-name="square-arrow-right-sharp-solid" @click=${this.nextPage} ?visible=${this.currentPage === this.pageNames.length - 1} title=${this.pageNames[this.currentPage + 1]}></simple-icon>
                </div>
            </div>
            <footer>
                ${ this.isModified ? html`
                    <simple-button label="Сохранить" @click=${this.saveItem}></simple-button>
                    <simple-button label="Отменить" @click=${this.cancelItem}></simple-button>
                ` : ''
                }
            </footer>
        `;
    }

    async getUserInfo() {
        // return sessionStorage.getItem('userProfile') ? JSON.parse(sessionStorage.getItem('userProfile')) : await this.getUserProfile()
        return await this.getUserProfile()
    }

    fetchUserProfile(token) {
        return fetch('https://localhost:4500/api/user-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getUserProfile() {
        const token = this.getToken()
        let response = await this.fetchUserProfile(token)
        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchUserProfile(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return this.saveDataSet(result)
    }

    saveDataSet(userProfile) {
        this.dataSet = userProfile;
        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        return this.dataSet;
    }

    async refreshToken() {
        const response = await fetch('https://localhost:4500/api/refresh-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const token = result.token
        this.saveToken(token)
        return token
    }

    saveToken(token) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('accessUserToken', token)
        }
        else {
            sessionStorage.setItem('accessUserToken', token)
        }
        return token;
    }

    fetchSaveItem(token) {
        return fetch(`https://localhost:4500/api/user-profile`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.dataSet)
        })
    }

    async saveItem() {
        const token = this.getToken();

        if (this.avatarFile) {
            let result = await this.uploadAvatarFile();
            if (!result) return;
        }

        let response = await this.fetchSaveItem(token)
        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchSaveItem(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        this.afterSave(result)
    }

    fetchAvatarFile(token, formData) {
        return fetch(`https://localhost:4500/api/upload/avatar`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
    }

    async uploadAvatarFile() {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("file", this.avatarFile);
        let response = await this.fetchAvatarFile(token, formData)
        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchAvatarFile(token, formData)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    // saveDataSet(items) {
    //     if (items.length === 0)
    //         return;
    //     this.dataSet = items.map(item => {
    //         return item;
    //     }).sort( (a, b) => b._rev.localeCompare(a._rev) )
    //     this.currentItem = this.getCurrentItem();
    //     this.requestUpdate()
    // }

    validateInput(e) {
        if (e.target.value !== "") {
            this.oldValues ??= new Map();
            const currentItem = e.target.currentObject ?? this.currentItem
            if (!this.oldValues.has(e.target))
                this.oldValues.set(e.target, currentItem[e.target.id])
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }
            currentItem[e.target.id] = e.target.value
            this.isModified = this.oldValues.size !== 0;
        }
    }

    getToken() {
        return localStorage.getItem('rememberMe') ? localStorage.getItem('accessUserToken') : sessionStorage.getItem('accessUserToken')
    }

    async confirmDialogShow(message) {
        return await this.renderRoot.querySelector('confirm-dialog').show(message);
    }

    fetchGetItems(token) {
        return fetch('https://localhost:4500/api/user-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getItems() {
        const token = this.getToken()
        let response = await this.fetchGetItems(token)
        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchGetItems(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = [result];
        this.saveDataSet(items)
    }

    getCurrentItem(){
        // const item = sessionStorage.getItem('currentCountry')
        // if (item) {
        //     return this.dataSet.find(p => p._rev === item)
        // }
        // else {
        //     sessionStorage.setItem('currentCountry', this.dataSet[0]._rev)
        //     return this.dataSet[0]
        // }
        return this.dataSet[0]
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentCountry', item._rev)
        this.currentItem = item;
    }

    async afterSave(itemHeader) {
        this.currentItem._rev = itemHeader.rev;
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите отменить все изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            const currentItem = key.currentObject ?? this.currentItem.personalInfo
            currentItem[key.id] = value;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        //await this.getItems();
        this.dataSet = await this.getUserInfo();
        this.currentItem = this.dataSet
        this.avatar = null; // await this.downloadAvatar();
        this.isFirst = true;
    }
}

customElements.define("my-profile-section-1", MyProfileSection1);