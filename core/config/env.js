var env = {
    "magz" : {
        "width"         : "760px",
        "height"        : "510px",
        "defaultColor"  : "#A5D6A7"
    },
    "magzScale" : {
        "current"   : 100,
        "default"   : 100,
        "min"       : 50,
        "max"       : 200
    },
    "element" : {
        "magz"              : "#magz", //id magz
        "magzContainer"     : "#magz-container", //id container magz
        "thumbContainer"    : ".thumb-container", //class container thumbnail
        "thumb"             : "#thumbContents", //id thumb contents
        "blank"             : "#blank", //id blank
        "help"              : "#help", //id  help
        "notif"             : "#notif", //id notif
        "coloring"          : "#coloring-bg", //id for change color of nav
        "particle"          : "#particle-bg", //id for change color of nav
        "compContainer"     : ".component-icon", //class container icon
        "blank"             : ".blank", //class of blank
        "help"              : ".help-cont", //class of help container
        "searchInput"       : "#search-input" //id search input
    },
    "status" : {
        "thumbContainer"    : false,
        "dragMode"          : false,
        "notif"             : false,
        "helpCont"          : false,
        "loaded"            : false
    }
};

//components
var classAnim = [
    ".logo",
    ".anim"
];
var color = [];
var tmp;
