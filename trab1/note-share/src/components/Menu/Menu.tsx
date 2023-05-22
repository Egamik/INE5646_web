const Menu = () => {
    const items = [
        {
            id: 1,
            icon: "home",
            name: "Página Inicial",
            url: "/home",
        },
        {
            id: 3,
            icon: "users-cog",
            name: "Usuário",
            url: "/usuario",
        },
    ];

    return (
        <br-menu
            id="main-navigation"
            is-push
            show-menu
            list={JSON.stringify(items)}
            data-breakpoints="col-sm-4 col-lg-3"
        />
    );
};

export default Menu;