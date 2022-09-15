let x = 0;
let y = 0;
let nb_mine = 0;

let terrain 	= new Array();
let affTerrain 	= new Array();

let continuerJeu = false;

/**
 *	==========================
 *	======= CONSTANTES =======
 *	==========================
 */
let DEFAUT 			= "N";
let CLICK_GAUCHE 	= "G";
let CLICK_DROIT 	= "D";

let MINE 	= "&loz;";
let VIDE 	= "&nbsp;";
let DRAPEAU = "&times;";

let COULEUR_MINE 	= "#ff7f7f";
let COULEUR_VIDE 	= "#bcc4c4";
let COULEUR_DRAPEAU = "#87c4c2";
let COULEUR_CHIFFRE = "#beffc0";

/**
 *	=============================
 *	========= FONCTIONS =========
 *	=============================
 */
/**
 *	Permet d'initialiser le terrain de jeu
 */
let changerTerrain = function(){
	let x 		= document.getElementById("x").value;
	y 		= document.getElementById("y").value;
	nb_mine	= document.getElementById("nb_mine").value;
	
	for(let i = 0; i < x; i++){
		terrain[i] 		= new Array();
		affTerrain[i]	= new Array();
	}
	
	let dessin = true;
	
	if(parseInt(x) == NaN || x <= 0 || x > 11 || parseInt(y) == NaN || y <= 0 || y > 11 || parseInt(nb_mine) == NaN || nb_mine <= 0){
		alert("Entrez des infos correctes, svp");
		dessin = false;
	}
	
	if(nb_mine > parseInt(x) * parseInt(y)){
		alert("Tu peux pas avoir plus de mines que la taille max du plateau");
		dessin = false;
	}
	
	// Si tout est ok...
	if(dessin){
		// ... on dessine le terrain
		dessinTerrain();
		continuerJeu = true;
	}
};

/**
 *	Permet de gérer le click sur un bouton
 *	@param	elt	L'élément
 */
let clicBouton = function(elt){
	if(continuerJeu){
		let ex = elt.dataset.x;
		let ey = elt.dataset.y;
		
		clicBoutonAux(ex, ey);
	}
	
	// On teste si le joueur a gagné
	testGagne();
};

/**
 *	Permet d'afficher les cases voisines si la case courante n'a aucune bombe à côté d'elle
 *	@param	cx	Coordonnée en x
 *	@param	cy	Coordonnée en y
 */
let clicBoutonAux = function(cx, cy){
	cx = parseInt(cx);
	cy = parseInt(cy);
	
	// Si on ne sort pas du plateau et que la case n'est pas déjà affichée...
	if( cx >= 0 && cy >= 0 && cx < x && cy < y && affTerrain[cx][cy] == DEFAUT){
		// ... on dit qu'on a affiché la case...
		affTerrain[cx][cy] = CLICK_GAUCHE;
		
		// ... on affiche ce qu'il y a dans la case courante...
		document.getElementById(cx + "" + cy).innerHTML = terrain[cx][cy];
		document.getElementById(cx + "" + cy).style.backgroundColor = COULEUR_CHIFFRE;
		console.log(cx + "" + cy);
		
		// ... et si la case courante n'a aucune bombe autour d'elle...
		if(terrain[cx][cy] == 0){
			// ... on regarde celle d'au-dessus...
			clicBoutonAux(cx-1, cy);
			
			// ... puis celle d'en-dessous...
			clicBoutonAux(cx+1, cy);
			
			// ... puis celle d'à gauche...
			clicBoutonAux(cx, cy-1);
			
			// ... puis celle d'à droite...
			clicBoutonAux(cx, cy+1);
			
			// ... puis celle d'en haut à gauche...
			clicBoutonAux(cx-1, cy-1);
			
			// ... puis celle d'en haut à droite...
			clicBoutonAux(cx-1, cy+1);
			
			// ... puis celle d'en bas à gauche...
			clicBoutonAux(cx+1, cy-1);
			
			// ... puis celle d'en bas à droite...
			clicBoutonAux(cx+1, cy+1);
		} 
		// ... et si la case est une bombe
		else if(terrain[cx][cy] == MINE){
			document.getElementById(cx + "" + cy).style.backgroundColor = COULEUR_MINE;
			alert("BOOM ! Lance un nouveau jeu !");
			continuerJeu = false;
		}
	}
};

/**
 *	Permet de gérer le click droit sur le bouton
 *	@param	cx	La coordonnée en x du bouton
 *	@param	cy	La coordonnée en y du bouton
 */
