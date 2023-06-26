import { useState } from "react";

interface NoteProps {
    title: string,
    body: string,
    ownerId: number
}
/**
 * Componentes:
 *  - Campo de texto com valor da nota
 *  - Botao deletar
 *  - Botao compartilhar
 *  - Botao editar
 */
const Note = (props: NoteProps) => {
    const [text, setText] = useState<string>()

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value)
    }

    return (
        <div>
            <textarea 
                onChange={handleTextChange}
                placeholder={text}
            />
        </div>
    )
}

export default Note;