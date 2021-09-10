import * as expressListEndpoints from "express-list-endpoints";
import goods from './route/goods';
import login from './route/login';

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000; 

export const SECRET_KEY = "abcdefg";

app.use('/goods', goods);

app.use('/login', login);

app.use(express.static('./front'));
  
//サーバ起動
app.listen(port, () => {
  console.log('Listen started at port 3000.');
  console.log(expressListEndpoints(app));
});
/*
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found API.' });
});*/

// ➅エラーハンドリング
app.use((err, req, res, next)=>{
  res.status(500).send(err)
})

export default app;
