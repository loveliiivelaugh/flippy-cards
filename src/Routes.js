import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/HomePage'
import Menu from './pages/MenuPage'
import Header from './components/Header'


const Routes = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/menu" component={Menu} />
        </Switch> 
      </Router>
    </>
  )
}

export default Routes
