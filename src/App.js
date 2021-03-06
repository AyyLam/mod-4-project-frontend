import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav'
import User from './components/User'
import Login from './components/Login'
import { getWeather, createUser, createCity, createCityUser } from './adapter/adapter.js'
import CityPage from './components/CityPage.js'
import SearchInput from './components/SearchInput.js'
import { Switch, Route, withRouter, Redirect} from 'react-router-dom'

class App extends Component {

  state = {
    user: {
      name: "",
      id: ""
    },
    searchedCity: "",
    clickedFavCity: "",
    favedCity: [],
    data: {
      city: '',
      id: '',
      maxTemp: "",
      minTemp: '',
      temp: '',
      wind_spd: '',
      precipitation: '',
      datetime: '',
      rh: '',
      country_code: '',
      state_code: ''
    }
  }

  handleLogin = (name) => {
    this.setState({
      user: {
        name: name
      }
    }, () => createUser(this.state.user)
    .then(data => {
      console.log('createuser:', data)
      this.setState({
        user: {
          name: data.user.username,
          id: data.user.id
        },
        favedCity: data.cities
      })
    })
  )
    this.props.history.push('/user')
  }

  handleLogout = () => {
    this.setState({
      user: {
        name: '',
        id: ''
      }
    })
  }

  handleClick = (city) => {
    this.setState({
      searchedCity: city
    }, () => getWeather(this.state.searchedCity)
      .then(weather => {
        console.log('weather:', weather.status);
        if (weather.status) {
          alert("Bad call")
        } else {
          this.setState({
            clickedFavCity: "",
            data: {
              city: weather.city_name,
              maxTemp: weather.data[0].max_temp,
              minTemp: weather.data[0].min_temp,
              temp: weather.data[0].temp,
              wind_spd: weather.data[0].wind_spd,
              pop: weather.data[0].pop,
              datetime: weather.data[0].datetime,
              rh: weather.data[0].rh,
              country_code: weather.country_code,
              state_code: weather.state_code
            }
          }, () => createCity(this.state.data)
            .then(data => {
              console.log('increatecitypromise:', data);
              // debugger
              this.setState({
              data: {
                city: data.name,
                id: data.id,
                maxTemp: data.maxTemp,
                minTemp: data.minTemp,
                temp: data.temp,
                wind_spd: data.wind_spd,
                pop: data.pop,
                datetime: data.datetime,
                rh: data.rh,
                country_code: data.country_code,
                state_code: data.state_code
              }
            }
            )}
          ))
        }
      })
    )
    this.props.history.push('/city');
  }

    addFavedCity = (data) => {
      createCity(data)
        .then(data => {
          console.log('infavedcitypromise:', data);
          if (this.state.favedCity.find((city) =>
             city.name === data.name )){
            alert('This city is already in your faved cities!')
          } else {
          this.setState({
            favedCity: [...this.state.favedCity, data]
          }, () => createCityUser(this.state.data, this.state.user)
          )
          this.props.history.push('/user')
        }
        }
      )
    }

    favCityPage = (data) => {
      console.log('here!!!');
      this.setState({
        clickedFavCity: data
      })
    }

    resetFavCity = () => {
      this.setState({
        clickedFavCity: ""
      })
    }

    //pass down method to handle favorite city click that redorects to city page
  render() {
    console.log('faved cities:', this.state.favedCity);
    console.log('data state:', this.state.data);
    console.log('clicked fav city:', this.state.clickedFavCity);
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Nav user={this.state.user} logout={this.handleLogout}  resetFav={this.resetFavCity}/>
        {this.state.user.name ? <SearchInput handleClick={this.handleClick} /> : null}
        <Switch>
          <Route path="/login" render={() => {
              return <Login handleLogin={this.handleLogin} />
            }} />
          <Route path="/user" render={(routerProps) => {
              routerProps.match.params.username
              return  <User user={this.state.user} favCityPage={this.favCityPage} favedCity={this.state.favedCity} clickedFavCity={this.state.clickedFavCity}/>
            }} />
          <Route path='/city/:id' render={(routerProps) => {
            // this.state.data.id ? routerProps.match.params.data.id : null
                return <CityPage city={this.state.searchedCity} clickedFavCity={this.state.clickedFavCity} addFavedCity={this.addFavedCity} weatherData={this.state.data}/> }}/>
          <Route path='/city' render={() => {
              return <CityPage city={this.state.searchedCity} clickedFavCity={this.state.clickedFavCity} addFavedCity={this.addFavedCity} weatherData={this.state.data}/> }}/>
            <Route path='/' render={() =>
               <Redirect to='/login'/>} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
