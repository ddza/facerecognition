
import React, {Component} from "react";
import './App.css';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Rank from "./components/Rank/Rank";
import Particles from 'react-particles-js';
//import Clarifai from "clarifai";

// const app = new Clarifai.App({
//   apiKey: '92b68455837844df828ab124a04de2b7'
//  });
// const stub = ClarifaiStub.grpc();

// const metadata = new grpc.Metadata();
// metadata.set("authorization", "Key 92b68455837844df828ab124a04de2b7");


const particlesOptions = {
  particles:{
    number:{
      value:80,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
} 
const initialState = {
  input:"",
  imageUrl: "",
  box :{},
  route: "signin",
  isSignedIn: false, 
  user: {
    id: "",
    name: "", 
    email: "", 
    entries: 0,
    joined: ""
  }
}

// function App() {
class App extends Component{
  constructor(){
    super();
    this.state =initialState;
  }

  // componentDidMount(){
  //   fetch("http://localhost:3001")
  //     .then(response => response.json())
  //     .then(data =>console.log(data))
  // }
  loadUser = (data)=>{
    this.setState({user:{
          id: data.id,
          name:data.name, 
          email:data.email, 
          entries: data.entries,
          joined: data.joined
    }})
  }
  calculateFaceLocation = (data)=>{
    const calrifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);
   
    return {
        leftCol: calrifaiFace.left_col * width,
        topRow: calrifaiFace.top_row * height,
        rightCol: width -  (calrifaiFace.right_col * width),
        bottomRow: height - (calrifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
   
      this.setState({box: box})
  }
  onInputChange = (event)=>{
    this.setState({input: event.target.value})
    //console.log(event.target.value)
  }
  onButtonSubmit = ()=>{
      this.setState({imageUrl: this.state.input})


   // app.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
    // app.models.predict('a403429f2ddf4b49b307e318f00e528b', "https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_2560%2Cc_limit/best-face-oil.png")
    // app.models
    // // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    //   .predict(
    //       Clarifai.FACE_DETECT_MODEL, 
    //       this.state.input)
      fetch("https://dry-sea-01434.herokuapp.com/imageurl", {
        method:"post", 
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          fetch("https://dry-sea-01434.herokuapp.com/image", {
            method:"put", 
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response =>response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })

      .catch (err =>console.log(err));

  }
  onRouteChange =(route)=>{
    if(route === "signout"){
      this.setState(initialState)
    }else if(route === "home"){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
   const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles  className="particles"
                  params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === "home" ?
            <div>

              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              onInputChange={this.onInputChange}  
              onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition box={box} imageUrl ={imageUrl} />
              </div>
        :(
          route==="signin" 
          ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

        )
          
      
      }
    
      </div>
    );
  }
}

export default App;
