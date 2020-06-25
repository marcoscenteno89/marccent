import React from "react";
import Model from './model';

class Nav extends Model {
    render() {
        return  (
            <nav className="main-nav">
                <button>Logo</button>
                <ul>
                    <li>Portfolio</li>
                    <li>About</li>
                    <li>Contact</li>
                    <li>Quote</li>
                </ul>
                <form>
                    <input type="text" placeholder="Search" />
                    <button>Search</button>
                </form>
            </nav>
        )        
    }
}

export default Nav;