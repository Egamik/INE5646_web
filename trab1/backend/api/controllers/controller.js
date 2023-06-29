'use strict'

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "aberto"
    }
});

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    notes: [noteSchema]
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
    let invalidTokens = []

    controller.logIn = async(req, res) => {
        console.log('email: ' + req.body.email);
        const user = await User.findOne({email: req.body.email});
        if (user === null) {
            return res.status(400).json({msg: 'Usuário não encontrado.'});
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const user = {name: req.body.email};
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
                return res.status(200).json({
                    accessToken: accessToken,
                    user_id: user._id
                });
            }
            return res.status(400).json({msg: 'Senha incorreta.'});
        } catch (err) {
            console.log(err);
            return res.status(400).json({msg: 'Erro ao autenticar o usuário.'})
        }
    }

    controller.logOut = async(req, res) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            invalidTokens.push(token);
            
            return res.status(400).json({msg: 'Logout realizado!'});
        } catch (err) {
            console.log(err);
            return res.status(400).json({msg: 'Erro ao fazer logout do usuário.'})
        }
    }

    controller.insertUser = async(req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            User.findOne({email: req.body.email}).then((user) => {
                if (user) {
                    return res.status(400).json({msg: 'Email já cadastrado!'});
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword
                    });
    
                    newUser.save();
                    return res.status(200).json({
                        msg: 'Usuário cadastrado!',
                        id: user._id
                    });
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
            console.log(err);
            return res.status(500).json({msg: 'Erro ao atualizar usuário.'});
        }
    }

    controller.deleteUser = async(req, res) => {
        try {
            User.deleteOne({user_id: req.body.user_id});
            return res.status(200).json({msg: 'Usuário removido!.'});
        } catch (error) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao atualizar usuário.'});
        }
    }

    controller.insertGroup = async(req, res) => {
        try {
            const newGroup = new Group({
                name: req.body.name,
                notes: []
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
            console.log(err);
            return res.status(500).json({msg: 'Erro ao cadastrar grupo'});
        }
    }

    controller.getGroup = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            return res.status(200).json(group);
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao buscar grupo.'});
        }
    }

    controller.deleteGroup = async(req, res) => {
        try {
            Group.deleteOne({_id: ObjectId(req.body.group_id)});
            GroupUser.deleteMany({group_id: req.body.group_id});
            return res.status(200).json({msg: 'Grupo removido!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao remover grupo.'});
        }
    }

    controller.updateGroup = async(req, res) => {
        try {
            let group = await Group.findById(req.body.group_id);
            group = req.body;
            group.save();
            
            return res.status(200).json({msg: 'Grupo atualizado!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao atualizar grupo.'});
        }
    }

    controller.insertGroupUser = async(req, res) => {
        try {
            const newGroupUser = new GroupUser({
                group_id: req.body.group_id,
                user_id: req.body.user_id
            });
            newGroupUser.save();
            
            return res.status(200).json({msg: 'Usuário inserido ao grupo!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao inserir usuário ao grupo.'});
        }
    }

    controller.deleteGroupUser = async(req, res) => {
        try {
            GroupUser.deleteOne({group_id: req.body.group_id, user_id: req.body.user_id});
            return res.status(200).json({msg: 'Usuário removido do grupo!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao remover usuário do grupo.'});
        }
    }

    controller.getGroupUsers = async(req, res) => {
        try {
            const groupUser = await GroupUser.find({group_id: req.body.group_id});
            const users_ids = groupUser.map((element) => {
                return element.user_id;
            });
            return res.status(200).json({users: users_ids});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao listar usuários.'});
        }
    }

    controller.getUserGroups = async(req, res) => {
        try {
            const groupUser = await GroupUser.find({user_id: req.body.user_id});
            const groups_ids = groupUser.map((element) => {
                return element.group_id;
            });
            return res.status(200).json({groups: groups_ids});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao listar usuários.'});
        }
    }

    controller.insertNote = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            const note = {
                title: req.body.note.title,
                content: req.body.note.content,
                status: req.body.note.status
            };
            group.notes.push(note);
            group.save();

            return res.status(200).json({msg: 'Nota cadastrada!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao inserir nota.'});
        }
    }

    controller.deleteNote = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            
            let jsonGroup = group.toJSON();
            jsonGroup = JSON.stringify(jsonGroup);
            jsonGroup = JSON.parse(jsonGroup);
            
            group.notes = jsonGroup.notes.filter(note => note._id !== req.body.note_id);
            group.save();

            return res.status(200).json({msg: 'Nota removida!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao remover nota.'});
        }
    }

    controller.updateNote = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            
            let jsonGroup = group.toJSON();
            jsonGroup = JSON.stringify(jsonGroup);
            jsonGroup = JSON.parse(jsonGroup);
            
            let isUpdated = false;
            jsonGroup.notes = jsonGroup.notes.map((note) => {
                if (note._id === req.body.note._id) {
                    isUpdated = true;
                    return req.body.note;
                }
                return note;
            });
            group.notes = jsonGroup.notes;
            group.save();

            if (isUpdated) {
                return res.status(200).json({msg: 'Nota atualizada!'});
            } else {
                return res.status(204).json({msg: 'Nota não encontrada.'});
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao atualizar nota.'});
        }
    }

    controller.authenticateToken = async(req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (invalidTokens.includes(token)) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
                if (err) {
                    invalidTokens = invalidTokens.filter(element => element !== token);
                }
            });
            return res.sendStatus(403);
        }

        if (token === null) {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    
    return controller
}
