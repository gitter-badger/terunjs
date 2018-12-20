# Terunjs

Terun JS é um automatizador de geração de arquivos. Você tem a tarefa repetitiva de criar um CRUD, ou até mesmo criar uma entidade com repositório.

Apartir de arquivos de template ele gera novos arquivos. Isto é mais utilizado pra quando se tem arquivos que já são padrões do projeto. CRUD's, controllers, ou até mesmo repositorios, arquivos que são criados a cada nova feature. 

Hoje em quase todo Framework nós temos os `geradores de código`, mas com o tempo o gerador de código cria pedaços de código muito básicos sendo inútil a longo prazo.

Criar mais código se tornou simples.

- Definir o arquivo de configuração com `terun --init`
- Definir os templates na linguagem que quiser
- Escolher os valores de entrada
- Rodar o comando `terun --make (command)[env]` 
- Ser feliz :laughing:

> Entrada em twig (indiferente a linguagem)
```twig
    {% block body %}
        <h1>Criar >> s:class_cap <<</h1>

        <button-back-list path="{{ path('>>s:class_lower<<_index') }}"></button-back-list>

        {{ include('>>s:class_lower<</_form.html.twig') }}
    {% endblock %}
```
>Saída

```twig
{% block body %}
    <h1>Criar Condutor</h1>

    <button-back-list path="{{ path('condutor_index') }}"></button-back-list>

    {{ include('condutor/_form.html.twig') }}
{% endblock %

```

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
"plugins": [
    {
        "name": "symfony:entity-form",
        "from": "entity/{{entity}}Entity.php"
    }
]
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
    ]
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
