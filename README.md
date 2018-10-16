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


> Propriedades do commands

| Propriedade  | Detalhes|
|--------------|---------|
| crud | Ao rodar vai ficar ```terun --make crud``` |

> Propriedades do crud (comando criado)

| Propriedade  | Detalhes|
|--------------|---------|
| args | Array de argumentos que podem ser passados tanto para o nome do arquivo quanto para os arquivos que estarão no transport GLOBAL|
|plugins|Define plugins para os arquivos|
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

Ou o nome que desejar, ficando no final `terun --make [command] --env symfony`.


```sh
terun --make [command] 

> se o arquivo é o terun.default.json

terun --make [command]

> se o arquivo é diferente de .default como .symfony ou outro nome

terun --make [command] --env [outronome]

```


```
                    // "plugins": [
                    //     {
                    //         "name": "symfony:entity-form",
                    //         "from": "entity/{{entity}}Entity.php"
                    //     }
                    // ],
```

---

## Symfony - plugin

use
```json
{
    "plugins": [
        {
            "name": "symfony:entity-form",
            "from": "entity/>>entity<<Entity.php"
        }
    ],
    "from": "template/views/index.tpl.php",
    "to": "build/index.html.twig",
    "args": []
}
```

|propriedade| ação|
|----------|-----|
|symfony-form-builder|Retorna uma string com o formulário|
|symfony-entity-props|Retorna um array das propriedades da entidade|
|symfony-entity-get-entity-print-codes|Retorna um array da entidade e sua propriedade como `usuario.id` em vez de só `id`|
|symfony-entity-props-counter|Contador das propriedades|
|s:class_lower|Classe string minúscula|
|s:class_cap|Classe em string capitalize `agente vai para Agente`|
|s:class_plural_lower|`s:class_lower` só que no plural|
|s:class_plural_cap|`s:class_cap` só que no plural|