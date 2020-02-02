const chalk = require('chalk');
const inquirer = require('inquirer');
const program = require("commander");

const colors = require('./lib/console-colors');
const doreport = require('./lib/doreport');
const package = require('./package.json');

program.version(package.version)
    .name("multilighthouse")
    .helpOption('-h, --help', 'Lista funcionalidades');

program
    .command("doreport [path]")
    .alias('dr')
    .description("Cria uma lista de relatórios do lighthouse, a partir de ums lista de endpoints.")
    .action(async(path, options) => {
        try {
            let answers;
            if (!path) {
                answers = await inquirer.prompt([{
                    type: "input",
                    name: "path",
                    message: "Onde está seu json ? (Caminho absoluto)",
                    validate: value =>
                        value ?
                        true : "É nessário passa o caminho do json(array {name: nome do endpoint, url: url})"
                }]);
                path = answers.path;
            }
            doreport(path);
        } catch (error) {
            console.error(error);
        }
    });

program.on('option:verbose', function() {
    process.env.VERBOSE = this.verbose;
});

program.on('command:*', function() {
    console.error('Comando inválido: %s\nRode "multilighthouse --help" para visualizar a lista de comandos.', program.args.join(' '));
    process.exit(1);
});

program.on('--help', function() {
    console.log('')
    console.log('Exemplos:');
    console.log(` ${this._name} --help para obter ajuda!`);
    console.log(` ${this._name} doreport c:/relatorio-lighthouse.json para gerar os relatórios a partir de um objeto json`);
    console.log(` ${this._name} dr c:/relatorio-lighthouse.json para gerar os relatórios a partir de um objeto json`);
});

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
    console.warn(colors.FgRed, 'Por favor rode o seguinte comando: "multilighthouse --help"');
    console.warn(colors.FgRed, 'Assim obterá informação de uso da ferramenta.');
    console.log(colors.Reset);
}