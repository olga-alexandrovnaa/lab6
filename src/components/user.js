import React from 'react';
import "./main.css"

var pr = 0;

export default class User extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: props.username,
            brokers: props.brokers,
            stocks: props.stocks,
            count: 0,
            index: 0,
            pr: 0
        };
    }

    render() {
        return (
            <div className="User">
                <h2>
                <table className="table">
                    <tr>
                        <th className="th1">БИРЖА</th>
                        <th className="th2">
                            <div>Мир</div>
                            <div>Инвестиций</div>
                        </th>
                    </tr>
                </table>
                </h2>
                <nav className="one">
                    <ul>
                        <li> {this.props.username} </li>
                        
                    </ul>
                </nav>

                <div className="info">
                    <div className="UserInfo">{this.get_info(this.props.username, this.props.brokers)}</div>
                    <div className="BrokerInfo">{this.get_torgs(this.props.stocks)}</div>
                    <div className="Sells">
                        <div className="Sell">
                            <table id = "table1">
                                <th>
                                <tr>
                                    <th id = "th">id</th>
                                    <th id = "th">Количество</th>
                                </tr>
                                <tr>
                                    <th><input onChange={this.get_index}/></th>
                                    <th><input onChange={this.get_count}/></th>
                                </tr>
                                </th>
                                
                                <tr id = "bot"><button id="a1" onClick={this.sell}> Продать </button></tr>
                                
                            </table>
                            
                        </div>
                        <div className="Buy">
                            <table id = "table2">
                                <th>
                                <tr id = "tr">
                                    <th id = "th">id</th>
                                    <th id = "th">Количество</th>
                                </tr>
                                <tr>
                                    <th ><input onChange={this.get_index}/></th>
                                    <th ><input onChange={this.get_count}/></th>
                                </tr>
                                </th>
                                <tr id = "bot"><button id="a1" onClick={this.buy}> Купить </button></tr>
                            </table>
                        </div>     
                    </div>
                </div>
            </div>
        );
    }


    get_info(name, br) {
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === name) {
                let broker = [];
                
                let Sum = br[i].money;
                for (let j = 0; j < br[i].stocks.length; j++){
                    Sum+=br[i].stocks[j]*br[i].price[j];
                }

                pr = Sum - br[i].sum;
                let znak="";
                if(pr>=0){
                    znak = "+";
                }

                broker.push(<div id = "Sum">Общая Стоимость: {Sum}<p2>({znak}{pr})</p2></div>)
                broker.push(<p> Денежные стредства: {br[i].money}</p>);
                let table = [];
                table.push(
                    <tr >
                        <th id = "th">id</th>
                        <th id = "th">Название акции</th>
                        <th id = "th">Количество в портфеле</th>
                        <th id = "th">Стоимость одной</th>
                        <th id = "th">Стоимость акций</th>
                        <th id = "th">Акций на продажу</th>
                        <th id = "th">Заявленная цена</th>
                    </tr>
                );
                for (let j = 0; j < br[i].stocks.length; j++) {
                    table.push(
                        <tr>
                            <td id = "td">{j}</td>
                            <td id = "td">{br[i].stocksName[j]}</td>
                            <td id = "td">{br[i].stocks[j]}</td>
                            <td id = "td">{br[i].price[j]}</td>
                            <td id = "td">{br[i].price[j]*br[i].stocks[j]}</td>
                            <td id = "td">{br[i].ontorg_stocks[j]}</td>
                            <td id = "td">{br[i].ontorg_price[j]}</td>
                    </tr>
                    )
                }
                broker.push(<table id = "table">{table}</table>);
                return <div className="broker">{broker}</div>
            }
        }
    }

    get_torgs(st) {
        let table = [];
        table.push(
            <tr  id = "tr">
                <th  id = "th">id</th>
                <th id = "th">Название акции</th>
                <th  id = "th">Количество доступных</th>
                <th  id = "th">Стоимость акции</th>
            </tr>
        );

        for (let i = 0; i < st.length; i++) {
            table.push(
                <tr>
                    <td id = "td">{i}</td>
                    <td id = "td">{st[i].name}</td>
                    <td id = "td">{st[i].in_torg}</td>
                    <td id = "td">{st[i].price}</td>
                </tr>
            )
        }
        return <div className="broker" id="tt"><p> Рынок </p><table id = "table">{table}</table></div>
    }


    sell = (event) => {
        if(this.state.index > this.state.stocks.length) {
            console.log(this.state.index ,">", this.state.stocks.length);
            return;
        }
        let br = this.state.brokers;
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === this.state.username) {
                if(this.state.count > br[i].stocks[this.state.index]) {
                    return;
                }
            }
        }
        this.props.sell(this.props.username, this.state.index, this.state.count);
    };

    buy = (event) => {
        let br = this.state.brokers;
        if(this.state.index > this.state.stocks.length) {
            return;
        }
        for (let i = 0; i < br.length; i++) {
            if (br[i].name === this.state.username) {
                if(this.state.count > this.state.stocks[this.state.index].in_torg) {
                    return;
                }
                if(br[i].money < this.state.stocks[this.state.index].price * this.state.count) {
                    return;
                }
            }
        }
        this.props.buy(this.props.username, this.state.index, this.state.count);
    };

    get_index = (event) => {
        this.setState({index: Number(event.target.value)});
    };

    get_count = (event) => {
        this.setState({count: Number(event.target.value)});
    };

}
