---
sidebar:true
---

# Migrando

## Versão `1.3.5` para `1.3.6`

Antes da versão `1.3.6` as entidades eram `.json` e o arquivo `field.json` ainda existia. Agora nós algumas mudanças para fazer e conseguir utilizar a nova versão.


### entidade.json
Antigo:
```json
{
	"schema":{
		...
	}
}
```

Novo:
```js
let colocaIndexEmCadaItem = (array) => array.map((value, index)=> ({
	value,
	index,
	last: !array[index + 1]
}));

module.exports = {
	schema:{
		...
		attributes:{
			unidade:{
				type: "enum",
				options: colocaIndexEmCadaItem(["Quilo", "Litros"])
			}
		}
	}
}
```

Esta mudança ocorreu pelo fato do `json` ser muito limitado a questão de lógica. Colocando ele para `javascript` temos o poder de criar funções, chamar outros arquivos ou criar lógicas únicas em cada entidade.

### fields.json

Antigo: 

```json
{
	"defaultValues":{
		"required": true
	}
}
```

Novo:

```js
module.exports = {
	defaultValues:{
		attribute:{
			...
		},
		custom:{
			...
		}
	},
	dictionary:{
		...
	}
}
```

A mudança foi feita apartir do mesmo argumento de cima, poder. Outra coisa que levou a esta mudança foi o dicionário de propriedades que foi adicionado nesta nova versão. Explicado na sessão de plugins:  [entity](/plugins.html#utilizando-dicionarios-e-parametros-default).