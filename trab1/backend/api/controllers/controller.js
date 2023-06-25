'use strict'

const mongoose = require('mongoose');

// Conectando-se ao banco de dados
mongoose.connect('mongodb://127.0.0.1:27017/TodoList', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao banco de dados MongoDB');
})
.catch((error) => {
  console.error('Erro ao conectar ao banco de dados:', error);
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    notes: []
});

const groupUserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    group_id: {
        type: String,
        required: true
    }
});

const AuthSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    last_updated: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('user', userSchema);
const Group = mongoose.model('group', groupSchema);
const GroupUser = mongoose.model('group_user', groupUserSchema);
const Auth = mongoose.model('auth', AuthSchema);

module.exports = () => {
    const controller = {}

    controller.writeUser = async(req, res, next) => {
        try {
            //
        } catch(err) {
            console.log(err)
        }
    }
    controller.logIn = async(req, res, next) => {
        res.status(200).json({
            token: 'mockToken'
        })
    }

    controller.insertUser = async(req, res) => {
        try {
            User.findOne({email: req.body.email}).then((user) => {
                if (user) {
                    return res.status(400).json({msg: 'Email já cadastrado!'});
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
    
                    newUser.save();
                    return res.status(200).json({msg: 'Usuário cadastrado!'});
                }
            })
        } catch {
            return res.status(500).json({msg: 'Erro ao cadastrar usuário'});
        }
    }

    controller.getUser = async(req, res) => {
        User.findOne({email: req.body.email}).then((user) => {
            if (user) {
                return res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                });
            } else {
                return res.status(400).json({msg: 'Usuário não encontrado!'});
            }
        })
    }

    controller.updateUser = async(req, res) => {
        try {
            let updatedUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            };
    
            User.updateOne({ email: req.body.email }, updatedUser)
                .then(() => {return res.status(200).json({msg: 'Usuário atualizado!'})})
                .catch(() => {return res.status(500).json({msg: 'Erro ao atualizar usuário!'})});
        } catch (error) {
            return res.status(500).json({msg: 'Erro ao atualizar usuário!'});
        }
    }

    controller.insertGroup = async(req, res) => {
        try {
            const newGroup = new Group({
                name: req.body.name,
                notes: req.body.notes
            });
            newGroup.save();

            req.body.users_ids.forEach(element => {
                const newGroupUser = new GroupUser({
                    user_id: element,
                    group_id: newGroup._id
                });
                newGroupUser.save();
            });
            
            return res.status(200).json({msg: 'Grupo cadastrado!'});
        } catch (err) {
            console.log('Erro ao cadastrar grupo: ' + err);
            return res.status(500).json({msg: 'Erro ao cadastrar grupo'});
        }
    }

    controller.writeNote = async(req, res, next) => {
        //
    }
    controller.listNotes = async(req, res, next) => {
        //
    }
    return controller
}