const { Client, Attachment } = require('discord.js');

let fs = require(`fs`);
let schedule = require(`node-schedule`);
var jsonFormat = require('./');

const client = new Client();

var perso= {}
var voeux = {}
var combat = {}
const limitePoints = 15

token = fs.readFileSync("db/token.txt", 'utf8');
token = token.split('\n')

fiche = fs.readFileSync("db/fiche.txt", 'utf8');

strings = fs.readFileSync("string.json", 'utf8');
strings = JSON.parse(strings)

perso = fs.readFileSync("db/perso.json", 'utf8');
perso = JSON.parse(perso)

terrain = fs.readFileSync("db/terrain.json", 'utf8');
terrain = JSON.parse(terrain)

modo = fs.readFileSync("db/modo.json", 'utf8');
modo = JSON.parse(modo)

var roles = {}
var j =null

var ficheValidation = null ;
var guild = null

client.on('ready',function (){
	console.log(strings["pret"]);
	setTimeout(function(){ // in leftToEight() milliseconds run this:
        resetJournalier() // send the message once
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
					resetJournalier()
        }, dayMillseconds)
    }, leftToEight())

	guild  = client.guilds.cache.get("570999527507755018")
	ficheValidation = guild.channels.cache.get("766586088327348256")
	roles["RP"] = guild.roles.cache.get("766584856351735808")

});

client.on('message',function(message){
	if(message.author.id != "684769182205739028"){
		lignes = message.content.split("\n")
		spl = []
		for (var x in lignes) {
			spl.push(lignes[x].split(' '))
		}
		if (spl[0][0]=="!per" && estModo(message.author.id)) {
			for (var x in perso) {
				message.send(afficherFichePublic(perso[x]))
			}
		}
		// 	if (spl[0][0]=="!validation" && estModo(message.author.id)) {
		//
		// 		if(spl[0][1]=== undefined){
		// 			message.channel.send(strings["commandeInvalide"]["general"]+strings["commandeInvalide"]["validation"])
		// 		}else if (perso[spl[0][1]]===undefined) {
		// 			message.channel.send(strings["error"]["pasDePerso"].replace("${0}",spl[0][1]))
		// 		}else if (perso[spl[0][1]]["validation"]) {
		// 			message.channel.send(strings["error"]["dejaValidee"])
		// 		}else {
		// 			perso[spl[0][1]]["validation"] = true
		// 			guild.members.cache.get(spl[0][1]).roles.add(roles["RP"])
		// 			message.channel.send(strings["persoValid"])
		// 			sauvgarde(perso,"perso")
		// 		}
		//
		//
		//
		// 	}else if (spl[0][0]=="!terrain") {
		// 		if(spl[0][1]===undefined || !estModo(message.author.id)){
		// 			if(terrain[message.channel.id]===undefined){
		// 				message.channel.send(strings["error"]["pasUnTerrain"])
		// 			}else{
		// 				message.channel.send(afficherTerrain(message.channel.id))
		// 			}
		// 		}else{
		// 			let nouv = {}
		// 			nouv["Force"] = Number(spl[0][1])
		// 			nouv["Agilite"] = Number(spl[0][2])
		// 			nouv["Mental"] = Number(spl[0][3])
		// 			nouv["Description"] = lignes[1]
		// 			terrain[message.channel.id] = nouv
		// 			sauvgarde(terrain,"terrain")
		// 			message.channel.send(strings["enregistrementRT"])
		// 		}
		//
		// 	}else if(spl[0][0]=="!combat"){
		// 		var tmp = null
		// 		var compte = 0
		// 		for (const [key, value] of message.mentions.members) {
		// 			tmp = key
		// 			compte++
		// 		}
		// 		if (spl[0][1] === undefined || (spl[0][1] != "for" && spl[0][1] != "agl" && spl[0][1]  != "mtl")){
		// 			message.channel.send(strings["commandeInvalide"]["general"]+strings["commandeInvalide"]["combat"])
		// 		} else if (compte != 1 ){
		// 			message.channel.send(strings["error"]["mentionInvalide"])
		// 		} else if (terrain[message.channel.id] ===undefined){
		// 			message.channel.send(strings["error"]["cbtimpossibeTerrain"])
		// 		}else if (perso[message.author.id]["pv"]<=2) {
		// 			message.channel.send(strings["etatfaible"])
		// 		}else if (combat[message.author.id+message.channel.id] !== undefined) {
		//
		// 			let atck = combat[message.author.id+message.channel.id][0];
		// 			let deff = message.author.id;
		//
		// 			if (tmp == atck) {
		// 				let caracD = resolveCarac(spl[0][1])
		// 				let caracA = resolveCarac(combat[message.author.id+message.channel.id][1])
		//
		// 				let damageDeff = perso[deff][caracD] + terrain[message.channel.id][caracD] + quatreDees()
		// 				let damageAtck = perso[atck][caracA] + terrain[message.channel.id][caracA] + quatreDees()
		//
		// 				if (damageAtck>damageDeff){
		// 					perso[deff]["pv"]-=2
		// 					perso[atck]["pv"]--
		// 					message.channel.send(strings["gagnant"].replace("${0}",perso[atck]['Nom']).replace("${1}",perso[deff]['Nom']))
		// 				}else {
		// 					perso[deff]["pv"]--
		// 					perso[atck]["pv"]-=2
		// 					message.channel.send(strings["gagnant"].replace("${0}",perso[deff]['Nom']).replace("${1}",perso[atck]['Nom']))
		// 				}
		// 				sauvgarde(perso,"perso")
		//
		// 				delete combat[message.author.id+message.channel.id];
		// 			}
		//
		// 		}else{
		// 			combat[tmp+message.channel.id] = [message.author.id,spl[0][1]]
		// 			message.channel.send(strings["cbt"])
		// 		}
		//
		// 	}else if (spl[0][0]=="!help"){
		// 		var retour = ""
		// 		var selection
		// 		if (spl[0][1] === undefined){
		// 			selection = "general"
		// 		}else{
		// 			selection = spl[0][1]
		// 		}
		// 		for (var x in strings["help"][selection]) {
		// 			retour += strings["help"][selection][x] + "\n"
		// 		}
		// 		if (retour=="") {
		// 			retour = strings["error"]["pasDeCommande"].replace("${0}",selection)
		// 		}
		// 		message.channel.send(retour);
		// 	}else if(spl[0][0]=="!personnage" && message.channel.type == "text"){
		// 		var tmp = null
		// 		var compte = 0
		// 		for (const [key, value] of message.mentions.members) {
		// 			tmp = key
		// 			compte++
		// 		}
		// 		if (compte==1) {
		// 			if (message.author.id==tmp || estModo(message.author.id)){
		// 				message.author.send(afficherFiche(tmp))
		// 			}else{
		// 				message.author.send(afficherFichePublic(tmp))
		// 			}
		// 		}else if (compte>0) {
		// 			message.channel.send(strings["error"]["mentionInvalide"])
		// 		}else if(spl[1]=== undefined){
		// 			if (perso[message.author.id]!==undefined){
		// 				message.author.send(afficherFicheInscriptible(message.author.id))
		// 			}
		// 			message.channel.send(fiche)
		// 		}else {
		// 			let tmp = makeFiche(message,false,message.author.id)
		// 			if(tmp[0]){
		// 				message.channel.send(strings["enregistrementROC"])
		// 				ficheValidation.send(message.author.id + "\n"+ afficherFiche(message.author.id))
		// 			}else {
		// 				message.channel.send(tmp[1])
		// 			}
		// 		}
		// 	}
		//
		// 	if (message.channel.type == "dm"){
		// 		console.log(message.author.username+": "+message.content);
		// 	}
		// }
	}
});




