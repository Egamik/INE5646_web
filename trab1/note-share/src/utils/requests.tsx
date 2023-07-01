import axios, { AxiosResponse } from "axios"

// Requisicao para deletar nota
export async function deleteNote(groupID: string, token: string) {
    try {
        const options = {
            data: {
                accessToken: token,
                group_id: groupID
            }
        }
        const response = await axios.delete(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            options
        )
        if (response.status === 200) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// Requisicao para editar notas
export async function editNote(title: string, content: string,
    groupID: string, noteID: string, token: string) {
    try {
        const response = await axios.put(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                group_id: groupID,
                accessToken: token,
                note: {
                    title: title,
                    content: content,
                    status: "",
                    _id: noteID
                }
            }
        )
        if (response.status === 200) {
            return 0
        }
        if (response.status === 204) {
            return 1
        }
        return 2
    } catch (error) {
        console.log(error)
        return 2
    }
}

// Funcao responsavel por requisicao de notas
/**
 * Recebe token e id de usuario
 * Faz requisicao para pegar todos os ids de grupos aos quais o usuario
 * faz parte
 * Faz requisicao sobre todos os grupos encontrados para obter notas salvas em grupos
 * @param token accessToken
 * @param userID user id
 * @returns Note[]
 */
export async function getNotes(token: string, userID: string) {
    try {
        const getUserGOptions = {
            data: {
                accessToken: token,
                user_id: userID
            }
        }

        // Pega ids dos grupos de notas de um usuario
        const groupIDS = await axios.get<APIGetUserGroupsResponse>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/user-groups',
            getUserGOptions
        )
        console.log(groupIDS)

        // Se nao existem notas associadas retornar
        if (groupIDS.data.groups_ids.length === 0) {
            return []
        }
        else {
            // Para cada id de grupo de notas pegar notas
            const notes: Note[] = []
            groupIDS.data.groups_ids.forEach(id => {
                const options = {
                    data: {
                        accessToken: token,
                        group_id: id
                    }
                }
                axios.get<APIGetGroupResponse>(
                    "http://progweb.isac.campos.vms.ufsc.br:8080/group",
                    options
                ).then(response => {
                    console.log('Response de getGroup: ', response)
                    if (response.data.notes.length !== 0) {
                        notes.concat(response.data.notes)
                    }
                }).catch(error => {
                    console.log(error)
                    return { error: true }
                })
            })
            return notes
        }
    } catch (err) {
        console.log(err);
        return { error: true };
    }
}

/**
 * 
 * @param token 
 * @param uid 
 * @returns string[] contendo ids dos grupos aos quais usuario participa
 */
export async function getUserGroups(token: string, uid: string) {
    // user-groups GET
    const options = {
        data: {
            accessToken: token,
            user_id: uid
        }
    }
    try {
        const response = await axios.post<APIGetUserGroupsResponse>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/user-groups',
            options
        )

        if (response.data.groups_ids) {
            return response.data.groups_ids
        }
        return []
    } catch (error) {
        // console.log('Error em getUserGroups MainPage', error)
        return []
    }
}

// Cria novo grupo de notas
export async function createGroup(name: string, token: string) {
    const options = {
        data: {
            accessToken: token,
            name: name
        }
    }

    try {
        const response = await axios.post<APIInsertGroupResponse>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/group",
            options
        )
        if (response.data.group_id) {
            return response.data.group_id
        }
        return ''
    } catch (error) {
        console.log('Error createGroup Login: ', error)
        return ''
    }
}


// Axios call
export async function sendLogIn(email: string, password: string) {
    try {
        const response = await axios.post<any, AxiosResponse<APILogInResponse>>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/',
            {
                email: email,
                password: password
            }
        )
        console.log('sendLogIn response: ', response)
        if (response.data.accessToken) {
            const ret: LoginResponse = {
                token: response.data.accessToken,
                id: response.data.user_id
            }
            return ret
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

export async function sendSignIn(username: string, email: string, password: string) {
    try {
        const response = await axios.post<APIRequest, AxiosResponse<APIInsertUserResponse>>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/user",
            {
                name: username,
                email: email,
                password: password
            }
        )

        if (response.status === 200) {
            return response.data.user_id
        }
        return ''
    } catch (err) {
        console.log(err)
        return ''
    }
}


export async function requestAddNote(title: string, content: string, token: string, groupID: string, userID: string) {
    try {
        let gID: string = groupID
        // Checa se grupo foi passado
        // Caso nao cria novo grupo
        if (groupID === '') {
            const optAddGrp = {
                data: {
                    accessToken: token,
                    user_id: userID,
                    name: title
                }
            }
            const response = await axios.post(
                "http://progweb.isac.campos.vms.ufsc.br:8080/group",
                // Ta errado passar pra constante com data
                optAddGrp
            )
            if (response.status === 200) {
                gID = response.data.group_id
            }
        }
        const optAddNote = {
            data: {
                accessToken: token,
                user_id: userID,
                group_id: gID,
                note: {
                    title: title,
                    content: content,
                    status: ""
                }
            }
        }
        // Adiciona nova nota
        const response = await axios.post<APIInsertNoteRequest, any>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            // Ta errado passar pra constante com data
            optAddNote
        )
        if (response.status == 200) {
            return gID
        }
        // Falta checar response
        return false
    } catch (error) {
        console.log('error')
        return false
    }
}
