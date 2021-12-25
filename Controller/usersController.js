const knex = require('../Model/DB/db.config');
const joi = require('joi');

exports.userPost = async (req, res) => {
    const id = await Number(req.user_token);
    const data = await req.body;
    const schemaValidate = joi.object({
        post: joi.string().min(3).max(255),
        likes: joi.bool().required(),
        dislikes: joi.bool().required()
    })
    let schemaValidated = schemaValidate.validate(data);
    if (schemaValidated.error) {
        return res.status(500).json({
            message: schemaValidated.error.message
        })
    } else {
        schemaValidated = schemaValidated.value;
    }

    try {
        let effect = 0;
        if (schemaValidated.dislikes == true || schemaValidated.dislikes == 'yes') {
            schemaValidated['likes'] = 0;
            schemaValidated['dislikes'] = 1;
            effect = 1;
        } if (schemaValidated.likes == true || schemaValidated.likes == 'yes') {
            schemaValidated['likes'] = 1;
            schemaValidated['dislikes'] = 0;
            effect = 1;
        }
        //how to take out the last perticulars from the table
        if (effect === 1) {
            let postId = await knex('postActs').max('id')
            if (postId[0]['max(`id`)'] == null) {
                await knex('records').insert({ "postID": 1, "viewerID": id })
            } else {
                postId = (Number(postId[0]['max(`id`)'])) + 1
                await knex('records').insert({ "postID": postId, "viewerID": id })
            }
        }
        else {
            schemaValidated['likes'] = 0;
            schemaValidated['dislikes'] = 0;
        }

        schemaValidated['userID'] = id;
        await knex('postActs').insert(schemaValidated);
        res.send('You have posted one blog.')

    } catch (err) {
        res.send(err)
        console.log(err);
    }
}

exports.likeDislikes = async (req, res) => {
    const ID = await Number(req.user_token);
    const data = await req.body;
    const schemaValidate = joi.object({
        likes: joi.bool().required(),
        dislikes: joi.bool().required()
    })
    var schemaValidated = schemaValidate.validate(data);
    if (schemaValidated.error) {
        return res.status(500).json({
            message: schemaValidated.error.message
        })
    } else {
        schemaValidated = schemaValidated.value;
    }
    try {
        const verifyingLDrECORDS = await knex('records').where({ postID: req.params.id, viewerID: ID });
        if (verifyingLDrECORDS.length > 0) {
            res.send('You have already reacted on this post.')
        } else {
            const fromLDiDrOW = await knex('postActs').where({ id: req.params.id })
            if (fromLDiDrOW.length > 0) {
                if (schemaValidated.dislikes == true || schemaValidated.dislikes == 'yes') {
                    schemaValidated['dislikes'] = fromLDiDrOW[0]['dislikes'] + 1;
                    // await knex('records').insert({postID: id, viewerID: id})
                }else if (schemaValidated.likes == true || schemaValidated.likes == 'yes') {
                    schemaValidated['likes'] = fromLDiDrOW[0]['likes'] + 1;
                }else{
                    schemaValidated['likes'] = fromLDiDrOW[0]['likes'];
                    schemaValidated['dislikes'] = fromLDiDrOW[0]['dislikes']
                }
                await knex('postActs').where({id: req.params.id}).update(schemaValidated)
                await knex('records').insert({ postID: req.params.id, viewerID: ID})
                res.send('Your reaction is saved.')
            }else{
                res.send('ID not found!!')
            }
        }
    } catch (err) {
        res.send(err);
        console.log(err);
    }
}


exports.allBlogs = async(req, res) => {
    const result = await knex('postActs');
    res.send(result);
}


exports.totalLD = async(req, res) => {
    const LD = await knex.from('postActs').select( 'id', 'userID', 'likes', 'dislikes')
    res.send(LD);
}






// exports.lastId = (req, res) => {
//     knex('postActs').max('id').then(data => {
//         console.log(data);
//         res.send(data)
//         console.log(data[0]['max(`id`)']);
//     }).catch(err => {
//         console.log(err);
//     })
// }