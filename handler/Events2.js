const fs = require('fs')

module.exports = {
    run: (client) => {
        fs.readdirSync('./events2/').forEach(folder => {
            const arquivosEvent = fs.readdirSync(`./events2/${folder}`).filter(archive => archive.endsWith('.js'))
        for (const arquivo of arquivosEvent) {
            const evento = require(`../events2/${folder}/${arquivo}`);
            if (evento.once) {
                client.once(evento.name, (...args) => evento.run(...args, client));
            } else {
                client.on(evento.name, (...args) => evento.run(...args, client));
            }
        }
    })
  }
}