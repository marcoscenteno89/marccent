import React, { Component } from "react";
import MineSweeper from "./minesweeper";
import Temperature from "./temperature";
import { Background, Title, Footer } from "./inc";

class Container extends Component {

    render() {
        const a = this.props.data;
        const styles = {}
        const page = {}
        if (this.props.data) {
            styles.backgroundImage = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
            page.backgroundImage = `linear-gradient(to left, ${a.primary}, ${a.secondary})`;
            page.color = a.mode === '#FFF' ? '#383d44' : '#FFF';
        } 
        
        return  (
            <div className="page flex-center" style={styles}>
                <Background styles={styles} />
                <div className="container">
                    {/* <Carousel breakPoints={breakPoints}>
                        
                    </Carousel> */}
                    <Title text="Applications" style={{backgroundColor: a.mode, color: a.mode === '#FFF' ? '#383d44' : '#FFF'}} />
                    <section className="section" style={styles}>
                        <div className="content flex-center" >
                            <MineSweeper data={this.props.data} />
                        </div>
                    </section>
                    <section className="section flex-center" style={styles}>
                        <Temperature data={this.props.data} />
                    </section>
                    <Footer  style={{backgroundColor: a.mode, color: a.mode === '#FFF' ? '#383d44' : '#FFF'}} />
                </div>
            </div>
        )        
    }
}

export default Container;