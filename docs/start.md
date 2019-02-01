---
sidebar:true
---

# Terunjs

[![npm version](https://badge.fury.io/js/terunjs.svg)](https://badge.fury.io/js/terunjs)
![](https://img.shields.io/github/last-commit/raphaelkieling/terunjs.svg?style=flat)

## O que é
Terun JS é um automatizador de geração de arquivos.

Apartir de arquivos de template ele gera novos arquivos renderizados. Tem que criar muitos arquivos parecidos? Sem problemas hehe

Hoje em quase todo Framework nós temos os `geradores de código` que a propria ferramenta, mas com o tempo o gerador de código cria pedaços de código muito básicos sendo inútil a longo prazo. Já passou pelo problema de dar um `ng generate component meuteste` e o código gerado ser sempre algo básico? Pois é :triumph:

Criar MAIS código se tornou MAIS simples.

- Definir o arquivo de configuração com `terun --init`
- Definir os templates na linguagem que quiser
- Escolher os valores de entrada (ou já ter eles disponibilizados se tiver um plugin)
- Rodar o comando `terun --make (command)[env]` 
- Ser feliz :laughing:

## Como ele funciona

> Entrada
```html
    <h1>Criar {{name}}</h1>
    <p>{{text}}</p>
```
>Saída

```html
    <h1>Criar MEU EXEPLO INCRÍVEL</h1>
    <p>E assim temos um template prontinho :D</p>
```

::: tip
Importante lembrar que a linguagem é indiferente, já que é trabalhado com texto. Entenda, TerunJS apenas gerencia teus arquivos "grudando" o conteúdo dentro do template através dos "args" que será visto na parte de configuração ou com plugins que disponibilizam mais funcionalidades.
:::

## Instalando

```
npm install -g terunjs
```


## Getting Start

### 1 - Crie uma pasta pra começar

```sh
    mkdir meuteste
    cd meuteste
```

### 2 - Iniciar o arquivo de configuração

```sh
    terun --init
```

Vai gerar algo bem parecido com isto:

[Não entendi bem este arquivo](./config.md)
```json
// terun.default.json

{
    "base_dir": "/",
    "commands": {
        "init": {
            "args": [],
            "transport": [
                {
                    "from": "test.txt",
                    "to": "{{my_arg}}.html",
                    "args": ["my_arg"]
                }
            ]
        }
    }
}
```

### 3 - Criar o arquivo de transporte

Dentro dos arquivos de transporte nos vemos que o conteúdo a ser renderizado é o `test.txt` então vamos lá

```sh
    echo 'Hello {{my_arg}}' > test.txt
```

Dentro dele vamos definir a variável my_arg, pra ser colocada pelo Terun.

### 4 - Rodar

::: tip
Lembrando que o arquivo vai ser criado com o nome de `{{my_arg}}.html` então o que tu colocar de argumento vai ser o nome do arquivo.
:::

Vamos rodar o comando init que está dentro de "commands" no arquivo de configuração.

```sh
    terun --make init
```
