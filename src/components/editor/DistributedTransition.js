// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';


import type { DistributedTransition as DistributedTransitionType } from '../../types/Transition';
import { AttributeTemplates, TransitionTemplates } from '../../templates/Templates';
import type { State } from '../../types/State';
import './Transition.css';


type Props = {
  options: State[],
  transition?: DistributedTransitionType,
  onChange: any
}

class DistributedTransition extends Component<Props> {
  render() {
    let currentValue = [];
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
    }
    if(!this.props.transition) {
      return null;
    }
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});

    return (
      <label>
        Distributed Transition:
        {currentValue.map((t, i) => {
          return <div key={i} className="transition-option">
            <label>To:
              <RIESelect className='editable-text' propName='transition' value={{id:t.to, text:t.to}} change={this.props.onChange(`[${i}].transition`)} options={options} />
            </label>
            <br/>
            {this.renderDistribution(t.distribution, i)}
            <br/>
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
          </div>
        })}
        <a className='editable-text add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: _.cloneDeep(TransitionTemplates.Distributed[0])}})}>+</a>
        <br/>
        {this.renderWarning()}
      </label>
    );
  }

  renderDistribution(distribution: mixed, index: number) {
    if(typeof distribution === 'object') {
      return (
        <label>
          Attribute: <RIEInput className='editable-text' value={distribution.attribute} propName='attribute' change={this.props.onChange(`[${index}].distribution.attribute`)} />
          <br />
          Weight: <RIENumber className='editable-text' value={distribution.default} propName='default' editProps={{step: .01, min: 0, max: 1}} format={this.formatAsPercentage} validate={this.checkInRange} change={this.props.onChange(`[${index}].distribution.default`)} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution`)({val: {id: _.cloneDeep(AttributeTemplates.UnnamedDistribution)}})}>Change to Unnamed Distribution</a>
        </label>
      );
    } else {
      return (
        <label> Weight:
          <RIENumber className='editable-text' value={distribution} propName='distribution' editProps={{step: .01, min: 0, max: 1}} format={this.formatAsPercentage} validate={this.checkInRange} change={this.props.onChange(`[${index}].distribution`)} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution`)({val: {id: _.cloneDeep(AttributeTemplates.NamedDistribution)}})}>Change to Named Distribution</a>
        </label>
      );
    }
  }

  renderWarning() {
    if(!this.props.transition) {
      return null;
    }
    // TODO remove Number calls when it can be ensured the values are numbers
    let warn = (this.props.transition.transition.reduce((acc, val) => Number(acc) + Number(typeof val.distribution === 'object' ? val.distribution.default : val.distribution), 0) !== 1);
    if (warn) {
      return (
        <label className='warning'>Weights do not add up to 100%.</label>
      );
    }
  }

  formatAsPercentage(num: number) {
    return (num * 100) + "%";
  }

  checkInRange(num: number) {
    return ((num >= 0) && (num <= 1));
  }
}

export default DistributedTransition;
