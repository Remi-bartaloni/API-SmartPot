let erreursCode = [-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,429];

let erreursDesc = ["","Aucune erreur","Mail déjà existant","Pseudo déjà existant","Mail inexistant","Pseudo inexistant","Mail invalide","Pseudo invalide","Mot de passe invalide","Les mails ne correspondent pas","Les pseudos ne correspondent pas","Les mots de passe ne correspondent pas","Erreur d'authentification","Code couleur incorrect","ID pot incorrect","ID plante incorrect","Nom du pot incorrect","Notification incorrecte","Humidité pot incorrecte","Début soleil incorrect","Fin soleil incorrecte","Url image incorrect","Code incorrect","Lien incorrect","Image non mise à jour","Une erreur s'est produite lors de la connexion !","Une erreur s'est produite !","Une erreur s'est produite lors de l'enregistrement !","Cuve inexistante","Humidité sol inexistante","Humidité ambiante inexistante","Température inexistante", "Text incorrecte","Date incorrecte", "compte non confirmé", "conte désactiver", "CGU nouvelle condition", "CGU non accepté", "Trop de requêtes"];

/*
0 Aucune erreur
1 Mail déjà existant
2 Pseudo déjà existant
3 Mail inexistant
4 Pseudo inexistant
5 Mail invalide
6 Pseudo invalide
7 Mot de passe invalide
8 Les mails ne correspondent pas
9 Les pseudos ne correspondent pas
10 Les mots de passe ne correspondent pas
11 Erreur d'authentification
12 Code couleur incorrect
13 ID pot incorrect
14 ID plante incorrect
15 Nom pot incorrect
16 Notification incorrecte
17 Humidité pot incorrecte
18 Debut soleil incorrect
19 Fin soleil incorrecte
20 Url image incorrect
21 Code incorrect
22 Lien incorrect
23 Image non mise à jour
24 Une erreur s'est produite lors de la connexion !
25 Une erreur s'est produite !
26 Une erreur s'est produite lors de l'enregistrement
27 Cuve inexistante
28 Humidité sol inexistante
29 Humidité ambiante inexistante
30 Température inexistante
31 Text incorrecte
32 Date incorrecte
33 compte non confirmé
34 conte désactiver
35 CGU nouvelle condition
36 CGU non accepté

//////////////////////////////////////

429 Trop de requêtes
*/


module.exports = {
    erreurReturn : function(codeErreur)
    {
        if (erreursCode.indexOf(codeErreur))
        {
            return "{\"erreur\":{\"code\":" + codeErreur + ",\"desc\" : \"" + erreursDesc[erreursCode.indexOf(codeErreur)] + "\"}}"
        }
        return 1;
    }
}
