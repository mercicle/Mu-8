
# Name of Mongo File
aaIndexMongoFile <- "AAPrinCompsIndicesForMongo.json"
fileLocation <- "/Users/mercer/p4/data/PrinComps/"
 
#alpha
nameOfFile <-  paste(fileLocation,"alpha_prin_comps.csv",sep="")
savedAlpha <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")

# beta
nameOfFile <-  paste(fileLocation,"beta_prin_comps.csv",sep="")
savedBeta <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")
 
# composition
nameOfFile <-  paste(fileLocation,"composition_prin_comps.csv",sep="")
savedComposition <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")

# hydro
nameOfFile <-  paste(fileLocation,"hydro_prin_comps.csv",sep="")
savedHydro <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")

#other
nameOfFile <-  paste(fileLocation,"other_prin_comps.csv",sep="")
savedOther <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")
  
#physico

nameOfFile <-  paste(fileLocation,"physico_prin_comps.csv",sep="")
savedPhysico <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE,sep=",")


fileLocation <- "/Users/mercer/p4/data/"
setwd(fileLocation)
sink(aaIndexMongoFile)

writePC <- function(indices, accession, desc,category){
    
    indexElements <- "["
    for(ie in 1:length(indices)){
      if(ie==20){
        indexElements <- paste(indexElements, indices[ie],"]",sep="")
      }else{
        indexElements <- paste(indexElements,  indices[ie],",",sep="")
      }
      
    }
    
    thisIndex <- paste(    '{ "accession": ', paste('"',accession,'"',sep=""),
                           ',"description": ', paste('"',desc,'"',sep=""),
                           ',"category": ',paste('"',category,'"',sep=""),
                           ',"indices": ',indexElements,
                           '}', sep="" )
    
    cat(thisIndex)
    cat('\n')
}

indices <- unlist(savedAlpha$PC1)
writePC(indices,"AlphaHelixPC1","1st Principal Component of Alpha Helix Propensity","Alpha & Turn Propensity" )
indices <- unlist(savedBeta$PC1)
writePC(indices,"BetaSheetPC1","1st Principal Component of Beta Sheet Propensity","Beta Sheet Propensity" )
indices <- unlist(savedComposition$PC1)
writePC(indices,"CompositionPC1","1st Principal Component of Composition","Composition" )
indices <- unlist(savedHydro$PC1)
writePC(indices,"HydrophobicityPC1","1st Principal Component of Hydrophobicity","Hydrophobicity" )
indices <- unlist(savedOther$PC1)
writePC(indices,"OtherPropertiesPC1","1st Principal Component of Other Properties","Other Properties" )
indices <- unlist(savedPhysico$PC1)
writePC(indices,"PhysicoChemicalPC1","1st Principal Component of Physico-Chemical Properties","Physico-Chemical Properties" )

sink()

#./mongoimport -d mu8 -c AAIndices --file /Users/mercer/p4/data/AAIndicesForMongo.json

 
