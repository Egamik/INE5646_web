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

interface APIResponseLogIn {
    accessToken: string,
    user_id: string
}

interface APIUserResponse {
    message: string,
    id: string
}

interface APINoteRequest {
    title: string,
    content: string,
    status: string
}

interface APINoteResponse {
    msg: string
}