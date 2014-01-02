
require(hash)


# Name of Mongo File
aaIndexMongoFile <- "AAIndicesForMongo.json"

############################################################
##########       Read in Raw Index Data      ###############
############################################################

nameOfIndexFile <- "index_data_544.txt"
fileLocation <- "/Users/mercer/p4/data/"

con <- file(paste(fileLocation,nameOfIndexFile,sep=""), 'r')
indexData <- readLines(con)
close(con)


############################################################
#####     Now Read in Previous Assigned Classes  ###########
############################################################
 
#alpha
nameOfFile <-  paste(fileLocation,"alpha_and_turn_propensities_from402.csv",sep="")
savedAlpha <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)

# beta
nameOfFile <-  paste(fileLocation,"beta_propensities_from402.csv",sep="")
savedBeta <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)
 
# composition
nameOfFile <-  paste(fileLocation,"composition_from402.csv",sep="")
savedComposition <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)

# hydro
nameOfFile <-  paste(fileLocation,"hydrophobicity_from402.csv",sep="")
savedHydro <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)

#other

nameOfFile <-  paste(fileLocation,"other_properties_from402.csv",sep="")
savedOther <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)

#physico
nameOfFile <-  paste(fileLocation,"physicochemical_from402.csv",sep="")
savedPhysico <- read.delim(nameOfFile,stringsAsFactors=FALSE, header = TRUE)

#new 142
nameOfFile <-  paste(fileLocation,"new_indices_142_in_csv_format.csv",sep="")
savedNew <- read.delim(nameOfFile,stringsAsFactors=FALSE, sep=",",header = TRUE)


trim <- function (x) gsub("^\\s+|\\s+$", "", x)

renameClass <- function(class){
  
  if(class == "alpha and turn"){
    return ("Alpha & Turn Propensity")
  }
  if(class == "composition"){
    return ("Composition")
  }
  if(class == "other"){
    return ("Other")
  }
  if(class == "beta"){
    return ("Beta Sheet Propensity")
  }
  if(class=="Hydrophobicity"){
    return (class)
  }
  
}

getClass <- function(accession){
 
  if(accession %in% unlist(savedAlpha)){
    return ("Alpha & Turn Propensity")
  }
  
  if(accession %in% unlist(savedPhysico)){
    return ("Physico-Chemical Properties")
  }
  
  if(accession %in% unlist(savedBeta)){
    return ("Beta Sheet Propensity")
  }
  
  if(accession %in% unlist(savedComposition)){
    return ("Composition")
  }
  
  if(accession %in% unlist(savedHydro)){
    return ("Hydrophobicity")
  }
 
  if(accession %in% unlist(savedOther)){
    return ("Other")
  }
  
  if(accession %in% unlist(savedNew$ID)){
    getRow <- savedNew[which(savedNew$ID==accession),]
    return (renameClass(getRow$index_category))
  }
  
  return ("Other")
}

#H ANDN920101
#D alpha-CH chemical shifts (Andersen et al., 1992)
#R LIT:1810048b PMID:1575719
#A Andersen, N.H., Cao, B. and Chen, C.
#T Peptide/protein structure analysis using the chemical shift index method: 
#  upfield alpha-CH values reveal dynamic helices and aL sites
#J Biochem. and Biophys. Res. Comm. 184, 1008-1014 (1992)
#C BUNA790102    0.949
#I    A/L     R/K     N/M     D/F     C/P     Q/S     E/T     G/W     H/Y     I/V
#4.35    4.38    4.75    4.76    4.65    4.37    4.29    3.97    4.63    3.95
#4.17    4.36    4.52    4.66    4.44    4.50    4.35    4.70    4.60    3.95
#//
#"AVBF000102" is an example of NAs

AAIndex <<- setClass("AAIndex",representation(accession = "character", 
                                              description = "character",
                                              category = "character",
                                              indices = "numeric"))
 
indexHash <- hash()
for(index in 1:(length(indexData)-12)){
  
  #print(paste("index: ",index,sep=""))
  element <- indexData[index]
  if (substr(element,1,1) == 'H'){

    accession <- gsub("(^ +)|( +$)", "",substr(element,2,nchar(element)))
    
    lookAheadIndex <- 1
    while(indexData[index+lookAheadIndex] != "//"){
      
      #print(paste("lookAheadIndex: ",lookAheadIndex,sep=""))
      if(substr(indexData[index+lookAheadIndex],1,1) == "D"){
        description <- trim(substr(indexData[index+lookAheadIndex],2,nchar(indexData[index+lookAheadIndex])))
        description <- gsub("\"","",description) #correct the escaped quotations
      }

      if(substr(indexData[index+lookAheadIndex],1,1) == "I"){
        
          firstRow <- indexData[index+lookAheadIndex+1]
          secondRow <- indexData[index+lookAheadIndex+2]
          
          #trim trailing and leading spaces first
          firstRow <- trim(firstRow)
          secondRow <- trim(secondRow)
          
          #compress white space
          firstRow <- gsub("\\s+"," ",firstRow)
          secondRow <- gsub("\\s+"," ",secondRow)
          
          #remove NAs
          firstRow <- gsub("NA","0.0",firstRow)
          secondRow <- gsub("NA","0.0",secondRow)
          
          splitFirstRow <- unlist(strsplit(firstRow," "))
          splitSecondRow <- unlist(strsplit(secondRow," "))
          
          indices <- append(as.numeric(splitFirstRow), as.numeric(splitSecondRow))
          category <- getClass(accession)
          
          aai <- AAIndex(accession = accession, 
                        description = description,
                        indices = indices,
                        category = category)
          
          .set(indexHash,accession, aai)
          break
      }

      lookAheadIndex <- lookAheadIndex + 1
    }
  }
}

setwd(fileLocation)
sink(aaIndexMongoFile)

accessions <- keys(indexHash)
 
#indexHash[["AURR980118"]]
for (accession in accessions){
  
    thisObj <- indexHash[[accession]]
    
    indexElements <- "["
    for(ie in 1:length(thisObj@indices)){
      if(ie==20){
        indexElements <- paste(indexElements, thisObj@indices[ie],"]",sep="")
      }else{
        indexElements <- paste(indexElements, thisObj@indices[ie],",",sep="")
      }
      
    }
 
    thisIndex <- paste(    '{ "accession": ', paste('"',thisObj@accession,'"',sep=""),
                            ',"description": ', paste('"',thisObj@description,'"',sep=""),
                            ',"category": ',paste('"',thisObj@category,'"',sep=""),
                            ',"indices": ',indexElements,
                            '}', sep="" )
    
    cat(thisIndex)
    cat('\n')
}

sink()

#./mongoimport -d mu8 -c AAInidices --file /Users/mercer/p4/data/AAIndicesForMongo.json

 
