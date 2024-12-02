import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

// import Chart from 'chart.js/auto';

import CompetitionTypeDataset from '../../my-competition-types/my-competition-types-dataset.mjs'
import CompetitionTypeDataSource from '../../my-competition-types/my-competition-types-datasource.mjs'

import CompetitionStageDataset from '../../my-competition-stages/my-competition-stages-dataset.mjs'
import CompetitionStageDataSource from '../../my-competition-stages/my-competition-stages-datasource.mjs'

import SportsDisciplineDataset from '../../my-sports-disciplines/my-sports-disciplines-dataset.mjs'
import SportsDisciplineDataSource from '../../my-sports-disciplines/my-sports-disciplines-datasource.mjs'

import CityDataset from '../../my-cities/my-cities-dataset.mjs'
import CityDataSource from '../../my-cities/my-cities-datasource.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

import DataSet from './my-competition-dataset.mjs'

class MyCompetitionSection4Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            competitionTypeDataSource: {type: Object, default: null},
            competitionStageDataSource: {type: Object, default: null},
            sportsDisciplineDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null, attribute: "old-values" },
            manNumber: {type: BigInt, default: 0},
            womanNumber: {type: BigInt, default: 0},
            regionNumber: {type: BigInt, default: 0},
            clubNumber: {type: BigInt, default: 0},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <div class="name-group">
                    <simple-input label="Количество мужчин:" id="manNumber" icon-name="sportsman-man-solid" .value=${this.manNumber} @input=${this.validateInput}></simple-input>
                    <simple-input label="Количество регионов:" id="regionNumber" icon-name="region-solid" .value=${this.regionNumber} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input label="Количество женщин:" id="womenNumber" icon-name="sportsman-woman-solid" .value=${this.womanNumber} @input=${this.validateInput}></simple-input>
                    <simple-input label="Количество клубов:" id="clubNumber" icon-name="club-solid" .value=${this.clubNumber} @input=${this.validateInput}></simple-input>
                </div>
                <canvas id="chart"></canvas>

            </div>
        `;
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    async createCompetitionId(e) {
        const target = e.target
        const year = this.item.startDate.split("-")[0]
        const id = await DataSet.createCompetitionId({
            countryCode: this.item?.city?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.city?.region?.code,
            year,
        })
        target.setValue(id);
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        // if (e.target.value !== "") {
        //     const currentItem = e.target.currentObject ?? this.item
        //     if (!this.oldValues.has(e.target)) {
        //         if (Array.isArray(e.target.value)) {
        //             this.oldValues.set(e.target, e.target.oldValue)
        //         } else {
        //             this.oldValues.set(e.target, e.target.value)
        //         }
        //     }
        //     else {
        //         const oldValue = this.oldValues.get(e.target)
        //         if (Array.isArray(oldValue) && oldValue.length === e.target.value.length) {
        //             if (e.target.value.every(item1 => oldValue.some( item2 =>
        //                 item1.name ===  item2.name &&
        //                 item1.gender ===  item2.gender
        //             ))) {
        //                 this.oldValues.delete(e.target)
        //             }
        //         } else if (oldValue === e.target.value) {
        //             this.oldValues.delete(e.target)
        //         }
        //     }

        //     currentItem[e.target.id] = e.target.value

        //     if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
        //         this.parentNode.parentNode.host.requestUpdate()
        //     }
        //     this.isModified = this.oldValues.size !== 0;
        // }
    }

    // colorize(opaque, hover, ctx) {
    //     const v = ctx.parsed;
    //     const c = v < -50 ? '#D60000'
    //       : v < 0 ? '#F46300'
    //       : v < 50 ? '#0358B6'
    //       : '#44DE28';

    //     const opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);

    //     return opaque ? c : Utils.transparentize(c, opacity);
    // }

    // hoverColorize(ctx) {
    //     return colorize(false, true, ctx);
    // }

//     generateData() {
//         return Utils.numbers({
//           count: DATA_COUNT,
//           min: -100,
//           max: 100
//         });
//       }

//     data = {
//         datasets: [{
//           data: this.generateData()
//         }]
//       };

//     config = {
//         type: 'pie',
//         data: data,
//         options: {
//           plugins: {
//             legend: false,
//             tooltip: false,
//           },
//           elements: {
//             arc: {
//               backgroundColor: colorize.bind(null, false, false),
//               hoverBackgroundColor: hoverColorize
//             }
//           }
//         }
//       };

//     DATA_COUNT = 5;
//     // Utils.srand(110);

//     actions = [
//     {
//         name: 'Randomize',
//         handler(chart) {
//         chart.data.datasets.forEach(dataset => {
//             dataset.data = generateData();
//         });
//         chart.update();
//         }
//     },
//     {
//         name: 'Toggle Doughnut View',
//         handler(chart) {
//         if (chart.options.cutout) {
//             chart.options.cutout = 0;
//         } else {
//             chart.options.cutout = '50%';
//         }
//         chart.update();
//         }
//     }
// ];

// createRadialGradient3(context, c1, c2, c3) {
//     const chartArea = context.chart.chartArea;
//     if (!chartArea) {
//       // This case happens on initial chart load
//       return;
//     }

//     const chartWidth = chartArea.right - chartArea.left;
//     const chartHeight = chartArea.bottom - chartArea.top;
//     if (width !== chartWidth || height !== chartHeight) {
//       cache.clear();
//     }
//     let gradient = cache.get(c1 + c2 + c3);
//     if (!gradient) {
//       // Create the gradient because this is either the first render
//       // or the size of the chart has changed
//       width = chartWidth;
//       height = chartHeight;
//       const centerX = (chartArea.left + chartArea.right) / 2;
//       const centerY = (chartArea.top + chartArea.bottom) / 2;
//       const r = Math.min(
//         (chartArea.right - chartArea.left) / 2,
//         (chartArea.bottom - chartArea.top) / 2
//       );
//       const ctx = context.chart.ctx;
//       gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
//       gradient.addColorStop(0, c1);
//       gradient.addColorStop(0.5, c2);
//       gradient.addColorStop(1, c3);
//       cache.set(c1 + c2 + c3, gradient);
//     }

//     return gradient;
//   }

    async firstUpdated() {
        super.firstUpdated();
        this.manNumber = 10
        this.womanNumber = 20
        this.regionNumber = 40
        this.clubNumber = 30
        this.chart = new Chart(this.$id('chart'), {
            type: 'bar',
            data: {
              labels: ['Мужчины', 'Женщины', 'Регионы', 'Клубы'],
              datasets: [{
                data: [this.manNumber, this.womanNumber, this.regionNumber, this.clubNumber],
                borderWidth: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }]
            },
            options: {
                plugins: {
                    legend: false,
                    tooltip: true,
                    title: {
                        display: true,
                        text: 'Статистика соревнования',
                        color: 'rgba(255, 255, 255, 0.9)',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: {
                            color: '#FFF',
                        },
                        ticks: {
                            color: '#FFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                    },
                    x: {
                        border: {
                            color: '#FFF',
                        },
                        ticks: {
                            color: '#FFF'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                    }
                }
            }
          });

        //   this.chart = new Chart(this.$id('chart'), {
        //     type: 'pie',
        //     data: {
        //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //       datasets: [{
        //         label: '# of Votes',
        //         data: [12, 19, 3, 5, 2, 3],
        //         borderWidth: 1
        //       }]
        //     },
        //     options: {
        //         plugins: {
        //           legend: false,
        //           tooltip: false,
        //         },
        //         // elements: {
        //         //   arc: {
        //         //     backgroundColor: colorize.bind(null, false, false),
        //         //     hoverBackgroundColor: hoverColorize
        //         //   }
        //         // }
        //       }
        //   });

        // this.competitionTypeDataSource = new CompetitionTypeDataSource(this, await CompetitionTypeDataset.getDataSet())
        // this.sportsDisciplineDataSource = new SportsDisciplineDataSource(this, await SportsDisciplineDataset.getDataSet())
        // this.competitionStageDataSource = new CompetitionStageDataSource(this, await CompetitionStageDataset.getDataSet())
        // this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        // this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }
}

customElements.define("my-competition-section-4-page-1", MyCompetitionSection4Page1);