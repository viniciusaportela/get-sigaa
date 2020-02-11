/**
 * @class
 * @version 1.0
 * @author Vinícius de Araújo Portela (vinicius-portela)
 * 
 * Universidade Federal do Oeste do Pará
 */
function setup(Sigaa) {
  // Custom Values
  Sigaa.url = {
    base: 'https://sigaa.ufopa.edu.br',
    home: '/sigaa/public/home.jsf',
  }

  Sigaa.courses = [
    {
      title: 'Técnico',
      id: 'p-tecnico',
      level: 'T'
    },
    {
      title: 'Graduação',
      id: 'p-graduacao',
      level: 'G'
    },
    {
      title: 'Formação Complementar',
      id: 'p-formacao-complementar',
      level: 'F'
    },
    {
      title: 'Pós Graduação Stricto Sensu',
      id: 'p-stricto',
      level: 'S'
    },
    {
      title: 'Pós Graduação Lato Sensu',
      id: 'p-lato',
      level: 'L'
    },
  ]
}

module.exports = setup