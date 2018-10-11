# Terunjs

Terun JS é um automatizador de geração de arquivos. Por exemplo, você tem a tarefa repetitiva de criar um CRUD, ou até mesmo criar uma entidade com repositório.


```
npm install -g terunjs
```

#### 1 - Arquivo de configuração

```json
{
    "base_dir": "/",
    "commands": {
        "crud": {
            "args": [
                "name"
            ],
            "transport": [
                {
                    "from": "template/base.js",
                    "to": "build/{{name}}Created.php",
                    "args": ["propriedade"]
                }
            ]
        }
    }
}
```

> Entendendo...

| Propriedade  | Detalhes|
|--------------|---------|
| base_dir | Define a pasta principal normalmente onde fica os templates |
| commands | Cada CHAVE é um comando que pode ser executado |


> Propriedades do commands

| Propriedade  | Detalhes|
|--------------|---------|
| crud | Ao rodar vai ficar ```terun --make [env] crud``` |

> Propriedades do crud (comando criado)

| Propriedade  | Detalhes|
|--------------|---------|
| args | Array de argumentos que podem ser passados tanto para o nome do arquivo quanto para os arquivos que estarão no transport |
| transport | Array de arquivos que serão transportador de um template para um arquivo final |

> Propriedades do transport

| Propriedade  | Detalhes|
|--------------|---------|
|from|De onde vem o arquivo|
|to|Para onde vai o arquivo|
|args|Argumentos necessários, eles podem ser utilizados tanto no nome quanto dentros do arquivo |


#### 2 - Env

O nome da configuração vai ficar `terun.default.json` mas se por algum motivo tu quer separar por ambiente pode-se criar.

`terun.symfony.json`

`terun.react.json`

Ou o nome que desejar, ficando no final `terun --make symfony [command]`.


```sh
terun --make [env] [command]

> se o arquivo é o terun.default.json

terun --make [command]

> se o arquivo é diferente de .default como .symfony ou outro nome

terun --make [outronome] [command]

```