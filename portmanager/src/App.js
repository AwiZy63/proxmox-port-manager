import './App.css';
import LoginPage from './pages/Login.page';
import HomePage from './pages/Home.page';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [isLogged, setIsLogged] = useState(Boolean(localStorage.getItem("userData")));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || []);

  useEffect(() => {
    if (isLogged) {
      if (userData && (userData.accessTokenExpires < new Date(Date.now()).getTime())) {
        localStorage.removeItem('userData');
        setIsLogged(false);
        setUserData([]);
      }
    }
  }, [isLogged, userData])



  return (
    <Router>
      <Switch>
        {!isLogged ?
          <Route exact path='/'>
            <LoginPage setIsLogged={setIsLogged} setUserData={setUserData} />
          </Route>
          :
          <Route exact path='/'>
            <HomePage setIsLogged={setIsLogged} setUserData={setUserData} userData={userData} />
          </Route>}
        <Route path='/'>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
