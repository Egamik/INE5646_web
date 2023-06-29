declare namespace JSX {
    interface IntrinsicElements {
        "br-button": any;
        "br-checkbox": any;
        "br-footer": any;
        "br-header": any;
        "br-input": any;
        "br-menu": any;
        "br-message": any;
        "br-card": any;
        "br-card-content": any;
        "br-card-header": any;
        "br-divider": any;
        "br-item": any;
        "br-breadcrumb": any;
        "br-list": any;
        "br-message": any;
        "br-loading": any;
        "br-header-action": any;
        "br-header-action-link": any;
        "br-sign-in": any;
    }

}

interface APIDefaultResponse {
    msg: string
}

interface APIRequest {
    name: string,
    email: string,
    password: string
}

interface APILogInRequest {
    email: string,
    password: string
}

interface APILogInResponse {
    accessToken: string,
    user_id: string
}

interface APILogOutRequest {
    accessToken: string
}

interface APIInsertUserRequest {
    name: string,
    email: string,
    password: string
}

interface APIGetUserRequest {
    accessToken: string,
    email: string
}

interface APIGetUserResponse {
    msg: string,
    user_id: string,
    name: string,
    email: string
}

interface APIUpdateUserRequest {
    accessToken: string,
    name: string,
    email: string,
    password: string
}

interface APIDeleteUserRequest {
    accessToken: string,
    user_id: string
}

interface APIInsertGroupRequest {
    accessToken: string,
    name: string,
    notes:
        {
            title: string,
            content: string
        }[],
    users_ids: string[],
    group_id: string
}

interface APIGetGroupRequest {
    accessToken: string,
    group_id: string
}

interface APIGetGroupResponse {
    _id: string
    name: string,
    notes:
        {
            _id: string,
            title: string,
            content: string,
            status: string
        }[],
    users_ids: string[],
}

interface APIDeleteGroupRequest {
    accessToken: string,
    group_id: string
}

interface APIUpdateGroupRequest {
    accessToken: string,
    _id: string,
    name: string,
    notes:
        {
            _id: string,
            title: string,
            content: string,
            status: string
        }[],
    users_ids: string[]
}

interface APIInsertGroupUserRequest {
    accessToken: string,
    group_id: string,
    user_id: string
}

interface APIDeleteGroupUserRequest {
    accessToken: string,
    group_id: string,
    user_id: string
}

interface APIDeleteGroupUsersRequest {
    accessToken: string,
    group_id: string
}

interface APIDeleteGroupUsersResponse {
    msg: string,
    users_ids: string[]
}

interface APIGetUserGroupsRequest {
    accessToken: string,
    user_id: string
}

interface APIGetUserGroupsResponse {
    groups_ids: string[]
}

interface APIInsertNoteRequest {
    accessToken: string,
    group_id: string,
    title: string,
    content: string,
    status: string
}

interface APIDeleteNoteRequest {
    accessToken: string,
    group_id: string,
    note_id: string
}

interface APIUpdateNoteRequest {
    accessToken: string,
    group_id: string,
    note: {
        _id: string,
        title: string,
        content: string,
        status: string
    }
}
