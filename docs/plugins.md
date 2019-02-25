# Plugins

Plugins são utilizados pelo terun para extender funcionalidades e disponibilizar aos templates mais variáveis.

## Utilizando

Depende do plugin, apenas o nome será obrigatório pois como ele é único, será utilizado pra inicia-lo.

Isto é colocado DENTRO do arquivo de configuração do terun, dentro do comando que quiser.

```
"plugins": [
    {
        "name": "nome_do_plugin",
    }
]
```

## Symfony

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

### Será disponibilizado as seguintes variáveis aos templates:

|propriedade| ação|
|----------|-----|
|symfony-form-builder|Retorna uma string com o formulário do symfony|
|symfony-entity-props|Retorna um array das propriedades da entidade|
|symfony-entity-get-entity-print-codes|Retorna um array da entidade e sua propriedade como `usuario.id` em vez de só `id`|
|symfony-entity-props-counter|Contador das propriedades|
|s:class_lower|Classe string minúscula|
|s:class_cap|Classe em string capitalize `agente vai para Agente`|
|s:class_plural_lower|`s:class_lower` só que no plural|
|s:class_plural_cap|`s:class_cap` só que no plural|


## Entity

```json
{
    "plugins": [
        {
            "name"    : "entity",
            "entity_dir" : "entitys",
            "field":{
                "dir" : "fields",
                "extension": "html"
            }
        }
    ]
}
```

Pode-se utilizar a flag `--override-all` para pular qualquer pedido de sobreescrever um arquivo. `terun --make [command] --override-all`

O plugin de entity trabalha com arquivos para especificar objetos que serão utilizados.

> Exemplo: Preciso criar os objetos de Carro.js, Marca.js e Pessoa.js. Então seráo criadas 3 entidades que serão utilizadas pra criar estes três arquivos com tudo definido.

```
project
|   README.md
|___terun (optional)
|   |  terun.default.json
|   |__templates
|   |   | classe.html
|   |   | formulario.html
|   |__entitys
|   |   | pessoa.js
|   |   | veiculo.js
|   |   | marca.js
|   |   | ...
|   |__config
|   |   | fields.js
|   |__fields
|   |   | text.html
|   |   | boolean.html
|   |   | hasMany.html
|   |   | ...
```

