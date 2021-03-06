/**
 * @class
 * @version 1.0
 * @author Vinícius de Araújo Portela (vinicius-portela)
 * 
 * Instituto Federal de Ciência e Tecnologia do Pará
 */
function setup(Sigaa) {
  /**
   * Which repository resources the sigaa has support
   */
  Sigaa.support = {
    lastVersion: 'v3.12.41',
    courses: true,
    students: true,
  }

  /**
   * URL List for IFPA
   */
  Sigaa.url = {
    base: 'https://sigaa.ifpa.edu.br',
    home: '/sigaa/public/home.jsf?modo=classico',
  }

  /**
   * List of courses data for searching
   */
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