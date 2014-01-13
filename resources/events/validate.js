for(var i in this) {
    if(previous[i] != this[i]) { 
        this.lastModification = (new Date()).getTime();
        console.log("modified event " +this.name + "becuase of " + i);
        break;
    }
}