import React, { Component } from 'react';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import PropTypes from 'prop-types';

export default class RoundComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      forceFit: true,
      height: 350,
      width:400,
      plotCfg: {
        margin: [10, 200, 10, 30],
      },
    };
  }

  render () {
    if (!this.props.income.length) {
      return (<div>暂无数据</div>);
    }

    const { data, width, height, plotCfg, forceFit } = this.state;
    const colors = [
      // ['#FB7272', '#4DC2DE', '#F9F1CC', '#FDC75B'],
      ['#6798D0', '#52C3ED', '#5EBDA5', '#39BA9B', '#8EC15A', '#A2CE6F', '#FCCE5F', '#F16F58', '#EB5767', '#DB4557'],
    ];
    const Round = createG2(chart => {
      chart.changeData(this.props.income);
      chart.legend({
        title:null,
        dy:-50,
      });
      chart.tooltip({
        title: null,
      });
      chart.coord('theta', {
        radius: 1,
        inner: 0.35,
      });
      chart.intervalStack().position(Stat.summary.percent('amount'))
       .color(
        'type',
        colors[1],
       )
       .label('..percent', { offset: -10 })
       .style({ lineWidth: 0 });
      chart.render();
    });

    return (
      <Round
        data={data || []}
        width={width}
        height={height}
        plotCfg={plotCfg}
        forceFit={forceFit}
        ref="myChart"
      />
    );
  }
}

RoundComponent.propTypes = {
  income: PropTypes.array.isRequired,
  // roundIndex: PropTypes.number.isRequired,
};
