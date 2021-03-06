
# get-sigaa

Repositório não-oficial responsável por pegar informações do sistema SIGAA.

> Em desenvolvimento

---

Sistemas SIGAA Testados:

- **IFPA**: sigaa.ifpa.edu.br (3.12.41)
- **UFOPA**: sigaa.ufopa.edu.br (3.42.12)
  
## Instalação

Com npm: 

> *npm install --save get-sigaa*

Com yarn:
> *yarn add get-sigaa*

## Exemplo

```javascript
const Sigaa = require('get-sigaa');
const fs = require('fs');

/**
  * Example File
  */

// IFPA
const ifpa =  new  Sigaa({
	institution:  'IFPA',
	debug:  true,
});

(async () => fs.writeFileSync('./ifpa.json', JSON.stringify(await ifpa.getStudentsFromCourse(204))))();
(async () => fs.writeFileSync('./ifpa2.json', JSON.stringify(await ifpa.getCourses())))();


// UFOPA
const ufopa =  new  Sigaa({
	institution:  'UFOPA',
	debug:  true,
});

(async () => fs.writeFileSync('./ufopa.json', JSON.stringify(await ufopa.getCourses())))();
```

## API

* constructor
* getCourses
* getStudentsFromCourse

---

**constructor(config)**

Inicia a classe do SIGAA com algumas configurações

| Param | Desc |
|--|--|
| config | Configuração do Sigaa |
| config.url | URL customizada (Sobrescreve o da instituição) |
| config.url.base| Base da URL do site |
| config.url.home | Caminho para tela inicial |
| config.institution | Sigla da Instituição. Valores: *ifpa, ufopa* (Mais valores e customização completa em breve)
| config.debug | Mostrar mensagens de log durante a execução|

---

**getCourses()**

Pega uma lista de cursos separado por categoria

| Suporte | Instituição |
|--|--|
| ✔️ | IFPA |
| ✔️ | UFOPA|

Retorno (Exemplo UFOPA):

```json
[
	{
		"modalidade":  "Graduação",
		"categorias": [
			{
				"categoria":  "CALE - CAMPUS UNIVERSITÁRIO DE ALENQUER",
				"cursos": [
					{
						"Nome":  "ADMINISTRAÇÃO",
						"Sede":  "Alenquer",
						"Modalidade":  "Presencial",
						"Coordenador":  "JORGIENE DOS SANTOS OLIVEIRA",
						"Link":  "portal.jsf?id=302729794&lc=pt_BR&nivel=G"
					}
				]
			},
		]
	}
]
```

---

**getStudentsFromCourse(courseId)**

Pega a lista de estudantes de um determinado curso

| Param | Desc |
|--|--|
| courseId | ID do curso, pode ser pego na lista de cursos do SIGAA |

---

| Suporte | Instituição |
|--|--|
| ✔️ | IFPA |
| ❌ | UFOPA|

Retorno:

```json
[
	{
		"Matrícula":  "xxx",
		"Aluno":  "Nome da Pessoa",
		"Ano/Período de ingresso":  "2020/1"
	}
]
```
