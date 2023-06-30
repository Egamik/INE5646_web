# INE5646_web
Implementacao app gerenciamento de tarefas

## Requisitos
  - A aplicação é acessível apenas após autenticação 	
  - Cadastro de novos usuários
  - Quando autenticado, o usuário deve poder atualizar seu cadastro
  - Base de dados no back-end
  - [X] Deve ser possível compartilhar dados entre usuários
  - [X] O front-end deve ser responsivo (desktop e mobile)
  - A aplicação deve ficar disponível 24/7 em algum servidor


## Funcionamento Front-end
  - Componente raiz -> App.tsx
    - Renderiza elementos que sao comuns a todas as paginas, como header e menu
    - Guarda estados que serao usados em todo o projeto

  - Pagina MainPage
    - Contem lista de todas as notas do usuario
    - Contem botao para adicionar nova nota
    - Componente Item
      - Possui uma nota associada
      - Ao clicar abre popup com a nota associada
      - Nota associada pode ser deletada ou editada
    - Componente Message
      - Renderiza mensagem de retorno para o usuario

  - Pagina Login
    - Possui campos de input para os dados do usuario
    - Permite cadastro de novos usuarios
    - Permite log in de usuarios cadastrados
    - Outras paginas so serao renderizadas apos log in