function resolveCarac(string){
	switch (string) {
		case "for": return "Force"; break;
		case "agl": return "Agilite"; break;
		case "mtl": return "Mental"; break;
		default:

	}
}

function afficherTerrain(id){
	let retour = terrain[id]["Description"]+"\n"
	retour += "Bonus:"+"\n"
	retour += "   Force: "+ terrain[id]["Force"]+"\n"
	retour += "   Agilitée: "+ terrain[id]["Agilite"]+"\n"
	retour += "   Mental: "+ terrain[id]["Mental"]+"\n"

	return retour;
}

function estModo(id) {
	let retour = false
	for (var x in modo) {
		if (modo[x]==id) {
			retour = true
		}
	}
	return retour
}

function afficherFiche(id){
	let retour = ""
	for (var i in perso[id]) {
		retour+= i + ": "+ perso[id][i] + "\n"
	}
	return retour
}

function afficherFicheInscriptible(id){
	let retour = "Vous avez déjà un personnage, voici une fiche modifiable:\n```!personnage\n"
	let limite = 11
	for (var i in perso[id]) {
		if (limite>0){
			retour+="<"+i+">"+ perso[id][i] + "\n"
			limite--
		}
	}
	retour+="```"
	return retour
}

function afficherFichePublic(id){
	let retour = ""
	let limite = 8
	for (var i in perso[id]) {
		if (limite>0){
			retour+= i + ": "+ perso[id][i] + "\n"
			limite--
		}
	}
	return retour
}

function makeFiche(message,validee,id){
	let spl = message.content.split("<")
	spl.shift();

	if(spl.length != 11){
		return [false,strings["error"]["ficheInvalide"]]
	}
	let final = {}
	let tmp = []
	let verif = ["Nom","Age","Sexe","Espece","Orientation","Description Physique","Description Mental","Autre","Force","Agilite","Mental"]
	for (var i in spl) {
		tmp = spl[i].split(">")
		tmp[1] = tmp[1].trim()
		if(tmp[1].trim()==""){
			return [false,strings["error"]["chaineVide"]]
		}


		if(tmp[0]=="Force"||tmp[0]=="Agilite"||tmp[0]=="Mental"||tmp[0]=="Age"){

			if(isNaN(tmp[1].replace("\n",""))){
				return [false,tmp[0]+" "+strings["error"]["doitEtreNbr"]]
			}else {
				final[verif[i]] = Number(tmp[1].replace("\n",""))
			}
		}else{
			final[verif[i]] = tmp[1].replace("\n","")
		}
	}

	if (final["Force"]+final["Agilite"]+final["Mental"] != limitePoints){
		return [false,strings["error"]["totalTrophautBas"]]
	}
	final["validation"]=false
	final["pv"]=5
	perso[id] = final
	sauvgarde(perso,"perso")
	message.member.roles.remove(roles["RP"])
	return [true]

}

function quatreDees(){
	let result = 0
	for (var i = 0; i < 4; i++) {
		result += undee()
	}
	return result;
}

function undee(){
	return Math.floor(Math.random() *3) -1;
}

function download(url,nom){
		console.log(url);
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream("db/OC/"+nom));
}

function sauvgarde(sauv,nom){
	var tmp = JSON.stringify(sauv,null,5)
	fs.writeFile("db/"+nom+".json",tmp, function(erreur) {
		if (erreur) {
			console.log(erreur)
		}
	})
}

function resetJournalier(){
	combat = {}
	for (var x in perso) {
		perso[x]["pv"]++
		if(	perso[x]["pv"]>5){
			perso[x]["pv"] = 5
		}
	}
	sauvgarde(perso,"perso")
}

function leftToEight(){
    var d = new Date();
    return (-d + d.setHours(1,0,0,0));
}


client.login(token[0]);
