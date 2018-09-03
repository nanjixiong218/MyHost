// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from 'Constants/routes.json';
import styles from './Home.css';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
        <Link to={routes.HOST}>to Host</Link>
      </div>
    );
  }
}
