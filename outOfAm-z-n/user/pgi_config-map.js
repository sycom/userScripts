/* Config file for pGi - posting Gitlab issues */

/* W A R N I N G ! ! !
This is a pretty INSECURE way to make issues sent to your gitlab project. Using your own personal token with full privilege here CAN NOT BE SECURE. It can be grabbed by any (even very bad) hacker and give him access to your whole projects on gitlab. So you SHOULD create a secondary account with only GUEST PRIVILEGE and grab corresponding token here. This way the hacker will "only" spam your issue box until you reset token.
*/

var pGi={
/* G I T L A B repo informations */
   gitlab:"framagit.org",                        // gitlab repo url
   usgroup:"sycom",                            // gitlab username or group name where the project is
   project:"userScripts",               // project id in gitlab - should not contain any dot (. nor "%2E")
   token:"84AixuCbHNbTx36_gmUw",               // token !WARNING! this_is_your_SECONDARY_gitlab_token_with_ONLY_GUEST_PRIVILEGE
/* F I E L D S list*/
   form:[
       {name:"nom",type:"text",dest:"title",def:"nom de la boutique",req:true,hid:false},
       {name:"urlBout",type:"url",dest:"description",def:"http://site.internet",req:false,hid:false},
       {name:"urlRech",type:"url",dest:"description",def:"http://site.internet.boutique.pour.chercher.les.livres?",req:false,hid:false},
       {name:"ville pays",type:"text",dest:"title",def:"ville",req:true,hid:false},
       {name:"addresse",type:"text",dest:"description",def:"adresse",req:false,hid:false},
       {name:"phone",type:"text",dest:"description",def:"téléphone",req:false,hid:false},
       {name:"mail",type:"email",dest:"description",def:"addresse email",req:false,hid:false},
       {name:"coord",type:"text",dest:"description",def:"coordonnées GPS",req:false,hid:false},
       {name:"sujet",type:"text",dest:"labels",def:"OoA,bookstore",req:false,hid:true},
       {name:"comment",type:"textarea",dest:"description",def:"ajoutez tout commentaire qui vous paraitra utile. Attention, tout est publiquement accessible.",req:false,hid:false}
   ],
   intro:"Pour proposer une nouvelle boutique ou demander des corrections sur une boutique existante, merci de remplir le formulaire...",
   thanks:"Merci pour cette proposition. Restez connecté...",
   autoclose:30000
}
/* H E L P
// about integration
by default, PGI form is hidden. It will be shown when clicking on any element with the `.pgiButton` class

// about fields
name : text - the name of the field
type : text - one of the accepted html type of fields -
destination : text - one of the accepted gitlab issue post method - http://doc.gitlab.com/ce/api/issues.html#new-issue
default : text - default value for the field
required : boolean - is the field required?
hidden : boolean - do you want to hide this field?

// about styles
the script will create a new div called "pgiDiv" with "pgiDiv" class at the end of your document containing the comment form
you can customize style by creating a stylesheet declaring styles for #pgiDiv or .pgiDiv elements*/
