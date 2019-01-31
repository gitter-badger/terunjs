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

## Transport Fragments

Esta funcionalidade disponível apartir da versão `1.2.5` serve para criar arquivos de transporte facilmente. Exemplo.


```json
{
    "base_dir": "/",
    "commands": {
        "crud": {
            "transport": [
                {
                    "from": "a",
                    "to": "b"
                }
            ]
        },
        "model":{
            "transport": [
                {
                    "from": "a",
                    "to": "b"
                },
                {
                    "from": "x",
                    "to": "x"
                }
            ]
        }
    }
}
```

Neste exemplo fica claro que o dois arquivos de transport se repetem tanto no comando `model` quanto no comando `crud`. Uma solução para isto seria.

```json
{
    "base_dir": "/",
    "transport-fragments":{
        "my-shared":[
            {
                "from": "a",
                "to": "b"
            }
        ]
    },
    "commands": {
        "crud": {
            "transport": [
                "my-shared"
            ]
        },
        "model":{
            "transport": [
                "my-shared",
                {
                    "from": "x",
                    "to": "x"
                }
            ]
        }
    }
}
```

Criamos um grupo de comandos dentro de `transport-fragments` e colocamos um nome para o mesmo (neste caso `my-shared`). Assim conseguimos utilizar o nome dentro do array de `transport` para que o proprio terun interprete.

::: tip
É possível ter mais arquivos dentro do transport além dos fragments, pode-se utilizar pra reutilizar código evitando assim repetir muitas vezes o mesmo arquivo.
:::
