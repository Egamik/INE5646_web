const Menu = () => {
    const items = [
        {
            id: 1,
            icon: "home",
            name: "Página Inicial",
            url: "/",
        },
        {
            id: 2,
            icon: "users-cog",
            name: "Add Note",
            url: "/addnote",
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