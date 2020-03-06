const { Client, Attachment } = require('discord.js');
let request = require(`request`);
let fs = require(`fs`);
var jsonFormat = require('./');

const client = new Client();
var dialogue = {}
var perso= {}
var voeux = {}

token = fs.readFileSync("db/token.txt", 'utf8');
token = token.split('\n')

strings = fs.readFileSync("string.json", 'utf8');
strings = JSON.parse(strings)

capa = fs.readFileSync("db/capa.json", 'utf8');
capa = JSON.parse(capa)

perso = fs.readFileSync("db/perso.json", 'utf8');
perso = JSON.parse(perso)

voeux = fs.readFileSync("db/voeux.json", 'utf8');
voeux = JSON.parse(voeux)

// var roles = {
// 	"sansClan":"684745455590178877",
// 	"astral":"684748786056298532"
// }

client.on('ready',function (){
	console.log(strings["pret"]);
	// var guild = client.guilds.resolve('684734450558435370');
	// console.log(guild.members.cache.get('684769182205739028').addRole(guild.roles.resolve('684745455590178877')));
 	// console.log(guild.members.resolve('387998912558137344')))
	// .user.addRole(
	// console.log(guild.roles.resolve('684745455590178877'));
});

client.on('message',function(message){
	if(message.author.id != "684769182205739028"){

		lignes = message.content.split("\n")
		spl = []
		for (var x in lignes) {
			spl.push(lignes[x].split(' '))
		}


		if(spl[0][0]=="!utilise"){
			if (perso[message.author.id] === undefined) {
				message.channel.send(strings["error"]["vousPasDePerso"])
			}else if (spl[0][1] === undefined || isNaN(spl[0][1])) {
				message.channel.send(strings["commandeInvalide"]["general"]+strings["commandeInvalide"]["utilise"])
			}else if(spl[0][2] === undefined){
				message.channel.send(dee(5+Number(spl[0][1])))
			}else{
				var trouver = false
				for (var x in perso[message.author.id]["capacite"]  ) {
					if (perso[message.author.id]["capacite"][x][0]== spl[0][2]) {
						trouver = true
						message.channel.send(dee(5+Number(spl[0][1])+Number(perso[message.author.id]["capacite"][x][1])))
					}
				}
				if (!trouver){
					message.channel.send(strings["error"]["capaNonTrouver"])
				}
			}
		}else if(spl[0][0]=="!personnage" ){
			if (spl[0][1]=="init"){
				if (perso[message.author.id] !== undefined) {
					message.channel.send(strings["error"]["personnageExistant"])
				}else{
					dialogue[message.author.id] = {"etape":0}
					createPersonnage(message);
				}

			}else if (spl[0][1]=="modif"){
				if (spl[0][3] === undefined || spl[0][2] === undefined || (spl[0][2] != "nom" && spl[0][2] != "espece")){
					message.channel.send(strings["commandeInvalide"]["general"]+strings["commandeInvalide"]["persoModif"])
				}else{
					perso[message.author.id][spl[0][2]] = spl[0][3]
					sauvgarde(perso,"perso");
					message.channel.send(strings["persoModifReussi"])
				}
			}else if (message.mentions.members.first() !==undefined){
				if(perso[message.mentions.members.first().id] !==undefined){
					tmp =perso[message.mentions.members.first().id]
					var retour = strings["persoFormat"].replace('${0}',tmp['nom']).replace("${1}",tmp["espece"])
					for (var x in tmp["capacite"]) {
						retour += "		"+tmp["capacite"][x][0]+": "+tmp["capacite"][x][1]+"\n"
					}
					retour += "```"
					message.channel.send(retour)
				}else{
					message.channel.send(strings["error"]["pasDePerso"].replace("${0}",message.mentions.members.first().toString()))
				}
			}

		}else if (spl[0][0]=="!help"){
			var retour = ""
			var selection
			if (spl[0][1] === undefined){
				selection = "general"
			}else{
				selection = spl[0][1]
			}
			for (var x in strings["help"][selection]) {
				retour += strings["help"][selection][x] + "\n"
			}
			message.channel.send(retour);
		}else if(spl[0][0]=="!capacite" ){
			retour = strings["error"]["capaNonTrouver"];
				 if(spl[0][1]=== undefined ){
					 retour = ""
					 for (var x in capa) {
						 retour += capa[x][0] + '\n'
					 }
				 }else{
					 for (var x in capa) {
						 if(capa[x][0] == spl[0][1] ){
							 retour = capa[x][0]+": "+capa[x][1]
						 }
					 }
				 }
			message.channel.send(retour)
		}else if(spl[0][0]=="!voeu"){
			voeux[message.author.id] = message.content.replace("!voeu","")
			sauvgarde(voeux,"voeux")
		}else if (message.channel.type == "dm" && dialogue[message.author.id] !== undefined){
			createPersonnage(message)
		}

		if (message.channel.type == "dm"){
			console.log(message.author.username+": "+message.content);
		}
	}
});

