import React from "react";
import ReactApexChart from "react-apexcharts"
import {Row, Col} from "react-bootstrap";

//TODO: Function that runs when you click on a data point
//BUG: Clicking on bottom labels changes graph view but not selected buttons

const gInitialToeSelection = [true, true, false, false, false]; //Only first two toes start off shown (client request)

class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: this.props.leftFootData,
            options: {
                chart: {
                    height: 350,
                    type: "area",
                    events: {
                        click: function(event, chartContext, config) {
                            /*config.seriesIndex; //Number of big toe, index toe, etc. starting from 0
                            config.dataPointIndex; //Number of treatment date*/
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "straight"
                },
                xaxis: {
                    type: "datetime",
                    categories: this.props.leftFootDates,
                    show: true,
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: "Fungual Coverage (%)",
                        style: {
                            color: "black",
                            fontSize: '16px',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 0,
                        },
                    }
                },
                tooltip: {
                    x: {
                        format: "yyyy/MM/dd"
                    },
                },
            },
            showLeftFoot: true, //Start off showing the left foot
            shownToes: gInitialToeSelection,
            showingDetails: this.props.showingDetails, //Scrunch the graph on the left if showing details
        };
    }

    viewFoot(showLeftFoot) {
        var shownToes = gInitialToeSelection; //Show initial toes again when changing feet

        this.setState({
            shownToes: shownToes,
            showLeftFoot: showLeftFoot
        })

        this.resetShownToesData(shownToes);
    }

    resetShownToesData(shownToes) {
        var toeData = []; //New toe data to be shown
        var toeDates = []; //New dates of toe data to be shown
        var data = (this.state.showLeftFoot) ? this.props.leftFootData : this.props.rightFootData;
        var dates = (this.state.showLeftFoot) ? this.props.leftFootDates : this.props.rightFootDates;

        for (let i = 0; i < shownToes.length; ++i) {
            if (shownToes[i]) { //The user wants to see this toe
                toeData.push(data[i]); //Original data is stored in props
                toeDates.push(dates[i]); //Original data is stored in props
            }
            else {
                //Push blank entries so graph stays the same colour for each toe
                toeData.push({name: "", data: []});
                toeDates.push("");
            }
        }

        var options = this.state.options;
        options.xaxis.categories = toeDates;

        this.setState({
            series: toeData,
            options: options,
        });
    }

    showToe(num) {
        let shownToes = [false, false, false, false, false]; //Hide all toes
        shownToes[num] = true; //Except toe clicked on

        this.setState({
            shownToes: shownToes
        })

        this.resetShownToesData(shownToes);
    }

    showHideAllToes() {
        let shownToes = [false, false, false, false, false];
        let val = false; //Hide all toes by default

        for (let isToeShown of this.state.shownToes) {
            if (!isToeShown) { //At least one toe is hidden
                val = true; //Show all toes
                break;
            }
        }

        if (val) //Show all toes
            shownToes = [true, true, true, true, true];

        this.setState({
            shownToes: shownToes,
        });

        this.resetShownToesData(shownToes);
    }

    areAllToesShown() {
        return this.state.shownToes.filter(isToeShown => isToeShown).length === 5; //All true means all toes are shown
    }

    printToeButtons() {
        var toeNames = ["Big Toe", "Index Toe", "Middle Toe", "Fourth Toe", "Little Toe"];
        var toeOrder =  [0, 1, 2, 3, 4];
        var defaultToeButtonClass = "graph-toe-button";
        var activeToeButtonClass = defaultToeButtonClass + " active-toe-button";

        if (this.state.showLeftFoot)
            toeOrder.reverse(); //Toes go in opposite order on left foot

        return (
            <span className="toolbar">
                <button onClick={this.showHideAllToes.bind(this)}
                        className={(this.areAllToesShown() ? activeToeButtonClass : defaultToeButtonClass)}>
                    ALL
                </button>

                <button onClick={this.showToe.bind(this, toeOrder[0])}
                        className={(this.state.shownToes[toeOrder[0]] ? activeToeButtonClass : defaultToeButtonClass)}>
                    {toeNames[toeOrder[0]]}
                </button>

                <button onClick={this.showToe.bind(this, toeOrder[1])}
                        className={(this.state.shownToes[toeOrder[1]] ? activeToeButtonClass : defaultToeButtonClass)}>
                    {toeNames[toeOrder[1]]}
                </button>

                <button onClick={this.showToe.bind(this, toeOrder[2])}
                        className={(this.state.shownToes[toeOrder[2]] ? activeToeButtonClass : defaultToeButtonClass)}>
                    {toeNames[toeOrder[2]]}
                </button>

                <button onClick={this.showToe.bind(this, toeOrder[3])}
                        className={(this.state.shownToes[toeOrder[3]] ? activeToeButtonClass : defaultToeButtonClass)}>
                    {toeNames[toeOrder[3]]}
                </button>

                <button onClick={this.showToe.bind(this, toeOrder[4])}
                        className={(this.state.shownToes[toeOrder[4]] ? activeToeButtonClass : defaultToeButtonClass)}>
                    {toeNames[toeOrder[4]]}
                </button>
            </span>
        );
    }

    printToeData(id, name, percentage) {
        return (
            <Row key={id} className="selected-details-row">
                <Col className="selected-details-col">{name}</Col>
                <Col className="selected-details-col">{percentage}%</Col>
                <Col className="selected-details-col">No Comments</Col>
                <Col className="selected-details-col selected-details-right-col">[<br/>IMAGE<br/>]</Col>
            </Row>
        )
    }

    printSelectedDateDetails() {
        var footData = (this.state.showLeftFoot) ? this.props.leftFootData : this.props.rightFootData;
        var dates = (this.state.showLeftFoot) ? this.props.leftFootDates : this.props.rightFootDates;
        var footName = (this.state.showLeftFoot) ? "Left" : "Right";

        return (
            <div className="selected-details-container split-graph">
                <Row className="selected-details-title">
                    {footName} Foot: {dates[0]}
                </Row>
                <Row className="selected-details-row">
                    <Col className="selected-details-col">Toe Name</Col>
                    <Col className="selected-details-col">Fungal Coverage</Col>
                    <Col className="selected-details-col">Comments</Col>
                    <Col className="selected-details-col selected-details-right-col">Image</Col>
                </Row>
                {
                    footData.map(({id, name, data}) => this.printToeData(id, name, data[this.state.selectedTreatment]))
                }
                <Row className="selected-details-row selected-details-bottom-row"></Row>
            </div>
        );
    }

    render() {
        var defaultFootButtonClass = "graph-foot-button";
        var activeFootButtonClass = defaultFootButtonClass + " active-toe-button";
        var graphClassName = "";
        var dateDetails = "";
        var flexClassName = "";

        if (this.state.showingDetails)
        {
            graphClassName += "split-graph";
            dateDetails = this.printSelectedDateDetails();
            flexClassName = "display-flex";
        }

        return (
            <div>
                {/* Buttons to change which foot is being viewed */}
                <div className="graph-feet-buttons">
                    <button onClick={this.viewFoot.bind(this, true)}
                                className={(this.state.showLeftFoot ? activeFootButtonClass : defaultFootButtonClass)}>
                            Left Foot
                    </button>

                    <button onClick={this.viewFoot.bind(this, false)}
                                className={(!this.state.showLeftFoot ? activeFootButtonClass : defaultFootButtonClass)}>
                            Right Foot
                    </button>
                </div>

                {/*Buttons to filter toes*/}
                <div lg="5" className="graph">
                    {
                        this.printToeButtons()
                    }
                    <div className={flexClassName}>
                        <div className={graphClassName}>
                            {/*The actual chart itself*/}
                            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height="300px" />
                        </div>

                        {/*Details off to the side about a specific date*/}
                        {dateDetails}
                    </div>
                </div>
            </div>
        );
    }
}

export default ApexChart;
