import Card from "../components/Card/Card.tsx"
import { useState } from "react"

const Home = () => {
    return (
        <>
            <h1>Página Inicial</h1>
            <div>
                <p>
                    Aplicação para compartilhamento de notas. Feito para a disciplina INE5646 - programação para web
                </p>
            </div>
            <div>
                <Card 
                    text={"Adicionar Nota"} 
                    img_src={""} 
                    img_alt={""}
                />
                <Card
                    text={"Listar Notas"}
                    img_src={""}
                    img_alt={""}
                />
            </div>
        </>
    );
};

export default Home;
