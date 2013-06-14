######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: Makes the dTIM ans scTIM arrays for the visualization
#######################################################################################################

############### 
### dTIM ###### 
############### 
output_vector <- c()
seq <- as.character( aligned_proteins_dTIM_only$sequence)
for (i in 1: nchar(aligned_proteins_dTIM_only$sequence)) {
  output_vector = append(output_vector, substr(seq,i,i))
  #paste(substr(seq,i,i),",",sep="")
}
     
#write(output_vector,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/TIMData/dTIM_for_web.txt") 


sink("json.txt")
cat(toJSON(output_vector))
sink()

file.show("json.txt")

############### 
### scTIM ##### 
############### 
output_vector <- c()
scTIM <-"MARTFFVGGNFKLNGSKQSIKEIVERLNTASIPENVEVVICPPATYLDYSVSLVKKPQVTVGAQNAYLKASGAFTGENSVDQIKDVGAKWVILGHSERRSYFHEDDKFIADKTKFALGQGVGVILCIGETLEEKKAGKTLDVVERQLNAVLEEVKDWTNVVVAYEPVWAIGTGLAATPEDAQDIHASIRKFLASKLGDKAASELRILYGGSANGSNAVTFKDKADVDGFLVGGASLKPEFVDIINSRN"
for (i in 1: nchar(scTIM)) {
  output_vector = append(output_vector, substr(scTIM,i,i))
}

sink("json.txt")
cat(toJSON(output_vector))
sink()

file.show("json.txt")


