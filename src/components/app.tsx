import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import Footer from './footer';
import Header from './header';

import * as styles from './app.scss';

type PassedProps = RouteComponentProps<void>;

type Props = PassedProps;

class App extends React.Component<Props> {
  public render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.content}>
          <Switch>
            <Route path="/" component={undefined} />
          </Switch>
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
