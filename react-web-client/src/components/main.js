import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamMembers from './contact';
import Trading from './trading';

const Main = () => (
  <Switch>
    <Route path="/contact" component={TeamMembers} />
    <Route path="/login" component={Trading} />
  </Switch>
)

export default Main;
