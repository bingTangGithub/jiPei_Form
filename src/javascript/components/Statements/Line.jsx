import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createG2 from 'g2-react';

export default class LineComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {
      data: [],
      forceFit: true,
      height: 450,
      width: 500,
    };
  }

  getValue = () => {
    let arr = this.props.lineData;
    let money = [];
    for (let i = 0; i < arr.length; i++) {
      money.push(arr[i].money);
    }
    let max = Math.max(...money);
    let min = Math.min(...money);
    return { max, min };
  }

  render () {
    let minValue = this.getValue().min;
    let maxValue = this.getValue().max;

    const { date: propsDate } = this.props;
    const Line = createG2(chart => {
      chart.changeData(this.props.lineData);
      chart.col('date', {
        type: 'cat',
        values: propsDate,
        alias:' ',
      });
      chart.col('money', {
        alias:'金额',
      });
      chart.tooltip(true, {
        custom: false,
        offset: 50,
      });
      chart.axis('money', {
        grid:null,
        min: minValue,
        max: maxValue,
      });
      chart.axis('date', {
        labels: {
          label:{
            rotate: -8,
          },
        },
      });
      chart.legend({
        title:null,
        marker:'hyphen',
        dy:-200,
      });
      chart.line().shape('spline').position('date*money')
           .color('type', ['#F8B646', '#4D2DA8', '#5178C3', '#F15C68']).size(2);
      chart.render();
    });

    return (
      <Line
        data={this.state.data || []}
        width={this.state.width}
        height={this.state.height}
        plotCfg={this.state.plotCfg}
        forceFit={this.state.forceFit}
        ref="myChart" />
    );
  }
}

LineComponent.propTypes = {
  lineData: PropTypes.array.isRequired,
  date: PropTypes.array.isRequired,
};
