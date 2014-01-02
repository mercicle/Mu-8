######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: a.) takes the TIM data from the clustal output and 
#           processing it to be scored with the principal component scores. It then creates
#          the scored values for all TIMs and the averages for the family to be compared
#          with dTIM and scTIM
#       b.) plots the histrograms of the prin comp scores for both dTIM scTIM
#           and the mean for the family
#       c.) plots all matrix of histograms of (dTIM - family mean) for all characteristics
#       c.) plots a SPLOM (scatter plot matrix) for (dTIM - family mean) across all characteristics
# Resources:
#            http://stat.ethz.ch/R-manual/R-patched/library/stats/html/princomp.html
#            http://cran.r-project.org/web/packages/psych/index.html
#######################################################################################################

# real data want to score: dTIMandscTimAllTims_forR.txt
# subset to do testing: dTIMandscTimAllTims_forR_sub4testing.txt
# establish a connection to the 544 list (can't use read.table because no commas)
con <- file("/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/dTIMandscTimAllTims_forR.txt", 'r') 

#read all lines into data
data <- readLines(con)
close(con)
#prepare two columns 
protein_id <- c()
sequence <- c()
print("done reading...")

#iterate through the lines and make two columns (index, description)
for (line in data){
  protein_id = append(protein_id, gsub("(^ +)|( +$)", "",substr(line,1,18)))
  sequence <- append(sequence, substr(line,18,nchar(line)))
}

print("done parsing...")

unique_protein_ids <- unique(protein_id)

#put into dataframe
protein_list <- data.frame(protein_id=protein_id,sequence=sequence)

#sort the file according to protein_id so I can re-combine the sequences faster
protein_list <- protein_list[order(protein_id),]

###############################
# Combine Sequence Segments   #
###############################
protein_count <- 1
unique_sequences <- c()
for (i in 1:nrow(protein_list)){
  if (i==1){
    unique_sequences[protein_count] <-protein_list[i,2]
  }else{
    if (protein_list[i,1] == protein_list[i-1,1]){
      unique_sequences[protein_count] <- paste(gsub("(^ +)|( +$)", "",unique_sequences[protein_count]),gsub("(^ +)|( +$)", "",protein_list[i,2]), sep = "")
    }else{
      protein_count <- protein_count + 1
      unique_sequences[protein_count] <-protein_list[i,2]
    }
  }
  #let me know how it's going
  if (i %% 1000 == 0){
    print(i)
  }
}

# so now the unique protein id list is unique_protein_ids[]
# and the corrosponding sequences are in unique_sequences[]
unique_protein_ids <- sort(unique_protein_ids)    #I need to sort them so they still match the sequence
aligned_proteins <- data.frame(protein_id=unique_protein_ids,sequence=unique_sequences)

#write.csv(aligned_proteins,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/aligned_TIMs_proper_format.csv") 

print("done fixing...")

#find where dTIM starts (MART) and ends (DIINSRN)
start_seq <- regexpr("MART", aligned_proteins[aligned_proteins$protein_id == "dTIM",2], fixed=T)[1] 
end_seq <- regexpr("DIINSRN", aligned_proteins[aligned_proteins$protein_id == "dTIM",2], fixed=T)[1] 

#remove the superfluous end regions (before dTIM starts and after it ends)
aligned_proteins$sequence <- substr(aligned_proteins$sequence,start_seq,end_seq + nchar("DIINSRN")-1)

#now get the positions we want to keep (non indels)
x <- as.character(as.vector(aligned_proteins[aligned_proteins$protein_id == "dTIM",2]))
indelIndices <- c()
position <- 1
numIndels <- 1
for (i in 1:nchar(x)){
  if (substr(x,i,i) != "-"){
    indelIndices[numIndels] <- i
    numIndels <- numIndels + 1
  }
}

