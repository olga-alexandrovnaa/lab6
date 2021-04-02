import React from 'react';
import "./main.css"


export default class Admin extends React.Component{
    render(){
        return (
            <div className="Admin">
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
                        <li> Admin </li>
                        
                    </ul>
                </nav>
                <p><button id="a" onClick={this.props.start_torgs}>Начать торги</button> </p>
                <div className="brokers">
                    {get_brokers(this.props.brokers, this.props.stocks)}
                </div>
            </div>
        );

        function get_brokers(br, st){
            let brokers=[];
            for (let i = 0; i < br.length;i++){
                let broker = [];
                broker.push(<p> Ник: {br[i].name} </p>);
                broker.push(<p> Денежные средства: {br[i].money} </p>);
                let table = [];
                table.push(
                    <tr id = "tr">
                        <th id = "th">Название акции</th>
                        <th id = "th">Количество в портфеле</th>
                        <th id = "th">Стоимость акции</th>
                        <th id = "th">Акций на продажу</th>
                        <th id = "th">Заявленная цена</th>
                    </tr>
                );
                for (let j = 0; j < br[i].stocks.length; j++){
                    table.push(
                        <tr>
                            <td id = "td">{br[i].stocksName[j]}</td>
                            <td id = "td">{br[i].stocks[j]}</td>
                            <td id = "td">{br[i].price[j]}</td>
                            <td id = "td">{br[i].ontorg_stocks[j]}</td>
                            <td id = "td">{br[i].ontorg_price[j]}</td>
                        </tr>
                    )
                }
                broker.push(<table id = "table">{table}</table>)
                brokers.push(<div className = "broker" key = {br[i].id}> {broker}</div>)
            }
            return <div>{brokers}</div>
        }
    }

}
