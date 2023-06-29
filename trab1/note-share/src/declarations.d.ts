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

interface APIResponse {
    _id: string,
    name: string,
    notes:
        {
            title: string,
            content: string
        }[],
    __v: number
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

interface APIGetUserRequest {
    email: string
}

interface APIGetUserResponse {
    msg: string,
    user_id: string,
    name: string,
    email: string
}

interface APIUpdateUserRequest {
    name: string,
    email: string,
    password: string
}

interface APIUpdateUserResponse {
    msg: string
}

interface APIDeleteUserRequest {
    user_id: string
}

interface APIDeleteUserResponse {
    msg: string
}

interface APIInsertGroupRequest {
    name: string,
    notes:
        {
            title: string,
            content: string
        }[],
    users_ids: string[],
    group_id: string
}

interface APIInsertGroupResponse {
    msg: string
}

interface APIGetGroupRequest {
    group_id: string
}

interface APIGetGroupResponse {
    name: string,
    notes:
        {
            title: string,
            content: string
        }[],
    users_ids: string[],
    group_id: string
}

interface APIDeleteGroupRequest {
    group_id: string
}

interface APIDeleteGroupResponse {
    msg: string
}
