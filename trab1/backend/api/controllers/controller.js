'use strict'

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
    controller.writeNote = async(req, res, next) => {
        //
    }
    controller.listNotes = async(req, res, next) => {
        //
    }
    return controller
}