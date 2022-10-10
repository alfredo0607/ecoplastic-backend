const XLSX = require('xlsx')
const dayjs = require('dayjs')

const handleReadExcelFile = (file) => {

  return new Promise((resolve, reject) => {

    if (!mimeTypes.includes(file.mimetype))
      return reject('El tipo de archivo a subir no es valido')

    const readedData = XLSX.read(file.data, { type: 'buffer', cellDates: true })
    const wsname = readedData.SheetNames[0]
    const ws = readedData.Sheets[wsname]
    const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

    resolve({
      headers: getHeaderRowFromSheet(ws),
      data: dataParse
    })

  })

}

const getHeaderRowFromSheet = (sheet) => {

  const headers = [];
  const range = XLSX.utils.decode_range(sheet['!ref']);

  let C, R = range.s.r;

  for (C = range.s.c; C <= range.e.c; ++C) {

    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]

    let hdr = `Sin Nombre ${C}`;

    if (cell && cell.t) hdr = capitalizeTheFirstLetterOfEachWord(XLSX.utils.format_cell(cell)).trim();

    headers.push({
      name: hdr,
      index: C
    });

  }

  return headers;

}

const formatDataExcelUsers = ({ fields, data }) => {

  let formatedData = [];

  for (let i = 1; i < data.length; i++) {

    let newUser = {
      infoBasica: {},
      infoPersonal: {},
      infoLaboral: {},
      ubicacion: {},
      curso: {}
    };

    for (const field of fields) {

      if (field.nameKey === 'cedula') {
        newUser.infoBasica[field.nameKey] = data[i][field.index] ? data[i][field.index] : field.defaultValue;
      }

      if (field.nameKey === 'nombre') {
        newUser.infoBasica[field.nameKey] = data[i][field.index]
          ? capitalizeTheFirstLetterOfEachWord(data[i][field.index].trim())
          : field.defaultValue;
      }

      if (field.nameKey === 'genero') {

        let lowerCasedData = '', tranformData = '';

        if (data[i][field.index]) {
          lowerCasedData = String(data[i][field.index]).toLowerCase();
          tranformData = (lowerCasedData === 'm')
            ? 'Masculino'
            : (lowerCasedData === 'f') ? 'Femenino' : 'Otro';
        }

        newUser.infoBasica[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue;

      }

      if (field.nameKey === 'tipoLibreta') {

        let parsedData = '', tranformData = '';

        if (data[i][field.index]) {
          parsedData = parseInt(data[i][field.index]);
          tranformData = (isNaN(parsedData))
            ? 'No Aplica'
            : (parsedData === 1) ? 'Primera' : 'Segunda';
        }

        newUser.infoPersonal['claseLibretaMilitar'] = data[i][field.index]
          ? tranformData
          : (field.defaultValue === 'null') ? 'No Aplica' : field.defaultValue;

      }

      if (field.nameKey === 'rangoMilitar') {

        let lowerCasedData = '', tranformData = '';

        if (data[i][field.index]) {
          lowerCasedData = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (lowerCasedData === 'Oficial')
            ? 'Oficial'
            : (lowerCasedData === 'Suboficial') ? 'Suboficial' : 'No Aplica';
        }

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 'No Aplica' : field.defaultValue;

      }

      if (field.nameKey === 'numeroLibreta') {

        newUser.infoPersonal['numeroLibretaMilitar'] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'nivelEducativo') {

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? getNivelEducativo(data[i][field.index])
          : field.defaultValue === 'null' ? 'No Registrado' : field.defaultValue;

      }

      if (field.nameKey === 'tituloEducativo') {

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'fechaNacimiento') {

        let tranformData = '';

        if (data[i][field.index]) {
          tranformData = (!dayjs(data[i][field.index]).isValid())
            ? dayjs().locale('es').format('YYYY-MM-DD')
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? dayjs().locale('es').format('YYYY-MM-DD')
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'lugarNacimiento') {

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'numeroHijos') {

        let parsedData = '', tranformData = '';

        if (data[i][field.index]) {
          parsedData = parseInt(data[i][field.index]);
          tranformData = (isNaN(parsedData))
            ? 0
            : parsedData;
        }

        newUser.infoPersonal['numeroHijos'] = data[i][field.index]
          ? tranformData
          : (field.defaultValue === '') ? 0 : field.defaultValue;

      }

      if (field.nameKey === 'estadoCivil') {

        newUser.infoPersonal[field.nameKey] = data[i][field.index]
          ? getEstadoCivil(data[i][field.index])
          : (field.defaultValue === 'null') ? 'Sin Registro' : field.defaultValue;

      }

      if (field.nameKey === 'antecedentes') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.infoPersonal['antecedentesPenales'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'fechaIngreso') {

        let tranformData = '';

        if (data[i][field.index]) {
          tranformData = !dayjs(data[i][field.index]).isValid()
            ? dayjs().locale('es').format('YYYY-MM-DD')
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? dayjs().locale('es').format('YYYY-MM-DD')
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'examenMedico') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.infoLaboral['tieneExamenesMedicos'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'vencimientoExamenesMedicos') {

        let tranformData = null;

        if (data[i][field.index]) {
          tranformData = !dayjs(data[i][field.index]).isValid()
            ? null
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.infoLaboral['vencimientoExamenesMedicos'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? null
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'arl') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'eps') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? String(data[i][field.index] || '').toLowerCase().trim()
          : String(field.defaultValue || '').toLowerCase().trim();

      }

      if (field.nameKey === 'afp') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? String(data[i][field.index] || '').toLowerCase().trim()
          : String(field.defaultValue || '').toLowerCase().trim();

      }

      if (field.nameKey === 'ccf') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? String(data[i][field.index] || '').toLowerCase().trim()
          : String(field.defaultValue || '').toLowerCase().trim();

      }

      if (field.nameKey === 'tipoContrato') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? getTiposContrato(data[i][field.index])
          : field.defaultValue === 'null' ? 'Sin Registro' : field.defaultValue;

      }

      if (field.nameKey === 'duracionContrato') {

        newUser.infoLaboral[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'examenPsicofisico') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.infoLaboral['tieneExamenPsicofisico'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'realizacionExamenPsicofisico') {

        let tranformData = null;

        if (data[i][field.index]) {
          tranformData = !dayjs(data[i][field.index]).isValid()
            ? null
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.infoLaboral['realizacionExamenPsicofisico'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? null
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'vencimientoExamenPsicofisico') {

        let tranformData = null;

        if (data[i][field.index]) {
          tranformData = !dayjs(data[i][field.index]).isValid()
            ? null
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.infoLaboral['vencimientoExamenPsicofisico'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? null
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'visitaDomiciliaria') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.infoLaboral['visitaDomiciliaria'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'huellas') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.infoLaboral['huellasRegistradas'] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'experiencia') {

        newUser.infoLaboral['experienciaLaboral'] = data[i][field.index]
          ? (parseInt(data[i][field.index]) && !isNaN(parseInt(data[i][field.index])))
            ? parseInt(data[i][field.index])
            : 0
          : field.defaultValue === '' ? 0 : field.defaultValue;

      }

      if (field.nameKey === 'cargo') {

        newUser.infoLaboral['cargoLaboral'] = data[i][field.index]
          ? capitalizeTheFirstLetterOfEachWord(data[i][field.index])
          : capitalizeTheFirstLetterOfEachWord(field.defaultValue);

      }

      if (field.nameKey === 'ciudad') {

        newUser.ubicacion[field.nameKey] = data[i][field.index]
          ? capitalizeTheFirstLetterOfEachWord(data[i][field.index])
          : capitalizeTheFirstLetterOfEachWord(field.defaultValue);

      }

      if (field.nameKey === 'localidad') {

        newUser.ubicacion[field.nameKey] = data[i][field.index]
          ? capitalizeTheFirstLetterOfEachWord(data[i][field.index])
          : capitalizeTheFirstLetterOfEachWord(field.defaultValue);

      }

      if (field.nameKey === 'barrio') {

        newUser.ubicacion[field.nameKey] = data[i][field.index]
          ? capitalizeTheFirstLetterOfEachWord(data[i][field.index])
          : capitalizeTheFirstLetterOfEachWord(field.defaultValue);

      }

      if (field.nameKey === 'direccion') {

        newUser.ubicacion[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'codigoCurso') {

        newUser.curso[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'vigente') {

        let tranformData = 2, parsedValue = '';

        if (data[i][field.index]) {
          parsedValue = String(data[i][field.index]).toLowerCase().trim();
          tranformData = (parsedValue === 'si')
            ? 1
            : parsedValue === 'no' ? 0 : 2;
        }

        newUser.curso[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue === 'null' ? 2 : field.defaultValue;

      }

      if (field.nameKey === 'fechaCursoVigencia') {

        let tranformData = null;

        if (data[i][field.index]) {
          tranformData = !dayjs(data[i][field.index]).isValid()
            ? null
            : dayjs(data[i][field.index]).locale('es').format('YYYY-MM-DD');
        }

        newUser.curso[field.nameKey] = data[i][field.index]
          ? tranformData
          : field.defaultValue === null
            ? null
            : dayjs(field.defaultValue).locale('es').format('YYYY-MM-DD');

      }

      if (field.nameKey === 'nombreAcademia') {

        newUser.curso[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'nitAcademia') {

        newUser.curso[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

      if (field.nameKey === 'nro') {

        newUser.curso[field.nameKey] = data[i][field.index]
          ? data[i][field.index]
          : field.defaultValue;

      }

    }

    formatedData.push(newUser);

  }

  return formatedData;

}

const capitalizeTheFirstLetterOfEachWord = (words) => {

  if (typeof words !== 'string') return '';

  let separateWord = words.toLowerCase().split(' ');

  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
  }

  return separateWord.join(' ');

}

const getNivelEducativo = (nivelEducativo) => {

  if (typeof nivelEducativo !== 'string') return '';

  const lowerCaseNivelEducativo = String(nivelEducativo).toLowerCase();
  let stringFormated = 'No Registrado';

  if (lowerCaseNivelEducativo.search(/bachi/gi) !== -1)
    stringFormated = 'Bachiller';

  if (lowerCaseNivelEducativo.search(/[6-9]/gi) !== -1)
    stringFormated = 'Basica Secundaria';

  if (lowerCaseNivelEducativo.search(/[0-5]/gi) !== -1)
    stringFormated = 'Basica Primaria';

  if (lowerCaseNivelEducativo.search(/tecnico/gi) !== -1)
    stringFormated = 'Tecnico Profesional';

  if (lowerCaseNivelEducativo.search(/tecnologo/gi) !== -1)
    stringFormated = 'Tecnologo Profesional';

  if (lowerCaseNivelEducativo.search(/profesional/gi) !== -1)
    stringFormated = 'Pregrado';

  if (lowerCaseNivelEducativo.search(/licenciad/gi) !== -1)
    stringFormated = 'Licenciatura';

  if (lowerCaseNivelEducativo.search(/especiali/gi) !== -1)
    stringFormated = 'Especializacion';

  if (lowerCaseNivelEducativo.search(/post/gi) !== -1)
    stringFormated = 'Postgrado';

  if (lowerCaseNivelEducativo.search(/master/gi) !== -1)
    stringFormated = 'Master';

  if (lowerCaseNivelEducativo.search(/docto/gi) !== -1)
    stringFormated = 'Doctorado';

  return stringFormated;

}

const getEstadoCivil = (estadoCivil) => {

  if (typeof estadoCivil !== 'string') return 'Sin Registro';

  let estadoCivilFormated = 'Sin Registro';

  const lowerCaseEstadoCivil = estadoCivil.toLowerCase();

  if (lowerCaseEstadoCivil.search(/union libre/gi) !== -1)
    estadoCivilFormated = 'Union Libre';

  if (lowerCaseEstadoCivil.search(/solter/gi) !== -1)
    estadoCivilFormated = 'Soltero/a';

  if (lowerCaseEstadoCivil.search(/casad/gi) !== -1)
    estadoCivilFormated = 'Casado/a';

  if (lowerCaseEstadoCivil.search(/viud/gi) !== -1)
    estadoCivilFormated = 'Viudo/a';

  return estadoCivilFormated;

}

const getTiposContrato = (tipoContrato) => {

  if (typeof tipoContrato !== 'string') return 'Sin Registro';

  let tipoContratoFormated = 'Sin Registro';

  const lowerCaseEstadoCivil = tipoContrato.toLowerCase();

  if (lowerCaseEstadoCivil.search(/prueba/gi) !== -1)
    tipoContratoFormated = 'Contrato de prueba';

  if (lowerCaseEstadoCivil.search(/prestacion/gi) !== -1)
    tipoContratoFormated = 'Prestacion de servicios';

  if (lowerCaseEstadoCivil.search(/indefinid/gi) !== -1)
    tipoContratoFormated = 'Contrato indefinido';

  if (lowerCaseEstadoCivil.search(/duracion/gi) !== -1)
    tipoContratoFormated = 'Contrato a duracion determinada';

  if (lowerCaseEstadoCivil.search(/otro/gi) !== -1)
    tipoContratoFormated = 'Otro';

  return tipoContratoFormated;

}

const mimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
]

module.exports = {
  handleReadExcelFile,
  formatDataExcelUsers
}