::: danger Breaking Change
A partir da versão `1.3.6` as entidades devem ser em `.js` e não mais em `.json`. De uma olhada no processo de [migração](./migration.html#versao-1-3-5-para-1-3-6)
:::

::: danger Breaking Change
A partir da versão `1.3.6` o arquivo `field.json` vira `attributes.js`. De uma olhada no processo de [migração](./migration.html#versao-1-3-5-para-1-3-6)
:::

### Configurando:

|propriedade| para que serve|
|----------|-----|
|schema|é o esquema da entidade, definindo nomes, atributos e etc|
|config|define configurações para a entidade|

Dentro do schema:

|propriedade| para que serve|
|----------|-----|
|name|Nome da entidade|
|custom|Define atributos customizados para serem utilizados dentro dos templates|
|attributes|Define atributos dentro de uma entidade|

```js
// Pessoa.js

module.exports = {
    schema:{
        name:"Pessoa",
        custom:{
            tablename:"PESSOA",
            alias:"PS",
            qualquer_atributo:"MEU ATRIBUTO",
            web:{},
            mobile:{
                version:1.2
            }
        },
        attributes:{
            NOME:{
                "type":"text",
                "required":true,
            },
            IDADE:{
                "type":"number"
            },
            SOLTEIRO:{
                "type":"boolean"
            },
            DATA_ATUALIZACAO:{
                "type":"date"
            },
            EXCLUIDO:{
                "type":"number"
            },
            CARROS:{
                "reference":"minha-sub-pasta/veiculo | hasMany"
                //Nome do arquivo Veiculos.js que está dentro da pasta entitys
            }
        }
    }
}
```

### Será disponibilizado as seguintes variáveis aos templates:

|propriedade| ação|
|----------|-----|
|entity:name|Nome da entidade `schema.name`|
|entity:forms|Array dos campos renderizados lá no fields `provenientes da pasta fields`|
|entity:files|Array de arquivos de entidades (apenas o nome) `arquivos dentro de entitys`|
|entity:entitys_config|Array de configuração de entidades (conteúdo) `arquivos dentro de entitys`|
|entity:references|Array de referencia da entidade `no caso da pessoa ela tem carros como referencia`|
|entity:attributes|Array de atributos com seus parametros `schema.attributes`|
|entity:custom|Propriedades do objeto custom da entidade definida `schema.custom`|

### Explain das propriedades retornadas
> Está sendo utilizado como exemplo o arquivo de configuração Pessoa.js que está acima.

### `entity:attributes`

|propriedade| retorno|
|-----------|--------|
|name| Retorna o nome do atributo|
|type| Retorna o tipo do atributo: `number, text, date...` |
|reference|Retorna o objeto referenciado, no caso da `pessoa.js` o `veiculos.js` e suas propriedades|
|isReference| Retorna se o atributo é uma referência ou não |
|typeReference| Retorna o tipo de referência: `hasMany, belongsToMany, hasOne, belongsToOne` |
|field| Retorna o arquivo de field |
|options| Retorna o resto das opções colocadas dentro do atributo por exemplo `length` ou algum atributo customizado |

exemplo:

```php
// model.txt
// lembre-se que é um foreach, esta é a sintaxe do mustachejs

{{#entity:attributes}}
    $select->where("{$this->_name}.{{name}} = {{options.default}}");
{{/entity:attributes}}

// Digamos que ele tenha referencia com carros

{{#entity:attributes}}
    {{#entity:references}} // faz um FOREACH pra cada uma e adiciona estas linhas
        $select->joinInner(
            array("{{reference.custom.db.alias}}"=> "{{reference.custom.db.tablename}}"),
            "{{reference.custom.db.alias}}.ID = {$this->_name}.{{name |> underscore |> upper}}"
        );
    {{/entity:references}}
{{/entity:attributes}}
```

```php
// model.php
// Lembre-se, você vai gerar o que você quiser!

$select->where("{$this->_name}.nome = AlgumNome");
$select->where("{$this->_name}.idade = 18");

$select->joinInner(
    array("VEIC"=> "VEICULOS"),
    "VEIC.ID = {$this->_name}.ID_VEICULO" // no attributes ele era idVeiculo
);
```


### Utilizando dicionários e parâmetros default

É muito fácil nós termos muitos atributos onde em cada plataforma ele pode trabalhar de um jeito diferente. Oracle é VARCHAR, Kotlin é STRING. Pra sanar este problema foi criado os dicionários.

Crie um arquivo dentro da pasta `config` chamado `attributes.js`.

|Propriedade| Responsabilidade|
|-----------|-----------------|
|defaultValues|Pode-se utilizar as chaves de `attribute` onde adiciona propriedades default dentro dos atributos e `custom` que adiciona propriedades default dentro da chave custom das entidades|
|dictionary| Cada chave é um escopo diferente como linguagens por exemplo. No exemplo abaixo vemos um dicionário criado para o `Oracle`, ouso dela é bem simples dentro do terun, quando for utilizar um atributo com `number, text, date ou o mesmo valor que está definido dentro do objeto oracle`, pode-se utilizar `type:oracle` tendo como saida de `number` = `NUMBER` ou `boolean` = `NUMBER(1)`|

```js
module.exports  = {
    defaultValues:{
        attribute:{
            sync: true
        },
        custom:{
            // adiciona atributos dentro da propriedade custom de todas entidades (caso já não exista)
        }
    },
    dictionary:{
        oracle:{
            number: 'NUMBER',
            text: 'VARCHAR2',
            date: 'DATE',
            boolean: 'NUMBER(1)',
            enum: 'NUMBER'
        }
    }
}
```

### Tree view

Utilize as pastas pra criar agrupadores de **Entitys** dentro do terun. Assim:

```
entitys
    |_folder
    |   | folder.js
    |   | ...
    |_funcionalidade-especifica
    |   | teste.js
    |   | ... 
    | pessoa.js
    | veiculo.js
    | marca.js
    | ...
```

Ao rodar o comando irá se deparar com isto:

![Tree view](./images/1_3_4/terun_tree_view.png)

::: tip
 Fique a vontade para colocar o nome dos arquivos e pastas como quiser.
:::