(() => {
	"use strict";

	$(document).ready(($) =>{
    /*let converter =  JSON.parse(Converter);*/
    //console.log("convertisseur PT BDD projet",ConverterProjet);
    //console.log("convertisseur PT BDD stories",ConverterStories);
    //console.log("convertisseur PT BDD tasks",ConverterTasks);
		  $('#devis').click(() => {
  		 	$('#processRecup').slideDown();
  		 	let myRecuperator = new epicRecuperator();
  		 	$('#div_selecteur').append('<select id="selector"></select>');
  		 	let listID;
        let projectsIds = myRecuperator.getAllProjectsId();
  		 	
  		 	$('#selector').on('change',() => {
       			let devis = new DevisRequester($('#selector').val());
       			let result = devis.getProjectFromEpic(myRecuperator.getMemberIdProjets());
  		 	});
		  });
      //let temp = new transmuter();
      //temp.encapsulateObjects();
	});	
})();
