---
sidebar:true
---

# Avançando :rocket:


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


## Pipeline Operator

Na versão 1.2.6 foi liberado o `pipeline operator`. Um exemplo de seu uso mais **básico**.

```text
{{ name }} //output: "Diana Jam"
{{ name | upper }} //output: "DIANA JAM"
{{ name | upper | underscore }} //output: "DIANA_JAM"
```

### Pipelines existentes

|nome|função|
|----|------|
|upper|`nome -> NOME`|
|lower | `NoMe -> nome`|
|firstlower | `MeuNome -> meuNome`|
|underscore| `MeuNome -> meu_nome`|
|captalize|`nome_meu -> Nome_meu`|
|clearwhitespace|`nome_meu -> Nome_meu`|

Caso você coloque o nome errado, irá aparecer um erro lhe dizendo qual comando está incorreto. Caso isto aconteça **o valor final será do ultimo pipeline**. Exemplo:

```text
{{ name }} //output: "Raphael"
{{ name | funcaoErrada }} //output: "Raphael"
```

### Pipelines customizadas

Caso seja necessário criar novas pipelines é possível criar um arquivo chamado `pipes.js` dentro da pasta `config`. O arquivo deve estar exportando um objeto com as funções. Exemplo.

```js
module.exports = {
    minhaFuncao:function(value){
        return value + " Minha função incrível";
    }
}
```

Exemplo:

```txt
{{ person.name  | upper | minhaFuncao }} //output: "DAMIÃO Minha função incrível"
{{ person.name  | minhaFuncao | upper }} //output: "DAMIÃO MINHA FUNÇÃO INCRÍVEL"
```

::: warning
As funções recebem apenas UM parâmetro, que é o valor que será renderizado na tela.
:::