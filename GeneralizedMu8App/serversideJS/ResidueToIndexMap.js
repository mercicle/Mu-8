
function ScoreSequence(sequence,scores){

	var scoredSequence = [];
    for (var i = 0; i < sequence.length; i++){
        var r = sequence[i];
        scoredSequence.push(ResidueToIndexMap(r, scores));
    }

    return scoredSequence;
}

function ResidueToIndexMap(aa, scores){
  x=0;
  if (aa=="A"){
    x=scores[0];
  }else if (aa=="R"){
    x=scores[1];
  }else if (aa=="N"){
    x=scores[2];
  }else if (aa=="D"){
    x=scores[3];
  }else if (aa=="C"){
    x=scores[4];
  }else if (aa=="Q"){
    x=scores[5];
  }else if (aa=="E"){
    x=scores[6];
  }else if (aa=="G"){
    x=scores[7];
  }else if (aa=="H"){
    x=scores[8];
  }else if (aa=="I"){
    x=scores[9];
  }else if (aa=="L"){
    x=scores[10];
  }else if (aa=="K"){
    x=scores[11];
  }else if (aa=="M"){
    x=scores[12];
  }else if (aa=="F"){
    x=scores[13];
  }else if (aa=="P"){
    x=scores[14];
  }else if (aa=="S"){
    x=scores[15];
  }else if (aa=="T"){
    x=scores[16];
  }else if (aa=="W"){
    x=scores[17];
  }else if (aa=="Y"){
    x=scores[18];
  }else if (aa=="V"){
    x=scores[19];
  } 
  return x;
}

module.exports = {    
    ResidueToIndexMap: ResidueToIndexMap,
    ScoreSequence : ScoreSequence
}
