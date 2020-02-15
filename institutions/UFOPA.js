/**
 * @class
 * @version 1.0
 * @author Vinícius de Araújo Portela (vinicius-portela)
 * 
 * Universidade Federal do Oeste do Pará
 */
function setup(Sigaa) {
  /**
   * Which repository resources the sigaa has support
   */
  Sigaa.support = {
    lastVersion: 'v3.42.12',
    courses: true,
    students: false,
  }

  /**
   * URL List for UFOPA
   */
  Sigaa.url = {
    base: 'https://sigaa.ufopa.edu.br',
    home: '/sigaa/public/home.jsf',
  }

  /**
   * List of courses data for searching
   */
  Sigaa.courses = [
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