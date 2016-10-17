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
       {name:"objet",type:"text",dest:"title",def:"objet de votre rapport",req:true,hid:false},
       {name:"description",type:"textarea",dest:"description",def:"merci de décrire tout ça le plus précisémment possible. Pour un suivi personnalisé, laissez des informations de contact. Attention, tout est publiquement accessible.",req:false,hid:false}
   ],
   intro:"Pour proposer une amélioration à Out of Am*z*n ou signaler un bug, merci de remplir le formulaire...",
   thanks:"Merci pour pour votre participation. Restez connecté...",
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