let clicDroitBouton = function(cx, cy){
	// Si on peut continuer le jeu et que la case n'a pas déjà été cochée...
	if(continuerJeu && affTerrain[cx][cy] != "0"){
		let elt = document.getElementById(cx + "" + cy);
		
		// ... et qu'il y a déjà eu un clic droit...
		if(affTerrain[cx][cy] == CLICK_DROIT){
			// ... on remet les valeurs par défaut du bouton
			document.getElementById(cx + "" + cy).style.backgroundColor = COULEUR_VIDE;
			affTerrain[cx][cy] = DEFAUT;
			elt.innerHTML = VIDE;
		}
		// ... sinon si c'est remis à la valeur par défaut...
		else if(affTerrain[cx][cy] == DEFAUT){
			// ... on met que la case a été clickée par le bouton droit
			document.getElementById(cx + "" + cy).style.backgroundColor = COULEUR_DRAPEAU;
			affTerrain[cx][cy] = CLICK_DROIT;
			elt.innerHTML = DRAPEAU;
		}
	}
	
	// On teste si le joueur a gagné
	testGagne();
};

/**
 *	Permet de dessiner le terrain de jeu
 */
let dessinTerrain = function(){
	// On met à jour le plateau
	let plateau = document.getElementById("plateau");
	plateau.innerHTML = "";
	
	// On parcourt les lignes...
	for(let i = 0; i < x; i++){
		// ... et les colonnes...
		for(let j = 0; j < y; j++){
			// ... puis on affiche le bouton
			plateau.innerHTML += "\
									<button 	style='height:40px;width:40px;' \
												onClick='clicBouton(this)' \
												id='" + i + "" + j + "' \
												data-x='" + i + "' \
												data-y='" + j + "' \
												onContextMenu='clicDroitBouton(" + i + ", " + j + ")'>\
										" + VIDE + "\</button>";
			
			document.getElementById(i + "" + j).style.backgroundColor = COULEUR_VIDE;
		}
		plateau.innerHTML += "<br/>";
	}
	
	// On génère la position des mines
	genererMines();
};

/**
 *	Permet de générer les autres cases
 */
genererAutresCases = function(){
	for(let i = 0; i < x; i++){
		for(let j = 0; j < y; j++){
			terrain[i][j] = terrain[i][j] == undefined ? minesAutour(i, j) : terrain[i][j];
			affTerrain[i][j] = DEFAUT;
		}
	}
};

/**
 *	Permet la génération des mines
 */
genererMines = function(){
	let continuer = false;
	
	for(let i = 0; i < nb_mine; i++){
		
		while(!continuer){
			let tx = parseInt(Math.random() * (x));
			let ty = parseInt(Math.random() * (y));
			
			if(terrain[tx][ty] == undefined){
				terrain[tx][ty] = MINE;
				
				continuer = true;
			}
		}
		
		continuer = false;
	}
	
	// On génère les autres cases
	genererAutresCases();
};

/**
 *	Permet d'avoir le nombre de mines autour de la case voulue
 *	@param		cx	Coordonnée x
 *	@param		cy	Coordonnée y
 *	@returns 	Le nombre de mines autour
 */
minesAutour = function(cx, cy){
	let res = 0;
	
	// On regarde en haut
	res += cx == 0 		? 0 : terrain[cx-1][cy] == MINE ? 1 : 0;
	
	// On regarde en bas
	res += cx == x-1 	? 0 : terrain[cx+1][cy] == MINE ? 1 : 0;
	
	// On regarde à gauche
	res += cy == 0 		? 0 : terrain[cx][cy-1] == MINE ? 1 : 0;
	
	// On regarde à gauche
	res += cy == y-1 	? 0 : terrain[cx][cy+1] == MINE ? 1 : 0;
	
	// On regarde en haut à gauche
	res += cx == 0 	 	|| cy == 0 		? 0 : terrain[cx-1][cy-1] == MINE ? 1 : 0;
	
	// On regarde en haut à droite
	res += cx == 0 		|| cy == y-1 	? 0 : terrain[cx-1][cy+1] == MINE ? 1 : 0;
	 
	// On regarde en bas à gauche
	res += cx == x-1 	|| cy == 0 		? 0 : terrain[cx+1][cy-1] == MINE ? 1 : 0;
	
	// On regarde en haut à droite
	res += cx == x-1 	|| cy == y-1 	? 0 : terrain[cx+1][cy+1] == MINE ? 1 : 0;
	
	return res;
};

/**
 *	Permet de tester si le joueur a gagné
 *	@returns	TRUE	Si oui
 *				FALSE	Sinon
 */
let testGagne = function(){
	for(let i = 0; i < x; i++){
		for(let j = 0; j < y; j++){
			if(affTerrain[i][j] == DEFAUT || (affTerrain[i][j] == CLICK_DROIT && terrain[i][j] != MINE) || (affTerrain[i][j] == CLICK_GAUCHE && terrain[i][j] == MINE)){
				return false;
			}
		}
	}
	
	alert("Bon bah j'crois que t'es bon avec cette difficulté. Tente une plus difficile!");
	continuerJeu = false;
}

/**
 *	=================================
 *	===== Chargement du terrain =====
 *	=================================
 */
changerTerrain();

// Désactivation du clic droit sur la page
document.addEventListener('contextmenu', event => event.preventDefault());