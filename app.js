const app = require('express')();
var path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

var stocks = require('./json/stocks');
var persons = require('./json/person');

const corsOptions = {
    'credentials': true,
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override, Content-Type, Cache-Control, Accept',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', require('./routes/routes'));

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    origins: "http://localhost:3000"
});

io.on('connection', function(socket) {

    socket.on('login', function(data) {
        for(let person of persons) {
            if(person.name === data.name || data.name === 'admin') {
                socket.json.emit('update', {stocks: stocks, persons: persons});
                socket.json.emit('welcome', {uname:data.name});

                return
            }
        }
        socket.broadcast.json.emit('welcome', { uname: 'Nobody', message:'Пользователь не найден'});
        socket.json.emit('welcome', { uname: 'Nobody', message:'Пользователь не найден'});
    });

    socket.on('start', function(data) {
        socket.broadcast.json.emit('start_ex');
        socket.json.emit('start_ex');
        let timerId = setInterval(() => {
            for (let st of stocks) {
                if (st.distribution === 'равномерный'){
                    st.price = Math.round((Math.random()*(st.max-st.st_price))+st.st_price);
                    while(st.price<0){
                        st.price = Math.round((Math.random()*(st.max-st.st_price))+st.st_price);
                    } 
                } else {
                    st.price = Math.round(st.st_price + (randNorm()*(st.max-st.st_price)));
                    while(st.price<0){
                        st.price = Math.round(st.st_price + (randNorm()*(st.max-st.st_price)));
                    } 
                }
            }

            for (let br of persons) {
                for(let i = 0; i< stocks.length; i++) {
                    br.price[i] = br.stocks[i] * stocks[i].price;
                    br.ontorg_price[i] = br.ontorg_stocks[i] * stocks[i].price;
                }
            }
            socket.json.emit('update', {stocks: stocks, persons: persons});
            socket.broadcast.json.emit('update', {stocks: stocks, persons: persons});
        }, 1000)
    });

    socket.on('sell', function(data) {
        let ind = Number(data.index);
        let ct = Number(data.count);
        for (let br of persons) {
            if (br.name === data.name){
                br.stocks[ind] -= ct;
                br.ontorg_stocks[ind] += ct;
                br.price[ind] = br.stocks[ind] * stocks[ind].price;
                br.ontorg_price[ind] = br.ontorg_stocks[ind] * stocks[ind].price;
                stocks[ind].in_torg +=ct;
                socket.json.emit('update', {stocks: stocks, persons: persons});
                socket.broadcast.json.emit('update', {stocks: stocks, persons: persons});
            }
        }
    });

    socket.on('buy', function(data) {
        let ind = Number(data.index);
        let ct = Number(data.count);
        for (let br of persons) {
            if ((br.name === data.name) && (ct>0)){
                br.money -= ct * stocks[ind].price; //ум деньги
                
                br.stocks[ind] += ct; //ув кол-во
                //br.price[ind] = br.stocks[ind] * stocks[ind].price;  
                stocks[ind].in_torg -=ct;
                buy_stocks(ct, ind);
                socket.json.emit('update', {stocks: stocks, persons: persons});
                socket.broadcast.json.emit('update', {stocks: stocks, persons: persons});
            }
        }
    });
});

function buy_stocks(count, index) {
    for (let br of persons) {
        if(br.ontorg_stocks[index] > 0) {
            let cur_count = br.ontorg_stocks[index] - count;
            if (cur_count < 0) {
                count = -cur_count;
                br.money += br.ontorg_stocks[index] * stocks[index].price;
                br.ontorg_stocks[index] = 0;
            }
            if (cur_count >= 0) {
                br.money += count * stocks[index].price;
                br.ontorg_stocks[index] -= count;
            }
            br.ontorg_price[index] = br.ontorg_stocks[index] * stocks[index].price;
        }
    }
}

function randNorm() {
    let t = 0;
    let n = 3;
    for (let i = 0; i < n; ++i)
        t += Math.random();
    return t/n;
}

const port = process.env.PORT || 7070;
server.listen(port);
