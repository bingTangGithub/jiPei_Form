import React, { Component } from 'react';
import createG2 from 'g2-react';
import G2 from 'g2';
import PropTypes from 'prop-types';

const Histogram = createG2(chart => {
  chart.axis('storeName', {
    title: null,
    grid:null,
  });
  chart.axis('amount', {
    title: null,
    grid:null,
  });
  chart.tooltip({
    map:{
      name:'金额 ',
    },
  });
  chart.coord('rect').transpose();
  chart.interval().position('storeName*amount');
  chart.render();
});

export default class HistogramComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {
      data: [],
      forceFit: true,
      height: 350,
      width: 500,
      plotCfg: {
        margin: [20, 60, 20, 120],
      },
    };
  }

  componentWillReceiveProps (nextProps) {
    const { come } = nextProps;
    if (come.length) {
      let Frame = G2.Frame;
      let frame = new Frame(come);
      frame = Frame.sort(frame, 'amount');

      this.setState({
        data: frame,
      });
    }
  }

  render () {
    return (
      <Histogram
        data={this.state.data || []}
        width={this.state.width}
        height={this.state.height}
        plotCfg={this.state.plotCfg}
        forceFit={this.state.forceFit}
        ref="myChart"
      />
    );
  }
}

HistogramComponent.propTypes = {
  come: PropTypes.array.isRequired,
};
