
nameOfFile <- "averagedAA2YPI.txt"
fileLocation <- "/Users/mercer/p4/data/pdb/"

con <- file(paste(fileLocation,nameOfFile,sep=""), 'r')
pdbData <- readLines(con)
close(con)

setwd("/Users/mercer/p4/uploads/")

pdbData<-read.delim(paste(fileLocation,nameOfFile,sep=""),stringsAsFactors=FALSE, header = FALSE,sep=" ")

pdbData <- pdbData[, colnames(pdbData) %in% c("V7","V8","V9")]

colnames(pdbData) <- c("x","y","z")

write.csv(pdbData,"pdbSampleUpload.csv",row.names = FALSE)
 