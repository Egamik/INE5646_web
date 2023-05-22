import "../../App.css"
interface CardProps {
    text: string,
    img_src: string,
    img_alt: string,
    hover?: string,
}

export default function Card(props: CardProps) {
    if (props.hover === "true") {
        return (
            <div className="card-container_item">
                <br-card
                    hover="true"
                >
                    <br-card-header slot="header">
                        <div className="ml-3">
                            <div className="text-weight-semi-bold text-up-01">{props.text}</div>
                        </div>
                    </br-card-header>
                    <br-card-content slot="content">
                        <img src={props.img_src} alt={props.img_alt} />
                    </br-card-content>
                </br-card>
            </div>
        )
    }
    return (
        <div className="card-container_item">
            <br-card
                hover="false"
            >
                <br-card-header slot="header">
                    <div className="ml-3">
                        <div className="text-weight-semi-bold text-up-01">{props.text}</div>
                    </div>
                </br-card-header>
                <br-card-content slot="content">
                    <img src={props.img_src} alt={props.img_alt} />
                </br-card-content>
            </br-card>
        </div>
    )
}

