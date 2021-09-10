import * as Express from 'express';
import mongodbClient from '../common/mongodbClient';
import { GoodsModel } from '../models/goodsModel';
import { SECRET_KEY } from '../index';

const router = Express.Router();
const jwt = require("jsonwebtoken");

// ➃認証用ミドルウェア
const auth = (req, res, next) => {
    // リクエストヘッダーからトークンの取得
    let token = '';
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else {
        return next('token none');
    }

    // トークンの検証
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) {
            // 認証NGの場合
            next(err.message);
        } else {
            // 認証OKの場合
            req.decoded = decoded;
            next();
        }
    });
}

router.post('/', auth,(req, res, next) => {
    console.log("Server add");

    const name = req.body.name;
    const goods_id = req.body.goods_id;
    const size = req.body.size;
    const amount = req.body.amount;
    const note = req.body.note;

    mongodbClient((err, client, db) => {
        if (err) {
            client.close();
            res.status(500).json({ message: 'MongoDB not connected.' });
            return next(err);
        }
        
        const collection = db.collection<GoodsModel>('goods');
        
        collection.insertOne(
            {
                name: name,
                goods_id: goods_id,
                size: size,
                amount: amount,
                note: note,
            },)
            .then((result) => {
                console.log(result);
                res.status(200).json(result)
            })
            .catch((err) =>{ 
                console.log(err);
            })
            .then(() => {
                client.close();
            });
        
    });
});

router.get('/:id', auth, (req, res, next) => {
    console.log("Server detail");
    const goods_id = req.params.id;

    mongodbClient((err, client, db) => {
        if (err) {
            client.close();
            res.status(500).json({ message: 'MongoDB not connected.' });
            return next(err);
        }

        const collection = db.collection<GoodsModel>('goods');
        collection.findOne({ goods_id: goods_id }, (err, result) => {
            if (err) {
                client.close();
                res.status(500).json({ message: 'MongoDB not connected.' });
                return next(err);
            }

            client.close();

            if (result == null) {
                res.status(404).json({ message: 'Not Found.' });
            } else {
                res.json(result);
            }
        });
    });
});

router.put('/:id', auth, (req, res, next) => {
    console.log("Server edit");
    const goods_id = req.params.id;

    console.log(req.body);

    const name = req.body.name;
    const size = req.body.size;
    const amount = req.body.amount;
    const note = req.body.note;

    const updateFields = {};
    if (name !== undefined) { updateFields['name'] = name; }
    if (size !== undefined) { updateFields['size'] = size; }
    if (amount !== undefined) { updateFields['amount'] = amount; }
    if (note !== undefined) { updateFields['note'] = note; }
    const update = { $set: updateFields };

    mongodbClient((err, client, db) => {
        if (err) {
            client.close();
            res.status(500).json({ message: 'MongoDB not connected.' });
            return next(err);
        }

        const collection = db.collection<GoodsModel>('goods');
        collection.findOneAndUpdate({ goods_id: goods_id }, update, (err, result) => {
            if (err) {
                client.close();
                res.status(500).json({ message: 'MongoDB not connected.' });
                return next(err);
            }

            if (result.value === null) {
                client.close();
                res.status(404).json({ message: 'Not Found.' });
                return;
            }else {
                res.json({ message: 'Success!' });
            }
        });
    });
});

router.post('/search', auth, (req, res, next) => {
    console.log("Server search all");

    mongodbClient((err, client, db) => {
        if (err) {
            client.close();
            res.status(500).json({ message: 'MongoDB not connected.' });
            return next(err);
        }

        const collection = db.collection<GoodsModel>('goods');

        collection.find({},)
            .toArray()
            .then((result)=>{
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                client.close();
            });
               
    });
});

export default router;
