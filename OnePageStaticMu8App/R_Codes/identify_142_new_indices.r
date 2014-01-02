######################################################################################################
# CS171 BioVis Project  
# Spring 2013
# Author: John Mercer
# Code: this code Identifies and classifies the 142 new indices since the 2008 paper
#######################################################################################################

getwd()
biovis_working_directory = "/Users/mercicle/Documents/python_workspace/BioVis/Codes/R_Codes_And_Data"
setwd(biovis_working_directory)

#establish a connection to the 544 list (can't use read.table because no commas)
con <- file("/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/index_list_544.txt", 'r') 

#read all lines into data
data <- readLines(con)
close(con)
#prepare two columns 
index_id <- c()
description <- c()

#iterate through the lines and make two columns (index, description)
for (line in data){
  index_id = append(index_id, substr(line,1,11))
  description <- append(description, substr(line,12,nchar(line)))
}

#put into dataframe
all_544_index_list <- data.frame(ID=index_id,description=description)

#output the csv format of the list to a file for later use
write.csv(all_544_index_list,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/index_list_544_in_csv_format.csv") 

#read in the 402 list to compare with the 544 list.
index_list_402 <- read.table("/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/index_list_402.csv",header=TRUE,sep = ",")
 
index_list_402 <- as.data.frame(index_list_402)
index_list_402$ID = gsub("(^ +)|( +$)", "",index_list_402$ID )

all_544_index_list$ID = gsub("(^ +)|( +$)", "",all_544_index_list$ID)

#this is the subset is taken to only indices not in the 402 list (so new indices)
index_list_402$initial_list <- 1
merged_to_subset <- merge(all_544_index_list, index_list_402, by="ID",all.x=TRUE)

new_indices <- merged_to_subset[is.na(merged_to_subset$initial_list)==TRUE,]
new_indices$index_category<-"other"
new_indices$index_category[grepl("hydrophobicity", tolower(new_indices$description)) ==TRUE]<- "Hydrophobicity"
new_indices$index_category[grepl("alpha", tolower(new_indices$description)) ==TRUE]<- "alpha and turn"
new_indices$index_category[grepl("helix", tolower(new_indices$description)) ==TRUE]<- "alpha and turn"
new_indices$index_category[grepl("turn", tolower(new_indices$description)) ==TRUE]<- "alpha and turn"
new_indices$index_category[grepl("beta", tolower(new_indices$description)) ==TRUE]<- "beta"
new_indices$index_category[grepl("composition", tolower(new_indices$description)) ==TRUE]<- "composition"
new_indices$index_category[grepl("physicochemical", tolower(new_indices$description)) ==TRUE]<- "physicochemical"

write.csv(new_indices,file="/Users/mercicle/Documents/python_workspace/BioVis/Codes/IndexData/new_indices_142_in_csv_format.csv") 

