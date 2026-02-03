import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/tables/simple-table.mjs'
import '../../../../../components/tables/simple-table-header.mjs'
import lang from '../../../polyathlon-dictionary.mjs'

class MyCompetitionSection4Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            items: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            sportsmenDataSource: { type: Object, default: null },
        }
    }
    constructor() {
        super()
        this.columns = [[
            {
                name: "place",
                label: lang`Place`,
            },
            {
                name: "sportsman",
                label: lang`Sportsman`,
            },
            {
                name: "category",
                label: lang`Short sports category`,
            },
            {
                name: "birthday",
                label: lang`Date of birth`,
            },
            {
                name: "region",
                label: lang`Region RF`,
            },
            {
                name: "club",
                label: lang`Sports club`,
            },
            {
                name: "points",
                label: lang`Total points`,
            },
            {
                name: "completedCategory",
                label: lang`Completed category`,
            },
        ]]
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    gap: 0px;
                    height: 100%;
                    width: 100%;
                    flex-direction: column;
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #item-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #item-header p {
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

                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .left-layout item-button {
                    width: 100%;
                    height: 40px;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    gap: 10px;
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
                avatar-input {
                    height: 50px;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
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

                .table {
                    overflow-y: auto;
                    overflow-x: auto;
                    height: 100%;
                    width: 100%;
                    /* width */
                    &::-webkit-scrollbar {
                        width: 10px;
                    }

                    /* Track */
                    &::-webkit-scrollbar-track {
                        box-shadow: inset 0 0 5px grey;
                        border-radius: 5px;
                    }

                    /* Handle */
                    &::-webkit-scrollbar-thumb {
                        background: red;
                        border-radius: 5px;
                    }

                }
            `
        ]
    }

    getPoints(a) {
        return a.points ?? 0;
    }

    getPlace(a) {
        return a?.place ?? 0;
    }

    resultToValue(result) {
        const parts = result.split(':')
        const minutes = parts[1].split(',')
        return (+parts[0] * 60 + +minutes[0]) * 10 + +minutes[1];
    }

    comparePlace(a, b) {
        a = a?.place ?? 0
        b = b?.place ?? 0
        return a > b ? 1 : a < b ? -1 : 0
    }
    comparePlaces(a , b) {
        let result = this.comparePlace(a.shooting, b.shooting)
        result += this.comparePlace(a.strengthTraining, b.strengthTraining)
        result += this.comparePlace(a.swimming, b.swimming)
        result += this.comparePlace(a.throwing, b.throwing)
        result += this.comparePlace(a.sprinting, b.sprinting)
        result += this.comparePlace(a.running, b.running)
        result += this.comparePlace(a.skiing, b.skiing)
        result += this.comparePlace(a.rollerSkiing, b.rollerSkiing)
        result += this.comparePlace(a.jumping, b.jumping)
        if (result) {
            return result
        }
        return this.comparePlace(a.skiing, b.skiing)
    }

    categoryFind(points, categories) {
        return categories.reduce((last, item) =>
            +item.points <= points && +item.points > last.points ? item : last
            ,   {
                "category": {
                    "_id": "sports-category:01J8MPYGQ86MJYAC7596C703EZ",
                    "_rev": "2-5fb6b115fab3dfb04a496f1e0f90772f",
                    "name": "Без разряда",
                    "owner": "01J82YGBMTY0SWZV70N0MKZEFQ",
                    "shortName": "б/р"
                },
                "points": 0
            }
        ).category
    }

    getCompletedCategory(item, points) {
        const categories = item.gender == 0 ? this.parent.sportsDiscipline1.men : this.parent.sportsDiscipline1.women
        return this.categoryFind(points, categories)
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
        if (changedProps.has('sportsmenDataSource')) {
            this.items = this.sportsmenDataSource.items.map(item => {
                const points = +(item.shooting?.points ?? 0) + +(item.strengthTraining?.points ?? 0)
                        + +(item.swimming?.points ?? 0) + +(item.throwing?.points ?? 0) + +(item.sprinting?.points ?? 0) + +(item.running?.points ?? 0)
                         + +(item.skiing?.points ?? 0) + +(item.rollerSkiing?.points ?? 0)  + +(item.jumping?.points ?? 0)
                return {
                    place: item.place ?? 0,
                    sportsman: `${item.lastName} ${item.firstName} ${item.middleName}`,
                    gender: item.gender,
                    category: item.category.shortName,
                    birthday: new Date(item.birthday).toLocaleDateString(),
                    region: item.region.shortName ?? item.region.name,
                    club: item.club.name,
                    points: points,
                    shooting: item.shooting,
                    strengthTraining: item.strengthTraining,
                    swimming: item.swimming,
                    throwing: item.throwing,
                    sprinting: item.sprinting,
                    running: item.running,
                    skiing: item.skiing,
                    rollerSkiing: item.rollerSkiing,
                    jumping: item.jumping,
                    completedCategory: this.getCompletedCategory(item, points)?.shortName ?? '',
                }
            }).sort((a, b) => (this.parent?.name?.championship ? a.gender - b.gender : a.gender - b.gender || a.ageGroup?.sortOrder - b.ageGroup?.sortOrder) || b.points - a.points || this.comparePlaces(a, b))
            this.items.reduce((a, b, index) => {
                if (index === 0 || (this.parent?.name?.championship ? this.items[index - 1].gender != b.gender : this.items[index - 1].ageGroup?.sortOrder != b.ageGroup?.sortOrder)) {
                    a = 0
                    b.place = 1
                }
                else {
                    b.place = this.getPoints(b) === this.getPoints(this.items[index - 1]) && this.comparePlaces(this.items[index - 1], b) === 0 ? this.getPlace(this.items[index - 1]) : a + 1
                }
                return a + 1
            }, 0)
        }

    }

    render() {
        return html`
            <!-- <simple-table-header .columns=${this.columns}></simple-table-header> -->
            <div class="table">
                <simple-table @click=${this.tableClick} @dblclick=${this.tableClick} .columns=${this.columns} .rows=${this.items} .groups=${this.groups}></simple-table>
            </div>
        `;
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value
        if (e.target.id === 'name') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

    #competitionDate(parent) {
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

        if (parent.startDate) {
            const start = parent.startDate.split("-")
            const end = parent.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            return `${start[2]} ${monthNames[start[1]-1]} - ${end[2]} ${monthNames[end[1] - 1]} ${start[0]} года`
        }
        return ''
    }
    pdfMethod(refereeDataSource) {
        const mainReferee = refereeDataSource.items.find( item => item.position.name === "Главный судья");
        const mainSecretary = refereeDataSource.items.find(item => item.position.name === "Главный секретарь");

        const tableBody = [
            [
                { text: 'Место', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортсмен', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Дата рожд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Звание, разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Субъект РФ', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортивный клуб', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Очки', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Вып. разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
            ],
            [
                '', '', '', '', '', '', '', ''
            ].map(cell => ({ text: cell, fillColor: '#eeeeee' })),
        ];

        tableBody.push(...this.items.map((item, index) => ([
            { text: item.place ?? index + 1, fontSize: 8 },
            { text: item.sportsman ?? '', fontSize: 8 },
            { text: item.birthday ?? '', fontSize: 8 },
            { text: item.category ?? '', fontSize: 8 },
            { text: item.region ?? '', fontSize: 8 },
            { text: item.club ?? '', fontSize: 8 },
            { text: item.points ?? '', fontSize: 8 },
            { text: item.completedCategory ?? '', fontSize: 8 }
        ])));

        const docInfo = {
            info: {
                title: "sportsmen",
                author: "Polyathlon systems",
            },
            pageSize: "A4",
            pageOrientation: 'landscape',
            pageMargins: [20, 15, 20, 40],
            content: [
                { text: "Министерство спорта Российской Федерации", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                { text: "Всероссийская Федерация Полиатлона", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                {
                    text: `${this.parent.name.name}${this.parent.stage ? ' ' + this.parent.stage.name : ''} по полиатлону в спортивной дисциплине ${this.parent?.sportsDiscipline1?.name}`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 4, 0, 2]
                },
                {
                    text: `№ СМ ${this.parent?.ekpNumber} в ЕКП`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 0, 0, 4]
                },
                {
                    columns: [
                        {
                            text: this.#competitionDate(this.parent),
                            margin: [20, 0, 0, 0],
                            fontSize: 9,
                            alignment: "left",
                        },
                        {
                            text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                            alignment: "right",
                            margin: [0, 0, 20, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    text: "Протокол командного зачета среди команд спортивных клубов",
                    fontSize: 11,
                    bold: true,
                    alignment: "center",
                    margin: [0, 6, 0, 6],
                },
                {
                    table: {
                        widths: [25, 150, 35, 60, 120, 170, 75, 90],
                        body: tableBody,
                        headerRows: 2
                    },
                },
                {
                    columns: [
                        {
                            text: mainReferee?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainReferee?.firstName?.[0] ?? ''}.${mainReferee?.middleName?.[0] ?? ''}. ${mainReferee?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainReferee?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainReferee?.city?.name ?? ''}, ${mainReferee?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainSecretary?.firstName?.[0] ?? ''}.${mainSecretary?.middleName?.[0] ?? ''}. ${mainSecretary?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainSecretary?.city?.name ?? ''}, ${mainSecretary?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
            ]
        };

        pdfMake.createPdf(docInfo).open();
    }

    async firstUpdated() {
        super.firstUpdated();
        if (this.parent?.name?.championship) {
            this.groups = [
                { name: "gender", label: item => item.gender == true ? lang`Women` : lang`Men`, title: lang`Gender` },
            ]
        } else {
            this.groups = [
                { name: "ageGroup", label: item => item.ageGroup, title: lang`Age group` },
            ]
        }
    }

}

customElements.define("my-competition-section-4-page-2", MyCompetitionSection4Page2);