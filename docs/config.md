---
sidebar: true
---

# Configurando TerunJS

## Entendendo a configuração
```json
{
    "tags": [">>",">>"],
    "base_dir": "/",
    "commands": {
        "crud": {
            "args": [
                "name"
            ],
            "plugins": [
                {
                    "name": "symfony:entity-form",
                    "from": "entity/>>entity<<Entity.php"
                }
            ],
            "transport": [
                {
                    "from": "template/base.js",
                    "to": "build/>>name<<Created.php",
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
| transport-fragments | Cada CHAVE é um grupo de fragmentos |


> Propriedades do commands

| Propriedade  | Detalhes|
|--------------|---------|
| crud | Ao rodar vai ficar ```terun --make crud``` |


> Propriedades do crud (comando criado)

| Propriedade  | Detalhes|
|--------------|---------|
| args | Array de argumentos que podem ser passados tanto para o nome do arquivo quanto para os arquivos que estarão no transport GLOBAL|
| plugins |Define plugins para os arquivos|
| transport | Array de arquivos que serão transportador de um template para um arquivo final |

> Propriedades do transport

| Propriedade  | Detalhes|
|--------------|---------|
| from |De onde vem o arquivo|
| to |Para onde vai o arquivo|
| args |Argumentos necessários, eles podem ser utilizados tanto no nome quanto dentros do arquivo |


## Enviroment

O nome da configuração vai ficar `terun.default.json` mas se por algum motivo tu quer separar por ambiente pode-se criar.

`terun.symfony.json`

`terun.react.json`

Ou o nome que desejar, ficando no final `terun --make [command] --env symfony`.


```sh
terun --make [command]

> se o arquivo é o terun.default.json

terun --make [command]

> se o arquivo é diferente de .default como .symfony ou outro nome

terun --make [command] --env [outronome]

```