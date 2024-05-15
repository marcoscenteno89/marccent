import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";

class Square extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    }
    this.ref = React.createRef();
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize () {
    this.setState({
      height: this.ref.current.offsetWidth
    })
  } 

  componentDidMount() {
    this.setState({
      height: this.ref.current.offsetWidth
    });

    window.addEventListener("resize", this.handleResize);
  }


  render() {
    const styles = { 
      ...this.props.styles,
      ...{ height: this.state.height }
    }
    return (
      <div 
        ref={this.ref}
        className={`square`.concat(' ', this.props.className)} 
        style={styles}>
        {this.props.children}
      </div>
    )
  }
}

const SpCircle = props => {
  if (!props.data) return (<div>No data Found</div>)
  const o = props.styles;
  return (
    <Square 
      key={`sp-circle`} 
      name={`square`} 
      className="flex-center circle" 
      styles={o.circle}>
      <div className="inner circle flex-center" style={o.grad}>
        <div className="inner circle anim flex-center"style={o.innerCircle}>
          {props.children}
        </div>
      </div>
    </Square>
  ) 
}

export { SpCircle, Square }