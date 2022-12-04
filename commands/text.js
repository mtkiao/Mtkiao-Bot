const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const CryptoJS = require('crypto-js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('text')
		.setDescription('文字加密&解密')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("加密or解密")
                .setDescription("加密/解密文字")      
                .addStringOption(option =>option.setName('加密算法')
                    .setDescription('請選擇一個加密算法')
                        .addChoices(
                            { name: 'AES', value: 'AES' },
                            { name: 'DES', value: 'DES' },
                            { name: 'RC4', value: 'RC4' },
                            { name: 'Rabbit', value: 'Rabbit' },
                            { name: 'TripleDes', value: 'TripleDes' },
                    ).setRequired(true))
                .addStringOption(option =>option.setName('文字').setDescription('請輸入文字').setRequired(true))    
                .addStringOption(option =>option.setName('加密or解密')
                    .setDescription('請選擇解密或加密')
                        .addChoices(
                            { name: '解密', value: 'decrypt' },
                            { name: '加密', value: 'encrypt' },
                    ).setRequired(true))
                .addStringOption(option =>option.setName('密碼').setDescription('請輸入密碼'))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("哈希")
                .setDescription("哈希加密文字")
                .addStringOption(option =>option.setName('哈希算法')
                    .setDescription('請選擇一個哈希Hash算法')
                        .addChoices(
                            { name: 'SHA1', value: 'SHA1' },
                            { name: 'SHA224', value: 'SHA224' },
                            { name: 'SHA256', value: 'SHA256' },
                            { name: 'SHA384', value: 'SHA384' },
                            { name: 'SHA512', value: 'SHA512' },
                            { name: 'MD5', value: 'MD5' },
                ).setRequired(true))
                .addStringOption(option =>option.setName('文字').setDescription('請輸入文字').setRequired(true))   
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("編碼or解碼")
                .setDescription("編碼/解碼文字")
                .addStringOption(option =>option.setName('編碼算法')
                    .setDescription('請選擇一個編碼算法')
                        .addChoices(
                            { name: 'Base64', value: 'Base64' },
                    ).setRequired(true))
                .addStringOption(option =>option.setName('文字').setDescription('請輸入文字').setRequired(true))  
                .addStringOption(option =>option.setName('編碼or解碼')
                    .setDescription('請選擇編碼或解碼')
                        .addChoices(
                            { name: '解碼', value: 'decoding' },
                            { name: '編碼', value: 'encoding' },
                    ).setRequired(true))
        ),
	async execute(interaction,client) {
        await interaction.deferReply();
        if (interaction.options.getSubcommand() === "加密or解密") {
            const EncryptionAlgorithm = interaction.options.getString('加密算法');
            const text = interaction.options.getString('文字');
            const DecryptOrEncrypt = interaction.options.getString('加密or解密');
            const password = interaction.options.getString('密碼');

            try{
                if (DecryptOrEncrypt == "encrypt") {
                    if (EncryptionAlgorithm == "AES") {
                        if (!password) { var EnDeText = CryptoJS.AES.encrypt(text, "").toString() }
                        else { var EnDeText = CryptoJS.AES.encrypt(text, password).toString() }
                    }
                    if (EncryptionAlgorithm == "DES") {
                        if (!password) { var EnDeText = CryptoJS.DES.encrypt(text , "").toString() }
                        else { var EnDeText = CryptoJS.DES.encrypt(text, password).toString() }
                    }
                    if (EncryptionAlgorithm == "RC4") {
                        if (!password) { var EnDeText = CryptoJS.RC4.encrypt(text , "").toString() }
                        else { var EnDeText = CryptoJS.RC4.encrypt(text, password).toString() }
                    }
                    if (EncryptionAlgorithm == "Rabbit") {
                        if (!password) { var EnDeText = CryptoJS.Rabbit.encrypt(text , "").toString() }
                        else { var EnDeText = CryptoJS.Rabbit.encrypt(text, password).toString() }
                    }
                    if (EncryptionAlgorithm == "TripleDes") {
                        if (!password) { var EnDeText = CryptoJS.TripleDES.encrypt(text , "").toString() }
                        else { var EnDeText = CryptoJS.TripleDES.encrypt(text, password).toString() }
                    }
                }
                
                else if (DecryptOrEncrypt == "decrypt") {
                    if (EncryptionAlgorithm == "AES") {
                        if (!password) { var EnDeText = CryptoJS.AES.decrypt(text, "").toString(CryptoJS.enc.Utf8) }
                        else { var EnDeText = CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8) }
                    }
                    if (EncryptionAlgorithm == "DES") {
                        if (!password) { var EnDeText = CryptoJS.DES.decrypt(text , "").toString(CryptoJS.enc.Utf8) }
                        else { var EnDeText = CryptoJS.DES.decrypt(text, password).toString(CryptoJS.enc.Utf8) }
                    }
                    if (EncryptionAlgorithm == "RC4") {
                        if (!password) { var EnDeText = CryptoJS.RC4.decrypt(text , "").toString(CryptoJS.enc.Utf8) }
                        else { var EnDeText = CryptoJS.RC4.decrypt(text, password).toString(CryptoJS.enc.Utf8) }
                    }
                    if (EncryptionAlgorithm == "Rabbit") {
                        if (!password) { var EnDeText = CryptoJS.Rabbit.decrypt(text , "").toString(CryptoJS.enc.Utf8) }
                        else { var EnDeText = CryptoJS.Rabbit.decrypt(text, password).toString(CryptoJS.enc.Utf8) }
                    }
                    if (EncryptionAlgorithm == "TripleDes") {
                        if (!password) { var EnDeText = CryptoJS.TripleDES.decrypt(text , "").toString(CryptoJS.enc.Utf8) }
                        else { var EnDeText = CryptoJS.TripleDES.decrypt(text, password).toString(CryptoJS.enc.Utf8) }
                    }
                }
            } catch {
                return interaction.editReply(":x:發生錯誤")
            }

            const embed = new MessageEmbed()
            .setColor(color=0xE693CB)
            .setTitle(`加密&解密 - ${EncryptionAlgorithm}`)
            .setDescription(`以下為加密&解密後的結果`)
            .addFields({ name: '加密&解密前:', value: '```' + `${text}` + '```'})
            .setTimestamp()
            if (!EnDeText) embed.addFields({ name: '加密&解密後:', value: '```' + ` ` + '```'})
            else embed.addFields({ name: '加密&解密後:', value: '```' + `${EnDeText}` + '```'})

            interaction.editReply({ embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "哈希") {
            const HashAlgorithm = interaction.options.getString('哈希算法');
            const text = interaction.options.getString('文字');

            try{
                if (HashAlgorithm == "SHA1") {
                    var HashText = CryptoJS.SHA1(text).toString();
                }
                else if (HashAlgorithm == "SHA224") {
                    var HashText = CryptoJS.SHA224(text).toString();
                }
                else if (HashAlgorithm == "SHA256") {
                    var HashText = CryptoJS.SHA256(text).toString();
                }
                else if (HashAlgorithm == "SHA384") {
                    var HashText = CryptoJS.SHA384(text).toString();
                }
                else if (HashAlgorithm == "SHA512") {
                    var HashText = CryptoJS.SHA512(text).toString();
                }
                else if (HashAlgorithm == "MD5") {
                    var HashText = CryptoJS.MD5(text).toString();
                }
            } catch (e) {
                return interaction.editReply(":x:發生錯誤");
            }

            const embed = new MessageEmbed()
            .setColor(color=0xE693CB)
            .setTitle(`哈希 - ${HashAlgorithm}`)
            .setDescription(`以下為哈希加密後的結果`)
            .addFields({ name: '哈希加密前:', value: '```' + `${text}` + '```'})
            .addFields({ name: '哈希加密後:', value: '```' + `${HashText}` + '```'})
            .setTimestamp()
            interaction.editReply({ embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "編碼or解碼") {
            const EncodingAlgorithm = interaction.options.getString('編碼算法');
            const text = interaction.options.getString('文字');
            const DecodingOrEncoding = interaction.options.getString('編碼or解碼');
            try{
                if (DecodingOrEncoding == "encoding") {
                    if (EncodingAlgorithm == 'Base64') {
                        var words = CryptoJS.enc.Utf8.parse(text);
                        var DeEnconding = CryptoJS.enc.Base64.stringify(words);
                    }
                }
                else if (DecodingOrEncoding == 'decoding') {
                    if (EncodingAlgorithm == 'Base64') {
                        var words = CryptoJS.enc.Base64.parse(text);
                        var DeEnconding = words.toString(CryptoJS.enc.Utf8);
                    }
                }
            } catch (e) {
                return interaction.editReply(":x:發生錯誤");
            }

            const embed = new MessageEmbed()
            .setColor(color=0xE693CB)
            .setTitle(`編碼&解碼 - ${EncodingAlgorithm}`)
            .setDescription(`以下為編碼&解碼後的結果`)
            .addFields({ name: '編碼&解碼前:', value: '```' + `${text}` + '```'})
            .addFields({ name: '編碼&解碼後:', value: '```' + `${DeEnconding}` + '```'})
            .setTimestamp()
            interaction.editReply({ embeds: [embed] });
        }
	},
};