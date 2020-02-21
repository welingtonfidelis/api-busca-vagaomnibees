# api-busca-vaga-omnibees

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Este projeto, construído no formato de REST API, tem objetivo de trabalhar como um Crawler, buscando informações sobre quartos de hotéis em respostas de páginas web, mais precisamente, páginas retornadas por buscas no hotel Le Canton (https://lecanton.com.br/).

### Requisitos

* [node.js] - Nodejs 8.1.3 (ou superior)
* [Postman] - Um app para executar requisições HTTP (Ex.: Postman, Insomnia, etc.)


### Instalação

Clonar projeto, instalar depedências e iniciar servidor.

```sh
$ git clone https://github.com/welingtonfidelis/api-busca-vagaomnibees.git
$ cd api-busca-vagaomnibees
$ npm install
$ node index.js
```

* [obs] Note que o servidor estará executando na porta 3001, você pode alterar isso modificando o valor da variável "port" dentro do arquivo index.js. 

Para fazer uma requisição à api, em seu app de requisição HTTP, ative o modo de requisição por método POST, em seguida insira o seguinte endereço na sua barra de endereços (url): http://localhost:3001/api/searchbydate. 
No corpo da requisição, inclua um JSON como no exemplo abaixo:
```sh
{
	"checkin": "08/07/2020",
	"checkout": "09/07/2020",
	"adults": 2, #opcional
	"childs": 1, #opcional
	"age": 15 #opcional
}
```
* [obs] Os formatos de datas aceitos são: dd/mm/aaaa, dd-mm-aaaa e ddmmaaa;

Ao enviar sua requisição, será retornada à você um conjunto (array) de dados com zero (vazio/0 caso não encontre nenhum quarto disponível com das informações enviadas) ou mais informações de quartos disponíveis. Este conjunto de dados na resposta é composto por objetos (agrupamento de dados) contedo o tipo do quarto, descrição breve, preços e imagens. 
Abaixo está um exemplo de retorno de busca na api.
```sh
[
    {
        "name": "Standard",
        "description": "Ideal para relaxar. Os quartos dispõem de diversos serviços para garantir uma estadia confortável e agradável. Todos os apartamentos Stan... ",
        "prices": [
            "R$ 1.087,75",
            "R$ 1.145,00",
            "R$ 1.145,00"
        ],
        "images": [
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=189952.jpg",
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=152609.jpg",
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=189950.jpg"
        ]
    },
    {
        "name": "Luxo",
        "description": "Confortavelmente decorado para fazer da sua estadia um momento de prazer e bem-estar. Os quartos da categoria Luxo contam Ar climatizado,... ",
        "prices": [
            "R$ 1.135,25",
            "R$ 1.195,00",
            "R$ 1.195,00"
        ],
        "images": [
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=152620.jpg",
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=152621.jpg",
            "https://myreservations.omnibees.com//Handlers/ImageLoader.ashx?imageID=189959.jpg"
        ]
    }
]
```

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


[Postman]: <https://www.postman.com/>
[node.js]: <http://nodejs.org>

