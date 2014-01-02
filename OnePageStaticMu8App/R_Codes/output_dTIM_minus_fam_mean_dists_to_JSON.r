######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: Exports the Distributions of dTIM - Family Mean for each characteristic
#       in 2 formats:
#       1) array format with just the scores (dTIM - family mean)
#       2) JSON format for the web:
#          var alpha_dTIM_m_mean = [ "points": [["M",1,-9.73667521555713],["A",2,-4.8740732206122],...]];
######################################################################################################################


######################################################################################################################
## Format 1: Just the values [value1, value2, ...., valueN]
######################################################################################################################

getwd()
setwd("/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format1")

############### 
### alpha ##### 
############### 

sink("alpha_turn_dTIM_m_mean.txt")
cat(toJSON(alpha_turn_dTIM_m_mean))
sink()

file.show("alpha_turn_dTIM_m_mean.txt")

############### 
### beta ######
############### 

sink("beta_dTIM_m_mean.txt")
cat(toJSON(beta_dTIM_m_mean))
sink()

file.show("beta_dTIM_m_mean.txt")

############### 
### comp ######
############### 

sink("comp_dTIM_m_mean.txt")
cat(toJSON(comp_dTIM_m_mean))
sink()

file.show("comp_dTIM_m_mean.txt")

###############
### other #####
###############

sink("other_dTIM_m_mean.txt")
cat(toJSON(other_dTIM_m_mean))
sink()

file.show("other_dTIM_m_mean.txt")

###############
### physico ###
###############

sink("physico_dTIM_m_mean.txt")
cat(toJSON(physico_dTIM_m_mean))
sink()

file.show("physico_dTIM_m_mean.txt")

###############
###  hydro  ###
###############

sink("hydro_dTIM_m_mean.txt")
cat(toJSON(hydro_dTIM_m_mean))
sink()

file.show("hydro_dTIM_m_mean.txt")


######################################################################################################################
## Format 2:  [ ["M",8.19], ["A",0.13],...] format
######################################################################################################################

############### 
### dTIM ###### 
############### 
dTIM_vector <- c()
seq <- as.character( aligned_proteins_dTIM_only$sequence)
length_of_seq <- nchar(aligned_proteins_dTIM_only$sequence)
  
############### 
### alpha ##### 
############### 

final_output<- 'var alpha_dTIM_m_mean = { "points": ['
for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,alpha_turn_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,alpha_turn_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")
final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/alpha_dTIM_m_mean.js") 

###############
### beta ######
############### 

final_output<- 'var beta_dTIM_m_mean = { "points": ['
for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,beta_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,beta_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")
final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/beta_dTIM_m_mean.js") 


############### 
### comp ######
############### 

final_output<- 'var comp_dTIM_m_mean = { "points": ['
for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,comp_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,comp_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")
final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/comp_dTIM_m_mean.js") 

############### 
### other  ####
############### 

final_output<- 'var other_dTIM_m_mean = { "points": ['
for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,other_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,other_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")
final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/other_dTIM_m_mean.js") 

############### 
## physico  ###
############### 

final_output<- 'var physico_dTIM_m_mean = { "points": ['
for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,physico_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,physico_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")
final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/physico_dTIM_m_mean.js") 

############### 
##  hydro   ###
############### 

final_output<- 'var hydro_dTIM_m_mean = { "points": ['

for (i in 1: length_of_seq) {
  #first the amino acid
  final_output = paste(final_output,'["',substr(seq,i,i), '",', sep="")
  
  #now the residue index
  final_output = paste(final_output,i, ',', sep="")
  
  #now the score
  if(i != length_of_seq){
    final_output = paste(final_output,hydro_dTIM_m_mean[i], '],', sep="") 
  }else{
    final_output = paste(final_output,hydro_dTIM_m_mean[i], ']', sep="")
  }
}
final_output = paste(final_output,']};', sep="")

final_output <- gsub("(^ +)|( +$)", "",final_output)

write(final_output,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/PrinCompData/ScoredTIMs/JSON_For_Web/Format2/hydro_dTIM_m_mean.js") 

 