function dee(chance){
	var tmp =  Math.floor(Math.random() * Math.floor(10)) +1;
	console.log(tmp);
	console.log(chance+"\n");
	if (tmp == 10){
		return strings["echecCritique"]
	}
	if (tmp == 1){
		return strings["reussiteCritique"]
	}
	if (tmp < chance ){
		return strings["reussite"]
	}
	return strings["echec"]
}

function download(url,nom){
		console.log(url);
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream("dataBase/OC/"+nom));
}

function sauvgarde(sauv,nom){
	var tmp = JSON.stringify(sauv,null,5)
	fs.writeFile("db/"+nom+".json",tmp, function(erreur) {
		if (erreur) {
			console.log(erreur)
		}
	})
}

function isInCapa(capAct){
	for (var x in capa) {
		if (capa[x][0] == capAct) {
			return true
		}
	}
	return false
}


function createPersonnage(message){
	var etape = dialogue[message.author.id]["etape"]
	var id = message.author.id
	switch (etape) {
		case 0 :
			dialogue[id]["etape"] +=1
			break;
		case 1:
			dialogue[id]["result"] = {"nom":message.content}
			dialogue[id]["pointCpt"] = 5
			dialogue[id]["etape"] +=1
			break;
		case 2:
			dialogue[id]["result"]["espece"] = message.content
			dialogue[id]["result"]["capacite"] = []
			dialogue[id]["etape"] +=1
			break;
		case 3:
			var spl = message.content.split(" ")
			if(Number(spl[1])>dialogue[id]["pointCpt"]){
				message.author.send(strings["error"]["pcptInsufisant"])
			}else if (Number(spl[1])>3){
				message.author.send(strings["error"]["capaTropHaute"])
			}else if (!isInCapa(spl[0])) {
				message.author.send(strings["error"]["capaNonTrouver"])
			}else {
				dialogue[id]["result"]["capacite"].push([spl[0],spl[1]])
				dialogue[id]["pointCpt"] -= Number(spl[1])
				if(dialogue[id]["pointCpt"] == 0){
					perso[id] = dialogue[id]["result"]
					sauvgarde(perso,"perso")
					message.author.send(strings["enregistrementROC"])
					// message.author.
					delete dialogue[id]
				}
			}
			break;
		default:

	}
	if ((etape == 2 || etape == 3 ) && dialogue[id] !== undefined){
		message.author.send(strings["personnage"][2].replace("${0}",dialogue[id]["result"]["capacite"].length+1).replace("${1}",dialogue[message.author.id]["pointCpt"]))
	}else if (dialogue[id] !== undefined){
		message.author.send(strings["personnage"][etape])
	}
	// var imageNom = "none"
	// if (message.attachments.first() !== undefined){
	// 	var type = message.attachments.first().filename;
	//
	// 	if(type == "jpg"){imageNom=message.author.id+".jpg";}
	// 	else if (type == "png"){imageNom=message.author.id+".png";}
	// 	else if (type == "jpeg"){imageNom=message.author.id+".jpeg";}
	// 	console.log(imageNom);
	// 	if(imageNom != "none"){download(message.attachments.first().url,imageNom);}
	// 	else {message.channel.send(strings["error"]["fomatInvalide"])}
	//
	// }
	// result = {
	// 	nom : spl[1][0],
	// 	description : message.content.replace(spl[0][0]+" "+spl[0][1],""),
	// 	image : imageNom
	// }
	//
	// let donnees = JSON.stringify(result)
	// fs.writeFile('dataBase/OC/'+message.author.id+'.json', donnees, function(erreur) {
	// 	if (erreur) {
	// 		console.log(erreur)
	// 	}else{
	// 		message.channel.send(strings["enregistrementROC"])
	// 	}
	// });
}





client.login(token[0]);
