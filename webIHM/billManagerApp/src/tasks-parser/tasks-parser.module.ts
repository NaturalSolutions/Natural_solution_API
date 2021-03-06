import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogMessageComponent } from '../log-message/log-message.component'

@NgModule({
	imports: [
		CommonModule
	],
	declarations: []
})
export class TasksParserModule {

	constructor(private log: LogMessageComponent) {

	}

	setError(url, tasksId) {
		//console.log('errors', arguments)
		//$('#errorLink').append('<a href="' + url + '">' + tasksId + '</a><br>')
	}


	fillUserTab(tab, initiales, value) {
		if (!tab.find(x => x.initials == initiales)) {
			tab.push({ initials: initiales, value: parseInt(value) });
		} else {
			var index = tab.findIndex(x => x.initials == initiales);
			tab[index].value += parseInt(value);
		}
		return tab;
	}

	getInfoFromTasks(tasks, storyId, projectId, isFactu): any {
		var tasksModified = []; 							//initialisation tableaux vide
		var cpt = 0;
		for (let i in tasks) {
			var tabDescrInfo = tasks[i].description.split('.-');
			if (tabDescrInfo.length <= 1) {
				tabDescrInfo = tasks[i].description.split('. -');
				if (tabDescrInfo.length <= 1) {
	//				this.log.setlogMessage("cette tâche n'est pas correctement formaté '" + tasks[i].description + '  ' +tasks[i].story_id + "'");
				}
			} else {

				var isWE = false;
				var isFerie = false;
				var realizedState = null;
				if (isFactu) {
					var regexWE = /(\@[wW])$/;
					if (tabDescrInfo[1].trim().match(regexWE)) {
						isWE = true;
						realizedState = 'we';
						tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regexWE, "");
					} else {
						var regexF = /(\@[fF])$/;
						if (tabDescrInfo[1].trim().match(regexF)) {
							isFerie = true;
							realizedState = 'f';
							tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regexF, "");
						}
					}
				}
				if (tabDescrInfo.length > 1) {
					var regex = /\+/; //cherche "+" dans le text , Si n programming
					if (tabDescrInfo[1].trim().match(regex)) {
						regex = /[A-Z]{2,}(\+[A-Z]{2,})+$/
						if (tabDescrInfo[1].trim().match(regex)) {
							var ownerBrut = regex.exec(tabDescrInfo[1].trim());
							var owners = ownerBrut[0].split("+");
							tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
							regex = /\(?\d+(\+\d+)+\)?/; //Cherche les durees dans le text
							if (tabDescrInfo[1].trim().match(regex)) {
								var duree: any = 0;
								var tabDureeBrut;
								tabDureeBrut = regex.exec(tabDescrInfo[1].trim());
								tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
								var tabDuree = tabDureeBrut[0].split('+');
								if (tabDuree.length != owners.length) {
									this.log.setlogMessage('Probleme d\'estimation et initiales dans la tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id)
									this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id, tasks[i].id);
								} else {
									tasks[i].initials = "";
									tasks[i].duree = "";
									tasks[i].isWE = isWE;
									tasks[i].isFerie = isFerie;
									let somme = "";
									for (let l in tabDuree) {
										somme += tabDuree[l] + '+';
									}
									var regexParenth = /(\(|\))/gmi;
									somme = somme.replace(regexParenth, "");
									tasks[i].duree = somme.substr(0, somme.length - 1);
									for (let ow in owners) {
										tasks[i].initials += owners[ow] + '+';
									}
									tasks[i].initials = tasks[i].initials.substr(0, tasks[i].initials.length - 1);
									if (realizedState == undefined || realizedState == null) {
										tasks[i].isBonnus = false;
									} else {
										tasks[i].isBonnus = realizedState;
									}
									tasksModified.push(tasks[i]);
									cpt++;
								}
							} else {
								tasks[i].duree = null;
								this.log.setlogMessage('Probleme d\'estimation dans la tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id)
							}
						} else {
							this.log.setlogMessage('Probleme d\'initales dans la tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id)
							this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id, tasks[i].id);
						}
					}


					//Tache solo
					else {
						//CHerche l'owner de la tache
						regex = /[A-Z]{2,}$/;
						var owner_initial;
						if (tabDescrInfo[1].trim().match(regex)) {
							var taskMemeber = regex.exec(tabDescrInfo[1].trim())[0];
							owner_initial = taskMemeber;
							tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
							//La duree
							regex = /\(?(\d)+\)?$/;
							if (regex.exec(tabDescrInfo[1].trim())) {
								var regexParenth = /\)$/
								var duree: any = 0;
								duree = regex.exec(tabDescrInfo[1].trim())[0];
								tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
								tasks[i].initials = owner_initial;
								var regexParenth = /(\(|\))/gmi;
								tasks[i].isWE = isWE;
								tasks[i].isFerie = isFerie;
								tasks[i].duree = duree.replace(regexParenth, "");;
								if (realizedState == undefined || realizedState == null) {
									tasks[i].isBonnus = false;
								} else {
									tasks[i].isBonnus = realizedState;
								}
								tasksModified.push(tasks[i]);
								cpt++;
							}
							else {
								this.log.setlogMessage('Probleme d\'estimation dans la tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id)
								this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id, tasks[i].id);
							}
						} else {
							this.log.setlogMessage('Probleme d\'initales dans la tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id)
							this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id, tasks[i].id);
						}
					}
				} else {
					this.log.setlogMessage('La tâche : ' + tasks[i].id + ' de la storie n° : ' + tasks[i].story_id + ' n\'est pas attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id);
					this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + tasks[i].story_id + '/tasks/' + tasks[i].id, tasks[i].id);
				}
			}
		}
		return tasksModified;
	}


}
