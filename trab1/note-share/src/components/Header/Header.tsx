const Header = () => {
    const title = "Note Share"

    return (
        <br-header
            title={title}
            has-menu
        >
            <div slot="headerMenu">
                <br-button
                    role="option"
                    circle
                    density="small"
                    aria-label="Menu"
                    icon="bars"
                    data-toggle="menu"
                    data-target="#main-navigation"
                ></br-button>
            </div>
        </br-header>
    );
};

export default Header;