#now iterate through each protein and only keep the positions that were not indels in the scTIM/dTIM
for (r in 1:nrow(aligned_proteins)) {
  temp_string <- as.character(as.vector(aligned_proteins[r,2]))
  new_string <- ""
  for (i in 1:length(indelIndices)){
    new_string <- paste(new_string,substr(temp_string, indelIndices[i], indelIndices[i]),sep="") 
  }
  aligned_proteins[r,2] <- gsub("(^ +)|( +$)", "",new_string)
}

#output all of the protein sequences after reducing to the region (248 residues) of interest
write.csv(aligned_proteins,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/aligned_TIMs_proper_format.csv") 

print("done done!")

#now compute the matrix of 5508 TIMs without dTIM or scTIM
aligned_proteins_wo_dscTIM <- aligned_proteins[aligned_proteins$protein_id != "dTIM",]
aligned_proteins_wo_dscTIM <- aligned_proteins_wo_dscTIM[aligned_proteins_wo_dscTIM$protein_id != "scTIM",]

write.csv(aligned_proteins_wo_dscTIM,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/aligned_TIMs_proper_format_wo_dscTIM.csv") 

aligned_proteins_dTIM_only <- aligned_proteins[aligned_proteins$protein_id == "dTIM",]
aligned_proteins_scTIM_only <- aligned_proteins[aligned_proteins$protein_id == "scTIM",]

write.csv(aligned_proteins_dTIM_only,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/aligned_TIMs_proper_format_dTIM_only.csv") 
write.csv(aligned_proteins_scTIM_only,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/aligned_TIMs_proper_format_scTIM_only.csv") 

#############################################################
### Now Score the alignments with the Prin Comps  ###########
#############################################################


############################################################################
####     ScoreLookup translates an aa to a prin comp score             #####
############################################################################
#A/L     R/K     N/M     D/F     C/P     Q/S     E/T     G/W     H/Y     I/V
ScoreLookup <- function(aa, scores){
  if (aa=="A"){
    x<-scores[1]
  }else if (aa=="R"){
    x<-scores[2]
  }else if (aa=="N"){
    x<-scores[3]
  }else if (aa=="D"){
    x<-scores[4]
  }else if (aa=="C"){
    x<-scores[5]
  }else if (aa=="Q"){
    x<-scores[6]
  }else if (aa=="E"){
    x<-scores[7]
  }else if (aa=="G"){
    x<-scores[8]
  }else if (aa=="H"){
    x<-scores[9]
  }else if (aa=="I"){
    x<-scores[10]
  }else if (aa=="L"){
    x<-scores[11]
  }else if (aa=="K"){
    x<-scores[12]
  }else if (aa=="M"){
    x<-scores[13]
  }else if (aa=="F"){
    x<-scores[14]
  }else if (aa=="P"){
    x<-scores[15]
  }else if (aa=="S"){
    x<-scores[16]
  }else if (aa=="T"){
    x<-scores[17]
  }else if (aa=="W"){
    x<-scores[18]
  }else if (aa=="Y"){
    x<-scores[19]
  }else if (aa=="V"){
    x<-scores[20]
  }else {
    x<-0
  }
  return (x)
}

ScoreLookup("-",alpha_and_turn_prin_comps$PC1)

length_of_tims <- nchar(as.character(as.vector(aligned_proteins[aligned_proteins$protein_id == "dTIM",2])))

################################# 
###   Alpha and Turn  ###########
################################# 
#get the apha prin comps as an example
alpha_and_turn_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/alpha_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
prin_comp_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)

##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
      aa <- substr(temp_string,i,i)
      prin_comp_scored_family[r,i] <- ScoreLookup(aa, alpha_and_turn_prin_comps$PC1)
  }
  if (r %% 20 == 0){
    print(r)
  }
}

alpha_and_turn_fam_means <- colMeans(prin_comp_scored_family)
write.csv(alpha_and_turn_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_and_turn_fam_means.csv") 

#Score dTIM
prin_comp_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  prin_comp_scored_dTIM[1,i] <- ScoreLookup(aa, alpha_and_turn_prin_comps$PC1)
}
alpha_and_turn_dTIM_means <- colMeans(prin_comp_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(alpha_and_turn_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_and_turn_dTIM_scores.csv") 

#Score scTIM
prin_comp_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  prin_comp_scored_scTIM[1,i] <- ScoreLookup(aa, alpha_and_turn_prin_comps$PC1)
}
alpha_and_turn_scTIM_means <- colMeans(prin_comp_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(alpha_and_turn_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_and_turn_scTIM_scores.csv") 

alpha_turn_scTIM_m_mean <-alpha_and_turn_scTIM_means-alpha_and_turn_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_turn_scTIM_m_mean.pdf")
hist( alpha_turn_scTIM_m_mean, 
      main="Alpha and Turn: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

alpha_turn_dTIM_m_mean <-alpha_and_turn_dTIM_means-alpha_and_turn_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_turn_dTIM_m_mean.pdf")
hist( alpha_turn_dTIM_m_mean, 
      main="Alpha and Turn: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


alpha_turn_dTIM_m_scTIM <-alpha_and_turn_dTIM_means-alpha_and_turn_scTIM_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/alpha_turn_dTIM_m_scTIM.pdf")
hist( alpha_turn_dTIM_m_scTIM, 
      main="Alpha and Turn: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


################################# 
###   Beta Propensity  ##########
################################# 
#get the apha prin comps as an example
beta_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/beta_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
beta_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)

##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
    aa <- substr(temp_string,i,i)
    beta_scored_family[r,i] <- ScoreLookup(aa, beta_prin_comps$PC1)
  }
  if (r %% 100 == 0){
    print(r)
  }
}

beta_fam_means <- colMeans(beta_scored_family)
write.csv(beta_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_fam_means.csv") 

#Score dTIM
beta_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  beta_scored_dTIM[1,i] <- ScoreLookup(aa, beta_prin_comps$PC1)
}
beta_dTIM_means <- colMeans(beta_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(beta_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_dTIM_scores.csv") 

#Score scTIM
beta_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  beta_scored_scTIM[1,i] <- ScoreLookup(aa, beta_prin_comps$PC1)
}
beta_scTIM_means <- colMeans(beta_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(beta_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_scTIM_scores.csv") 

beta_scTIM_m_mean <- beta_scTIM_means - beta_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_scTIM_m_mean.pdf")
hist( beta_scTIM_m_mean, 
      main="Beta: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

beta_dTIM_m_mean <- beta_dTIM_means - beta_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_dTIM_m_mean.pdf")
hist( beta_dTIM_m_mean, 
      main="Beta: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


beta_dTIM_m_scTIM <- beta_dTIM_means - beta_scTIM_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/beta_dTIM_m_scTIM.pdf")
hist( beta_dTIM_m_scTIM, 
      main="Beta: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

################################# 
###  Composition  ##########
################################# 
#get the comp prin comps 
comp_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/composition_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
comp_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)

##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
    aa <- substr(temp_string,i,i)
    comp_scored_family[r,i] <- ScoreLookup(aa, comp_prin_comps$PC1)
  }
  if (r %% 100 == 0){
    print(r)
  }
}

comp_fam_means <- colMeans(comp_scored_family)
write.csv(comp_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_fam_means.csv") 

#Score dTIM
comp_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  comp_scored_dTIM[1,i] <- ScoreLookup(aa, comp_prin_comps$PC1)
}
comp_dTIM_means <- colMeans(comp_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(comp_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_dTIM_scores.csv") 

#Score scTIM
comp_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  comp_scored_scTIM[1,i] <- ScoreLookup(aa, comp_prin_comps$PC1)
}
comp_scTIM_means <- colMeans(comp_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(comp_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_scTIM_scores.csv") 

comp_scTIM_m_mean <- comp_scTIM_means - comp_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_scTIM_m_mean.pdf")
hist( comp_scTIM_m_mean, 
      main="Composition: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

comp_dTIM_m_mean <- comp_dTIM_means - comp_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_dTIM_m_mean.pdf")
hist( comp_dTIM_m_mean, 
      main="Composition: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


comp_dTIM_m_scTIM <- comp_dTIM_means - comp_scTIM_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/comp_dTIM_m_scTIM.pdf")
hist( comp_dTIM_m_scTIM, 
      main="Composition: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


################################# 
###### Hydrophobicity  ##########
################################# 
#get the comp prin comps 
hydro_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/hydro_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
hydro_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)

##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
    aa <- substr(temp_string,i,i)
    hydro_scored_family[r,i] <- ScoreLookup(aa, hydro_prin_comps$PC1)
  }
  if (r %% 100 == 0){
    print(r)
  }
}

hydro_fam_means <- colMeans(hydro_scored_family)
write.csv(hydro_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_fam_means.csv") 

#Score dTIM
hydro_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  hydro_scored_dTIM[1,i] <- ScoreLookup(aa, hydro_prin_comps$PC1)
}
hydro_dTIM_means <- colMeans(hydro_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(hydro_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_dTIM_scores.csv") 

#Score scTIM
hydro_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  hydro_scored_scTIM[1,i] <- ScoreLookup(aa, hydro_prin_comps$PC1)
}
hydro_scTIM_means <- colMeans(hydro_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(hydro_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_scTIM_scores.csv") 

hydro_scTIM_m_mean <- hydro_scTIM_means - hydro_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_scTIM_m_mean.pdf")
hist( hydro_scTIM_m_mean, 
      main="Hydrophobicity: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

hydro_dTIM_m_mean <- hydro_dTIM_means - hydro_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_dTIM_m_mean.pdf")
hist( hydro_dTIM_m_mean, 
      main="Hydrophobicity: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


hydro_dTIM_m_scTIM <- hydro_dTIM_means - hydro_scTIM_means
#redo this plot
pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/hydro_dTIM_m_scTIM.pdf")
hist( hydro_dTIM_m_scTIM, 
      main="Hydrophobicity: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

################################# 
#### Other Properties  ##########
################################# 
#get the comp prin comps 
other_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/other_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
other_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)
##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
    aa <- substr(temp_string,i,i)
    other_scored_family[r,i] <- ScoreLookup(aa, other_prin_comps$PC1)
  }
  if (r %% 100 == 0){
    print(r)
  }
}

other_fam_means <- colMeans(other_scored_family)
write.csv(other_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_fam_means.csv") 

#Score dTIM
other_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  other_scored_dTIM[1,i] <- ScoreLookup(aa, other_prin_comps$PC1)
}
other_dTIM_means <- colMeans(other_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(other_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_dTIM_scores.csv") 

#Score scTIM
other_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  other_scored_scTIM[1,i] <- ScoreLookup(aa, other_prin_comps$PC1)
}
other_scTIM_means <- colMeans(other_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(other_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_scTIM_scores.csv") 

other_scTIM_m_mean <- other_scTIM_means - other_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_scTIM_m_mean.pdf")
hist( other_scTIM_m_mean, 
      main="Other Properties: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

other_dTIM_m_mean <- other_dTIM_means - other_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_dTIM_m_mean.pdf")
hist( other_dTIM_m_mean, 
      main="Other Properties: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


other_dTIM_m_scTIM <- other_dTIM_means - other_scTIM_means

#redo this plot
pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/other_dTIM_m_scTIM.pdf")
hist( other_dTIM_m_scTIM, 
      main="Other Properties: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()


################################# 
# Physicochemical Properties  ###
################################# 
#get the physico prin comps 
physico_prin_comps <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/physico_prin_comps.csv", header=TRUE, sep=",") 

#this is the matrix we will fill where M[i,j] = jth prin comp score for the residue in the ith protein
physico_scored_family <- matrix(0, nrow = nrow(aligned_proteins_wo_dscTIM), ncol = length_of_tims)

##now apply to entire matrix
for (r in 1:nrow(aligned_proteins_wo_dscTIM)) {
  temp_string <- as.character(as.vector(aligned_proteins_wo_dscTIM[r,2]))
  for (i in 1:nchar(temp_string)){
    aa <- substr(temp_string,i,i)
    physico_scored_family[r,i] <- ScoreLookup(aa, physico_prin_comps$PC1)
  }
  if (r %% 100 == 0){
    print(r)
  }
}

physico_fam_means <- colMeans(physico_scored_family)
write.csv(physico_fam_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_fam_means.csv") 

#Score dTIM
physico_scored_dTIM <- matrix(0, nrow = 1, ncol = length_of_tims)

temp_string <- as.character(as.vector(aligned_proteins_dTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  physico_scored_dTIM[1,i] <- ScoreLookup(aa, physico_prin_comps$PC1)
}
physico_dTIM_means <- colMeans(physico_scored_dTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(physico_dTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_dTIM_scores.csv") 

#Score scTIM
physico_scored_scTIM <- matrix(0, nrow = 1, ncol = length_of_tims)
temp_string <- as.character(as.vector(aligned_proteins_scTIM_only[1,2]))
for (i in 1:nchar(temp_string)){
  aa <- substr(temp_string,i,i)
  physico_scored_scTIM[1,i] <- ScoreLookup(aa, physico_prin_comps$PC1)
}
physico_scTIM_means <- colMeans(physico_scored_scTIM ) #this is just trivial value/1 average to maintain common code pattern
write.csv(physico_scTIM_means,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_scTIM_scores.csv") 

physico_scTIM_m_mean <- physico_scTIM_means - physico_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_scTIM_m_mean.pdf")
hist( physico_scTIM_m_mean, 
      main="Physicochemical Properties: scTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

physico_dTIM_m_mean <- physico_dTIM_means - physico_fam_means

pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_dTIM_m_mean.pdf")
hist( physico_dTIM_m_mean, 
      main="Physicochemical Properties: dTIM Minus Family Mean",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

physico_dTIM_m_scTIM <- physico_dTIM_means - physico_scTIM_means

#replot this
pdf(file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/physico_dTIM_m_scTIM.pdf")
hist( physico_dTIM_m_scTIM, 
      main="Physicochemical Properties: dTIM Minus scTIM",
      freq=FALSE,
      breaks = 20, 
      col="lightgreen", 
      border="black")
dev.off()

############################################################################
####               Plot all histograms on One Plot                     #####
############################################################################
alpha_turn_dTIM_m_mean_df <- as.data.frame(alpha_turn_dTIM_m_mean)
beta_dTIM_m_mean_df  <- as.data.frame(beta_dTIM_m_mean)
comp_dTIM_m_mean_df <- as.data.frame(comp_dTIM_m_mean)
hydro_dTIM_m_mean_df  <- as.data.frame(hydro_dTIM_m_mean)
other_dTIM_m_mean_df  <- as.data.frame(other_dTIM_m_mean)
physico_dTIM_m_mean_df <- as.data.frame(physico_dTIM_m_mean)

#Now, combine your two dataframes into one.  First make a new column in each.
alpha_turn_dTIM_m_mean_df$characteristic <- 'alpha'
beta_dTIM_m_mean_df$characteristic  <- 'beta'
comp_dTIM_m_mean_df$characteristic <- 'comp'
hydro_dTIM_m_mean_df$characteristic  <-  'hydro'
other_dTIM_m_mean_df$characteristic  <- 'other'
physico_dTIM_m_mean_df$characteristic <-  'physico'

names(alpha_turn_dTIM_m_mean_df)[1] <- "dTIMmMean"
names(beta_dTIM_m_mean_df)[1] <- "dTIMmMean"
names(comp_dTIM_m_mean_df)[1] <- "dTIMmMean"
names(hydro_dTIM_m_mean_df)[1] <- "dTIMmMean"
names(other_dTIM_m_mean_df)[1] <- "dTIMmMean"
names(physico_dTIM_m_mean_df)[1] <- "dTIMmMean"


#and combine into your new data frame vegLengths
allDists <- rbind(alpha_turn_dTIM_m_mean_df, 
                  beta_dTIM_m_mean_df,
                  comp_dTIM_m_mean_df,
                  hydro_dTIM_m_mean_df,
                  other_dTIM_m_mean_df,
                  physico_dTIM_m_mean_df)

#now make your lovely plot
ggplot(allDists, aes(x = dTIMmMean))  +
geom_histogram(data=subset(allDists,characteristic == "alpha"),fill = "red", alpha = 0.2) +
geom_histogram(data=subset(allDists,characteristic == "beta"),fill = "grey", alpha = 0.2) +
geom_histogram(data=subset(allDists,characteristic == "comp"),fill = "blue", alpha = 0.2) +
geom_histogram(data=subset(allDists,characteristic == "hydro"),fill = "green", alpha = 0.2) +
geom_histogram(data=subset(allDists,characteristic == "other"),fill = "purple", alpha = 0.2) +
geom_histogram(data=subset(allDists,characteristic == "physico"),fill = "yellow", alpha = 0.2)

ggplot(allDists, aes(x = dTIMmMean))  +
  geom_histogram(data=subset(allDists,characteristic == "alpha"),fill = "red", alpha = 0.2) +
  geom_histogram(data=subset(allDists,characteristic == "beta"),fill = "grey", alpha = 0.2) +
  geom_histogram(data=subset(allDists,characteristic == "comp"),fill = "blue", alpha = 0.2) +
  geom_histogram(data=subset(allDists,characteristic == "hydro"),fill = "green", alpha = 0.2) +
  geom_histogram(data=subset(allDists,characteristic == "other"),fill = "purple", alpha = 0.2) +
  geom_histogram(data=subset(allDists,characteristic == "physico"),fill = "yellow", alpha = 0.2) + 
  geom_histogram(aes(fill = ..count..)) +
  scale_fill_gradient("count", low = "red",high = "green") +
  facet_wrap(~ characteristic)

# + opts(title="Normal Random Sample")

############################################################################
####                     Scatterplot Matrix                            #####
############################################################################
alpha_turn_dTIM_m_mean_df <- as.data.frame(alpha_turn_dTIM_m_mean)
beta_dTIM_m_mean_df  <- as.data.frame(beta_dTIM_m_mean)
comp_dTIM_m_mean_df <- as.data.frame(comp_dTIM_m_mean)
hydro_dTIM_m_mean_df  <- as.data.frame(hydro_dTIM_m_mean)
other_dTIM_m_mean_df  <- as.data.frame(other_dTIM_m_mean)
physico_dTIM_m_mean_df <- as.data.frame(physico_dTIM_m_mean)

allDists <- data.frame(alpha_pc_dTIM_m_mean = alpha_turn_dTIM_m_mean ,
                       beta_pc_dTIM_m_mean = beta_dTIM_m_mean ,
                       comp_pc_dTIM_m_mean = comp_dTIM_m_mean ,
                       hydro_pc_dTIM_m_mean = hydro_dTIM_m_mean ,
                       other_pc_dTIM_m_mean = other_dTIM_m_mean ,
                       physico_pc_dTIM_m_mean = physico_dTIM_m_mean )

pairs(~alpha_pc_dTIM_m_mean
       +beta_pc_dTIM_m_mean 
       + comp_pc_dTIM_m_mean 
       + hydro_pc_dTIM_m_mean
       + other_pc_dTIM_m_mean
       + physico_pc_dTIM_m_mean
       ,data = allDists, 
      main="ScatterPlot of AA Characteristics: dTIM Prin Comp - Mean Prin Comp")

 