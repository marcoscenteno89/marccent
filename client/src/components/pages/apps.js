import React, { Component } from "react";
import { Today, Blur, SpCircle, RevColor, LinGrad } from "../inc/inc";
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AppNav from "../inc/app-nav";
import MineSweeper from "../mini-app/minesweeper";
import Temperature from "../mini-app/temperature";

class Apps extends Component {

    getPath() {
        let { url } = useRouteMatch();
        return url;
    }

    render() {
        if (!this.props.data) return (<h1>Loading...</h1>);
        const url = this.getPath();
        console.log(url);
        const a = this.props.data;
        const sec = {
            background: a.mode,
            borderRadius: '5px'
        }
        const bg = {
            background: LinGrad(a.primary, a.secondary),
            color: '#FFF'
        }

        return  (
            <section className="temp flex-center">
                <div className="container flex-row" style={sec}>
                    <Switch>
                        <Route path="apps/minesweeper">
                            <MineSweeper data={a} />
                        </Route>
                        <Route path="apps/temp">
                            <Temperature data={a} />
                        </Route>
                        {/* <Route path="minesweeper"></Route>
                        <Route path="/" exact ><Temperature data={a} /></Route> */}
                    </Switch>
                    <AppNav data={a} />
                </div>
            </section>
        )        
    }
}

export default Apps;