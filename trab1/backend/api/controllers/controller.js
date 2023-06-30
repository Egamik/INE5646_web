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

// *** Schemas das collections do MongoDB ***
// os schemas não possuem o _id dos documentos pois esse valor já é definido automaticamente
// pelo próprio banco de dados.

// Schema da collection usuarios
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

// Schema da collection notes
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

// Schema da collection group_users
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

// Schema da collection auths
const authSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: false
    }
});

// *** Modelos das collections do banco ***
// esses modelos serão usados para comunicação com o banco
const User = mongoose.model('user', userSchema);
const Group = mongoose.model('group', groupSchema);
const GroupUser = mongoose.model('group_user', groupUserSchema);
const Note = mongoose.model('note', noteSchema);
const Auth = mongoose.model('auth', authSchema);

module.exports = () => {
    const controller = {};


    // *** Login no site. ***
    // Dados necessários no body:
        // - email
        // - password
    // Dados de retorno:
        // - accessToken
        // - user_id
    controller.logIn = async(req, res) => {
        console.log('LogIn email: ' + req.body.email);
        const user = await User.findOne({email: req.body.email});
        if (user === null) {
            return res.status(400).json({msg: 'Usuário não encontrado.'});
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const accessToken = jwt.sign(
                    { name: req.body.email }, 
                    process.env.ACCESS_TOKEN_SECRET, 
                    { expiresIn: '1h' }
                );
                
                const auth = await Auth.findOne({user_id: user._id});
                //-------------------------------Teste
                if (!auth) {
                    auth = new Auth({user_id: user.id})
                }
                //-------------------------------------------------------------------------------
                auth.accessToken = accessToken;
                auth.active = true;
                auth.save();

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

    // *** Logout do site. ***
    // Dados necessários no body:
        // - user_id
        // - accessToken
    // Dados de retorno:
        // - msg
    controller.logOut = async(req, res) => {
        try {
            const token = req.body.accessToken;

            const auth = Auth.findOne({_id: ObjectId(req.body.user._id)});
            auth.active = false;
            auth.save();
            
            return res.status(400).json({msg: 'Logout realizado!'});
        } catch (err) {
            console.log(err);
            return res.status(400).json({msg: 'Erro ao fazer logout do usuário.'})
        }
    }

    // *** Criação de usuário. ***
    // Dados necessários no body:
        // - name
        // - email
        // - password
    // Dados de retorno:
        // - msg
        // - user_id
        // - email
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

                    const newAuth = new Auth({
                        user_id: newUser._id
                    });
                    newAuth.save();

                    return res.status(200).json({
                        msg: 'Usuário cadastrado!',
                        id: newUser._id,
                        email: newUser.email
                    });
                }
            })
        } catch {
            return res.status(500).json({msg: 'Erro ao cadastrar usuário'});
        }
    }

    // *** Pegar dados do usuário. ***
    // Dados necessários no body:
        // - email
    // Dados de retorno:
        // - user_id
        // - name
        // - email
    controller.getUser = async(req, res) => {
        User.findOne({email: req.body.email}).then((user) => {
            if (user) {
                return res.status(200).json({
                    user_id: user._id,
                    name: user.name,
                    email: user.email
                });
            } else {
                return res.status(400).json({msg: 'Usuário não encontrado!'});
            }
        })
    }

    // *** Atualização de usuário. ***
    // Dados necessários no body:
        // - name
        // - email
        // - password
    // Dados de retorno:
        // - msg
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

    // *** Deletar usuário. ***
    // Dados necessários no body:
        // - user_id
    // Dados de retorno:
        // - msg
    controller.deleteUser = async(req, res) => {
        try {
            User.deleteOne({user_id: req.body.user_id});
            return res.status(200).json({msg: 'Usuário removido!.'});
        } catch (error) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao atualizar usuário.'});
        }
    }

    // *** Criação de grupo. ***
    // Dados necessários no body:
        // - name
    // Dados de retorno:
        // - msg
        // - group_id
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
            
            return res.status(200).json({msg: 'Grupo cadastrado!', group_id: newGroup._id});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao cadastrar grupo'});
        }
    }

    // *** Pegar grupo. ***
    // Dados necessários no body:
        // - group_id
    // Dados de retorno:
        // - group
    controller.getGroup = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            return res.status(200).json(group);
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao buscar grupo.'});
        }
    }

    // *** Deletar grupo. (deleta também de GroupUser) ***
    // Dados necessários no body:
        // - group_id
    // Dados de retorno:
        // - msg
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

    // *** Atualizar grupo. ***
    // Dados necessários no body:
        // - group
    // Dados de retorno:
        // - msg
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

    // *** Adicionar usuário a um grupo. ***
    // Dados necessários no body:
        // - group_id
        // - user_id
    // Dados de retorno:
        // - msg
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

    // *** Remover relação entre usuário e grupo. ***
    // Dados necessários no body:
        // - group_id
        // - user_id
    // Dados de retorno:
        // - msg
    controller.deleteGroupUser = async(req, res) => {
        try {
            GroupUser.deleteOne({group_id: req.body.group_id, user_id: req.body.user_id});
            return res.status(200).json({msg: 'Usuário removido do grupo!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao remover usuário do grupo.'});
        }
    }

    // *** Pegar usuários de um grupo. ***
    // Dados necessários no body:
        // - group_id
    // Dados de retorno:
        // - users_ids
    controller.getGroupUsers = async(req, res) => {
        try {
            const groupUser = await GroupUser.find({group_id: req.body.group_id});
            const users_ids = groupUser.map((element) => {
                return element.user_id;
            });
            return res.status(200).json({users_ids: users_ids});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao listar usuários.'});
        }
    }

    // *** Pegar os grupos de um usuário. ***
    // Dados necessários no body:
        // - user_id
    // Dados de retorno:
        // - groups_ids
    controller.getUserGroups = async(req, res) => {
        try {
            const groupUser = await GroupUser.find({user_id: req.body.user_id});
            const groups_ids = groupUser.map((element) => {
                return element.group_id;
            });
            return res.status(200).json({groups_ids: groups_ids});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao listar usuários.'});
        }
    }

    // *** Criar e inserir uma nota em um grupo. ***
    // Dados necessários no body:
        // - group_id
        // - note
    // Dados de retorno:
        // - msg
    controller.insertNote = async(req, res) => {
        try {
            const group = await Group.findById(req.body.group_id);
            const note = new Note({
                title: req.body.note.title,
                content: req.body.note.content,
                status: req.body.note.status
            });
            group.notes.push(note);
            group.save();

            return res.status(200).json({msg: 'Nota cadastrada!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: 'Erro ao inserir nota.'});
        }
    }

    // *** Deletar nota. ***
    // Dados necessários no body:
        // - group_id
        // - note_id
    // Dados de retorno:
        // - msg
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

    // *** Atualizar os dados de uma nota. ***
    // Dados necessários no body:
        // - group_id
        // - note
    // Dados de retorno:
        // - msg
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

    // *** Autenticação de token. ***
    // Dados necessários no body:
        // - user_id
        // - accessToken
    // Dados de retorno:
        // - msg
    controller.authenticateToken = async(req, res, next) => {
        try {
            const token = req.body.accessToken;
            const auth = await Auth.findOne({user_id: req.body.user_id});
    
            if (!auth.active) {
                return res.status(403).json({msg: "Usuário inativo."});
            }

            if (token === null) {
                return res.status(401).json({msg: "Token não recebido."});
            }
            
            if (auth.accessToken !== token) {
                return res.status(403).json({msg: "Token do usuário incorreto."});
            }
    
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({msg: "Erro na verificação do token."});
                }
                req.user = user;
                next();
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: "Erro na verificação do token."});
        }
    }
    
    return controller
}
