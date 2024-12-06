const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

// Crea il client del bot con gli intenti necessari
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Predefiniamo i comandi slash
const commands = [
    new SlashCommandBuilder().setName('prank').setDescription('Prendi in giro un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da prendere in giro').setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('Tipo di scherzo da fare').setRequired(true)
            .addChoices(
                { name: 'roast', value: 'roast' },
                { name: 'noob', value: 'noob' },
                { name: 'ugly', value: 'ugly' },
                { name: 'grind', value: 'grind' },
                { name: 'rip', value: 'rip' }
            )),
    new SlashCommandBuilder().setName('joke').setDescription('Scherza con un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da prendere in giro').setRequired(true)),
    new SlashCommandBuilder().setName('unban').setDescription('Revoca il ban di un utente')
        .addStringOption(option => option.setName('user_id').setDescription('ID dell\'utente da sbannare').setRequired(true)),
    new SlashCommandBuilder().setName('ban').setDescription('Banna un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da bannare').setRequired(true)),
    new SlashCommandBuilder().setName('kick').setDescription('Kicka un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da kickare').setRequired(true)),
    new SlashCommandBuilder().setName('mute').setDescription('Muta un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da mutare').setRequired(true)),
    new SlashCommandBuilder().setName('unmute').setDescription('Revoca il mute di un utente')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da smutare').setRequired(true)),
    new SlashCommandBuilder().setName('help').setDescription('Mostra tutti i comandi del bot')
];

client.once('ready', async () => {
    console.log(`Bot pronto! Come ${client.user.tag}`);
    
    try {
        // Registra i comandi nella guild con ID specifico
        const guild = client.guilds.cache.get('1314522141156184085');  // ID della tua guild
        if (guild) {
            await guild.commands.set(commands);
            console.log("Comandi registrati correttamente!");
        } else {
            console.log("Guild non trovata!");
        }
    } catch (error) {
        console.error("Errore nella registrazione dei comandi:", error);
    }
});

// Gestione delle interazioni
client.on('interactionCreate', async interaction => {
    console.log(`Comando ricevuto: ${interaction.commandName}`);
    
    if (!interaction.isCommand()) return;
    
    const { commandName } = interaction;
    
    try {
        if (commandName === 'joke') {
            const user = interaction.options.getUser('user');
            const jokes = [
                `${user.tag}, sei così lento che il tuo spirito guida è un bradipo! 😜`,
                `${user.tag}, che fine ha fatto il tuo senso dell'umorismo? Sei sicuro di averlo mai avuto? 😆`,
                `${user.tag}, sei più lento di una connessione dial-up! 📶😂`
            ];
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            await interaction.reply(randomJoke);
            console.log(`Risposta inviata a ${user.tag}: ${randomJoke}`);
        }

        if (commandName === 'prank') {
            const user = interaction.options.getUser('user');
            const type = interaction.options.getString('type');
            const roasts = [
                `${user.tag}, sei così brutto che quando entri in una stanza, la luce se ne va! 😆`,
                `${user.tag}, la tua faccia potrebbe competere con una ruota panoramica! 🤣`
            ];
            let response;
            if (type === 'roast') {
                response = roasts[Math.floor(Math.random() * roasts.length)];
            }
            await interaction.reply(response);
            console.log(`Risposta inviata a ${user.tag} con tipo ${type}: ${response}`);
        }

        if (commandName === 'ban') {
            const user = interaction.options.getUser('user');
            if (!user) return interaction.reply('Per favore, fornisci un utente da bannare.');
            
            try {
                await interaction.guild.members.ban(user);
                await interaction.reply(`${user.tag} è stato bannato.`);
            } catch (error) {
                console.error("Errore durante il ban:", error);
                await interaction.reply('Non sono riuscito a bannare l\'utente.');
            }
        }

        if (commandName === 'kick') {
            const user = interaction.options.getUser('user');
            if (!user) return interaction.reply('Per favore, fornisci un utente da kickare.');

            try {
                await interaction.guild.members.kick(user);
                await interaction.reply(`${user.tag} è stato kickato.`);
            } catch (error) {
                console.error("Errore durante il kick:", error);
                await interaction.reply('Non sono riuscito a kickare l\'utente.');
            }
        }

        if (commandName === 'unban') {
            const userId = interaction.options.getString('user_id');
            try {
                await interaction.guild.members.unban(userId);
                await interaction.reply(`L\'utente con ID ${userId} è stato sbannato.`);
            } catch (error) {
                console.error("Errore durante lo sban:", error);
                await interaction.reply('Non sono riuscito a sbannare l\'utente.');
            }
        }

        if (commandName === 'help') {
            await interaction.reply("Ecco i comandi disponibili: /prank, /joke, /ban, /kick, /unban...");
        }

    } catch (error) {
        console.error("Errore generico:", error);
        await interaction.reply('Si è verificato un errore durante l\'esecuzione del comando.');
    }
});

// Login con il token del bot
client.login('MTMxNDUxOTQ0OTQ0NDgxNDg1OA.G4yjGG.icwtAU5TEJKCa9VKULFMw2XgZyw0JBCa5aaPiQ');
