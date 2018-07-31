import React from 'react'
import FavoriteList from './FavoriteList'


export default class User extends React.Component {


  render(){
    return(
      <div>
      User page for {this.props.user.name}
      <FavoriteList data={this.props.data} favCityPage={this.props.favCityPage} favedCity={this.props.favedCity}/>
      </div>
    )
  }
}
