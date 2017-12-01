let WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
let React = require('react');
let ReactDOM = require('react-dom');
let PropTypes = require('prop-types');
let DataGenerator = require('./data/DataGenerator');
let EchartsVisualizations = require('./geometry/EchartsVisualizations');

ReactGridLayout = WidthProvider(ReactGridLayout);

let generator = new DataGenerator();
let charts = [];

generator.update = function(data) {
    //console.log(data);
    ReactDOM.render(<DashboardGrid data={data}/>, container);

    //console.log(charts);

    charts.forEach(chart => {
        chart.setData(data);
        chart.drawChart();
    });
};

let dataGen = generator.start('random', 5000, {
    min: 1,
    max: 100,
    amount: 10
});

generator.stop(dataGen);

let DashboardGrid = React.createClass({
    render: function() {
        // layout is an array of objects, see the demo for more complete usage
        let layout = [
            {i: 'a', x: 0, y: 0, w: 1, h: 1},
            {i: 'b', x: 1, y: 0, w: 1, h: 1},
            {i: 'c', x: 0, y: 1, w: 1, h: 1},
            {i: 'd', x: 1, y: 1, w: 1, h: 1}
        ];
        let margin = [5,5];
        /*let widgets = layout.map((item, index) => {
            return (<div id={'widget'} key={'a'} ref={(el) => {
                if (el) {
                    charts.push(new EchartsVisualizations(el));
                    charts[index].drawChart();
                }
            }}></div>);
        });*/

        return (
            <ReactGridLayout className="layout" layout={layout} cols={2} margin={margin}
                             rowHeight={300}>
            <div id={'test1'} key={'a'} ref={(el) => {
                /*console.log(el);
                let chart = new EchartsVisualizations(el);
                chart.drawChart();*/
                //console.log(el);
                if (!charts[0]) {
                    charts.push(new EchartsVisualizations(el));
                }
            }}>Widget 1</div>
            <div id={'test2'} key={'b'} ref={(el) => {
                //let chart = new EchartsVisualizations(el);
                //chart.drawChart('line');
                if (!charts[1]) {
                    charts.push(new EchartsVisualizations(el));
                }
            }}>Widget 2</div>
            <div id={'test3'} key={'c'} ref={(el) => {
                //let chart = new EchartsVisualizations(el);
                //chart.drawChart('map');
                if (!charts[2]) {
                    charts.push(new EchartsVisualizations(el));
                }
            }}>Widget 3</div>
            <div id={'test4'} key={'d'}>Widget 4</div>
            </ReactGridLayout>
        )
    }
});

let container = document.getElementsByClassName('dashboardWidget')[0];

//ReactDOM.render(<DashboardGrid />, container);